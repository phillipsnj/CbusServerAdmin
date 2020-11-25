'use strict';
var winston = require('winston');		// use config from root instance

const net = require('net')
const jsonfile = require('jsonfile')
const cbusMessage = require('./mergCbusMessage.js')
//const merg = jsonfile.readFileSync('./nodeConfig.json')

let cbusLib = require('./cbusLibrary.js')

const EventEmitter = require('events').EventEmitter;

function pad(num, len) { //add zero's to ensure hex values have correct number of characters
    var padded = "00000000" + num;
    return padded.substr(-len);
}

function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    //return (num + Math.pow(16, len)).toString(16).slice(-len).toUpperCase()
    return padded.substr(-len)
}

class cbusAdmin extends EventEmitter {
    constructor(CONFIG_FILE, NET_ADDRESS, NET_PORT) {
        const setup = jsonfile.readFileSync(CONFIG_FILE)
        const merg = jsonfile.readFileSync('./config/mergConfig.json')
        super();
        this.merg = merg
		winston.debug({message: `merg :${JSON.stringify(this.merg)}`});
		//winston.debug({message: `merg- 32 :${JSON.stringify(this.merg['modules'][32]['name'])}`});
        this.config = setup
        this.configFile = CONFIG_FILE
        this.pr1 = 2
        this.pr2 = 3
        this.canId = 60
        this.config.nodes = {}
        this.config.events = {}
        this.cbusErrors = {}
        this.cbusNoSupport = {}
        this.dccSessions = {}
        this.saveConfig()
        const outHeader = ((((this.pr1 * 4) + this.pr2) * 128) + this.canId) << 5
        this.header = ':S' + outHeader.toString(16).toUpperCase() + 'N'
        this.client = new net.Socket()
        this.client.connect(NET_PORT, NET_ADDRESS, function () {
			winston.debug({message: 'Client Connected'});
        })
        this.client.on('data', function (data) { //Receives packets from network and process individual Messages
            const outMsg = data.toString().split(";");
            for (var i = 0; i < outMsg.length - 1; i++) {
                let cbusMsg = cbusLib.decode(outMsg[i])
				winston.debug({message: "mergAdminNode In " + outMsg[i] + " : " + cbusMsg.text});
                let msg = new cbusMessage.cbusMessage(outMsg[i] + ';');		// replace terminator removed by 'split' method
				this.emit('cbusTraffic', {direction: 'In', raw: msg.messageOutput(), translated: msg.translateMessage()});
                //winston.debug({message: `CbusAdminServer Message Rv: ${i}  ${msg.opCode()} ${msg.nodeId()} ${msg.eventId()} ${msg.messageOutput()} ${msg.header()}`});
                this.action_message(msg, cbusMsg)
            }
        }.bind(this))
        this.client.on('error', (err) => {
			winston.debug({message: 'TCP ERROR ${err.code}'});
        })
        this.client.on('close', function () {
			winston.debug({message: 'Connection Closed'});
            setTimeout(() => {
                this.client.connect(NET_PORT, NET_ADDRESS, function () {
					winston.debug({message: 'Client ReConnected'});
                })
            }, 1000)
        }.bind(this))
        this.actions = { //actions when Opcodes are received
            '00': (tmp, cbusMsg) => { // ACK
				winston.debug({message: "ACK (00) : No Action"});
            },
            '21': (tmp, cbusMsg) => { // KLOC
				winston.debug({message: `Session Cleared : ${cbusMsg.session}`});
                let ref = cbusMsg.opCode
                let session = cbusMsg.session
                if (session in this.dccSessions) {
                    this.dccSessions[session].status = 'In Active'
                } else {
					winston.debug({message:`Session ${session} does not exist - adding`});
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 1
                    this.dccSessions[session].status = 'In Active'
                    this.cbusSend(this.QLOC(session))
                }
                this.emit('dccSessions', this.dccSessions)
            },
            '23': (tmp, cbusMsg) => { // DKEEP
				winston.debug({message: `Session Keep Alive : ${cbusMsg.session}`});
                let ref = cbusMsg.opCode
                let session = cbusMsg.session
                if (session in this.dccSessions) {
                    this.dccSessions[session].count += 1
                    this.dccSessions[session].status = 'Active'
                } else {
					winston.debug({message: `Session ${session} does not exist - adding`});
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 1
                    this.dccSessions[session].status = 'Active'
                    this.cbusSend(this.QLOC(session))
                }
                this.emit('dccSessions', this.dccSessions)
            },
            '47': (tmp, cbusMsg) => { // DSPD
                let session = cbusMsg.session
                let speed = cbusMsg.speed
                let direction = cbusMsg.direction
				winston.debug({message: `(47) DCC Speed Change : ${session} : ${direction} : ${speed}`});
                if (!(session in this.dccSessions)) {
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 0
                }
                this.dccSessions[session].direction = direction
                this.dccSessions[session].speed = speed
                this.emit('dccSessions', this.dccSessions)
                //this.cbusSend(this.QLOC(session))
            },
            '50': (tmp, cbusMsg) => {// RQNN -  Node Number
                this.emit('requestNodeNumber')
            },
            '52': (msg) => {
				winston.debug({message: "NNACK (59) : " + msg.opCode() + ' ' + msg.messageOutput() + ' ' + msg.deCodeCbusMsg()});
            },
            '59': (msg) => {
				winston.debug({message: "WRACK (59) : " + msg.opCode() + ' ' + msg.messageOutput() + ' ' + msg.deCodeCbusMsg()});
            },
            '60': (tmp, cbusMsg) => {
                let session = cbusMsg.session
                if (!(session in this.dccSessions)) {
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 0
                }
                let functionRange = cbusMsg.Fn1
                let dccNMRA = cbusMsg.Fn2
                let func = `F${functionRange}`
                this.dccSessions[session][func] = dccNMRA
                let functionArray = []
                if (this.dccSessions[session].F1 & 1) functionArray.push(1)
                if (this.dccSessions[session].F1 & 2) functionArray.push(2)
                if (this.dccSessions[session].F1 & 4) functionArray.push(3)
                if (this.dccSessions[session].F1 & 8) functionArray.push(4)
                if (this.dccSessions[session].F2 & 1) functionArray.push(5)
                if (this.dccSessions[session].F2 & 2) functionArray.push(6)
                if (this.dccSessions[session].F2 & 4) functionArray.push(7)
                if (this.dccSessions[session].F2 & 8) functionArray.push(8)
                if (this.dccSessions[session].F3 & 1) functionArray.push(9)
                if (this.dccSessions[session].F3 & 2) functionArray.push(10)
                if (this.dccSessions[session].F3 & 4) functionArray.push(11)
                if (this.dccSessions[session].F3 & 8) functionArray.push(12)
                if (this.dccSessions[session].F4 & 1) functionArray.push(13)
                if (this.dccSessions[session].F4 & 2) functionArray.push(14)
                if (this.dccSessions[session].F4 & 4) functionArray.push(15)
                if (this.dccSessions[session].F4 & 8) functionArray.push(16)
                if (this.dccSessions[session].F4 & 16) functionArray.push(17)
                if (this.dccSessions[session].F4 & 32) functionArray.push(18)
                if (this.dccSessions[session].F4 & 64) functionArray.push(19)
                if (this.dccSessions[session].F4 & 128) functionArray.push(20)
                if (this.dccSessions[session].F5 & 1) functionArray.push(21)
                if (this.dccSessions[session].F5 & 2) functionArray.push(22)
                if (this.dccSessions[session].F5 & 4) functionArray.push(23)
                if (this.dccSessions[session].F5 & 8) functionArray.push(24)
                if (this.dccSessions[session].F5 & 16) functionArray.push(25)
                if (this.dccSessions[session].F5 & 32) functionArray.push(26)
                if (this.dccSessions[session].F5 & 64) functionArray.push(27)
                if (this.dccSessions[session].F5 & 128) functionArray.push(28)
                this.dccSessions[session].functions = functionArray
				winston.debug({message: `DCC Set Engine Function : ${cbusMsg.session} ${functionRange} ${dccNMRA} : ${functionArray}`});
                this.emit('dccSessions', this.dccSessions)
                //this.cbusSend(this.QLOC(session))
            },
            '63': (tmp, cbusMsg) => {//CMDERR
				//winston.debug({message: `CMD ERROR Node ${msg.nodeId()} Error ${msg.errorId()}`});
                let output = {}
                output['type'] = 'DCC'
                output['Error'] = cbusMsg.errorNumber
                output['Message'] = this.merg.dccErrors[cbusMsg.errorNumber]
                output['data'] = decToHex(cbusMsg.data1, 2) + decToHex(cbusMsg.data2, 2)
                this.emit('dccError', output)
            },
            '6F': (tmp, cbusMsg) => {//Cbus Error
                let ref = cbusMsg.nodeNumber.toString() + '-' + cbusMsg.errorNumber.toString()
                if (ref in this.cbusErrors) {
                    this.cbusErrors[ref].count += 1
                } else {
                    let output = {}
                    output['id'] = ref
                    output['type'] = 'CBUS'
                    output['Error'] = cbusMsg.errorNumber
                    output['Message'] = this.merg.cbusErrors[cbusMsg.errorNumber]
                    output['node'] = cbusMsg.nodeNumber
                    output['count'] = 1
                    this.cbusErrors[ref] = output
                }
                this.emit('cbusError', this.cbusErrors)
            },
            '74': (msg) => {
				//winston.debug({message: `NUMNEV (74) : ${msg.nodeId()} :: ${msg.paramId()}`});
                if (this.config.nodes[msg.nodeId()].EvCount != null) {
                    if (this.config.nodes[msg.nodeId()].EvCount != msg.variableId()) {
                        this.config.nodes[msg.nodeId()].EvCount = msg.variableId()
                        this.saveConfig()
                    } else {
						winston.debug({message: `EvCount value has not changed`});
                    }
                } else {
                    this.config.nodes[msg.nodeId()].EvCount = msg.variableId()
                    this.saveConfig()
                }
            },
            '90': (msg) => {//Accessory On Long Event
                this.eventSend(msg, 'on', 'long')
            },
            '91': (msg) => {//Accessory Off Long Event
                this.eventSend(msg, 'off', 'long')
            },
            '97': (msg) => { //Receive Node Variable Value
				//winston.debug({message: `NVANS (97) Node ${msg.nodeId()} : ${msg.variableId()} : ${msg.variableVal()}`});
                if (this.config.nodes[msg.nodeId()].variables[msg.variableId()] != null) {
                    if (this.config.nodes[msg.nodeId()].variables[msg.variableId()] != msg.variableVal()) {
						winston.debug({message: `Variable ${msg.variableId()} value has changed`});
                        this.config.nodes[msg.nodeId()].variables[msg.variableId()] = msg.variableVal()
                        this.saveConfig()
                    } else {
						winston.debug({message: `Variable ${msg.variableId()} value has not changed`});
                    }
                } else {
					winston.debug({message: `Variable ${msg.variableId()} value does not exist in config`});
                    this.config.nodes[msg.nodeId()].variables[msg.variableId()] = msg.variableVal()
                    this.saveConfig()
                }
                //this.config.nodes[msg.nodeId()].variables[msg.variableId()] = msg.variableVal()
                //this.saveConfig()
            },
            '98': (msg) => {//Accessory On Long Event
                this.eventSend(msg, 'on', 'short')
            },
            '99': (msg) => {//Accessory Off Long Event
                this.eventSend(msg, 'off', 'short')
            },
            '9B': (msg) => {//PARAN Parameter readback by Index
				//winston.debug({message: `PARAN (9B) ${msg.nodeId()} Parameter ${msg.paramId()} Value ${msg.paramValue()}`});
                if (this.config.nodes[msg.nodeId()].parameters[msg.paramId()] != null) {
                    if (this.config.nodes[msg.nodeId()].parameters[msg.paramId()] != msg.paramValue()) {
						winston.debug({message: `Parameter ${msg.paramId()} value has changed`});
                        this.config.nodes[msg.nodeId()].parameters[msg.paramId()] = msg.paramValue()
                        this.saveConfig()
                    } else {
						winston.debug({message: `Parameter ${msg.paramId()} value has not changed`});
                    }
                } else {
					winston.debug({message: `Parameter ${msg.paramId()} value does not exist in config`});
                    this.config.nodes[msg.nodeId()].parameters[msg.paramId()] = msg.paramValue()
                    this.saveConfig()
                }
                //this.config.nodes[msg.nodeId()].parameters[msg.paramId()] = msg.paramValue()
                //this.saveConfig()
            },
            'B5': (msg) => {//Read of EV value Response REVAL
				//winston.debug({message: `REVAL (B5) ${msg.nodeId()} Event : ${msg.actionEventIndex()} Event Variable : ${msg.actionEventVarId()} Event Variable Value : ${msg.actionEventVarVal()}`});
                if (this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] != null) {
					//winston.debug({message: `Event Variable Exists `});
                    if (this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] != msg.actionEventVarVal()) {
						winston.debug({message: 'Event Variable ${msg.actionEventVarId()} Value has Changed '});
                        this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] = msg.actionEventVarVal()
                        this.saveConfig()
                    } else {
						winston.debug({message: `Event Variable ${msg.actionEventVarId()} Value has not Changed `});
                    }
                } else {
					winston.debug({message: `Event Variable ${msg.actionEventVarId()} Does not exist on config`});
                    this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] = msg.actionEventVarVal()
                    this.saveConfig()
                }
                //this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] = msg.actionEventVarVal()
                //this.saveConfig()
            },
            'B6': (msg) => { //PNN Recieved from Node
				//winston.debug({message: `merg :${JSON.stringify(this.merg)}`});
                const ref = msg.nodeId()

                //winston.debug({message: `PNN (B6) Node found ${msg.messageOutput()} NodeId ${msg.nodeId()} ManufId ${msg.manufId()} ModuleId ${msg.moduleId()} flags ${msg.flags()}`})
                if (ref in this.config.nodes) {
                    this.config.nodes[ref].flim = (msg.flags() & 4) ? true : false
                    if (this.merg['modules'][msg.moduleId()]) {
                        this.config.nodes[ref].module = this.merg['modules'][msg.moduleId()]['name']
                        this.config.nodes[ref].component = this.merg['modules'][msg.moduleId()]['component']
                    } else {
                        this.config.nodes[ref].component = 'mergDefault'
                    }
                } else {
                    let output = {
                        "node": msg.nodeId(),
                        "manuf": msg.manufId(),
                        "module": msg.moduleId(),
                        "flags": msg.flags(),
                        "consumer": false,
                        "producer": false,
                        "flim": false,
                        "bootloader": false,
                        "coe": false,
                        "parameters": [],
                        "variables": [],
                        "actions": {},
                        "status": true

                    }
                    if (this.merg['modules'][msg.moduleId()]) {
                        output['module'] = this.merg['modules'][msg.moduleId()]['name']
                        output['component'] = this.merg['modules'][msg.moduleId()]['component']
                    } else {
                        output['component'] = 'mergDefault'
                    }

                    this.config.nodes[ref] = output
                    //this.saveConfig()
                    let outFlags = pad(msg.flags().toString(2), 8)
					//winston.debug({message: `Flags : ${outFlags} : ${outFlags.substr(7, 1)}`});
                    this.config.nodes[ref].consumer = (msg.flags() & 1) ? true : false
                    this.config.nodes[ref].producer = (msg.flags() & 2) ? true : false
                    this.config.nodes[ref].flim = (msg.flags() & 4) ? true : false
                    this.config.nodes[ref].bootloader = (msg.flags() & 8) ? true : false
                    this.config.nodes[ref].coe = (msg.flags() & 16) ? true : false
                    this.config.nodes[ref].learn = (msg.flags() & 16) ? true : false
                }
                this.config.nodes[ref].status = true
                this.cbusSend((this.RQEVN(msg.nodeId())))
                this.saveConfig()
            },
            'E1': (msg) => {
                let session = msg.sessionId()
                let loco = msg.locoId()
                let speed = msg.locoSpeed()
                let direction = 'Reverse'
                let F1 = msg.locoF1()
                let F2 = msg.locoF2()
                let F3 = msg.locoF3()
				//winston.debug({message: `Engine Report : ${session} : ${speed} : ${direction}`});
                if (speed > 127) {
                    direction = 'Forward'
                    speed = speed - 128
                }
                if (!(session in this.dccSessions)) {
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 0
                }
                this.dccSessions[session].id = session
                this.dccSessions[session].loco = loco
                this.dccSessions[session].direction = direction
                this.dccSessions[session].speed = speed
                this.dccSessions[session].status = 'Active'
                this.dccSessions[session].F1 = F1
                this.dccSessions[session].F2 = F2
                this.dccSessions[session].F3 = F3
                this.emit('dccSessions', this.dccSessions)
            },
            'EF': (msg) => {//Request Node Parameter in setup
                // mode
				//winston.debug({message: `PARAMS (EF) Received`});
            },
            'F2': (msg) => {//ENSRP Response to NERD/NENRD
				// ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
                //winston.debug({message: `ENSRP (F2) Response to NERD : Node : ${msg.nodeId()} Action : ${msg.actionId()} Action Number : ${msg.actionEventId()}`});
                const ref = msg.actionEventId()
                if (!(ref in this.config.nodes[msg.nodeId()].actions)) {
                    this.config.nodes[msg.nodeId()].actions[msg.actionEventId()] = {
                        "event": msg.actionId(),
                        "actionId": msg.actionEventId(),
                        "eventIndex": msg.actionEventId(),
                        "variables": [this.config.nodes[msg.nodeId()].parameters[5]],
                    }
                    if (this.config.nodes[msg.nodeId()].module == "Universal") {
                        setTimeout(()=>{this.cbusSend(this.REVAL(msg.nodeId(), msg.actionEventId(), 0))},50*ref)
                        setTimeout(()=>{this.cbusSend(this.REVAL(msg.nodeId(), msg.actionEventId(), 1))},100*ref)
                    }
                    this.saveConfig()
                }
                //this.saveConfig()
            },
            'DEFAULT': (msg) => {
				winston.debug({message: "Opcode " + msg.opCode() + ' NodeId ' + msg.nodeId() + ' is not supported by the Admin module'});
                let ref = msg.opCode()
                if (ref in this.cbusNoSupport) {
                    this.cbusNoSupport[ref].msg = msg
                    this.cbusNoSupport[ref].count += 1
                } else {
                    let output = {}
                    output['opCode'] = msg.opCode()
                    output['msg'] = msg
                    output['count'] = 1
                    this.cbusNoSupport[ref] = output
                }
                this.emit('cbusNoSupport', this.cbusNoSupport)
            }
        }
    }

    action_message(msg, cbusMsg) {
        if (this.actions[msg.opCode()]) {
            this.actions[msg.opCode()](msg, cbusMsg);
        } else {
            this.actions['DEFAULT'](msg, cbusMsg);
        }
    }

    removeNodeEvents(nodeId) {
        this.config.nodes[nodeId].actions = {}
        this.saveConfig()
    }

    clearCbusErrors() {
        this.cbusErrors = {}
        this.emit('cbusError', this.cbusErrors)
    }

    cbusSend(msg) {
		if (typeof msg !== 'undefined') {
			//winston.debug({message: `cbusSend Base : ${msg.toUpperCase()}`});
			this.client.write(msg.toUpperCase());

            let outMsg = new cbusMessage.cbusMessage(msg);
//			this.emit('cbus', 'Outbound: ' + msg.toUpperCase());
			this.emit('cbusTraffic', {direction: 'Out', raw: outMsg.messageOutput(), translated: outMsg.translateMessage()});
		}
    }

    refreshEvents() {
        this.emit('events', Object.values(this.config.events))
    }

    eventSend(msg, status, type) {
        let eId = ''
        if (type == 'long') {
            eId = msg.fullEventId()
        } else {
            eId = msg.shortEventId()
        }
		//winston.debug({message: `EventSend :${JSON.stringify(msg)}`});
        if (eId in this.config.events) {
            this.config.events[eId]['status'] = status
            this.config.events[eId]['count'] += 1
        } else {
            let output = {}
            output['id'] = eId
            output['nodeId'] = msg.nodeId()
            output['eventId'] = msg.eventId()
            output['status'] = status
            output['type'] = type
            output['count'] = 1
            this.config.events[eId] = output
        }
        //this.saveConfig()
        /*let events = []
        for (let event in this.config.events){
            events.push(this.config.events[event])
        }*/
        this.emit('events', Object.values(this.config.events));
        //this.client.write('events');
    }

    saveConfig() {
		//winston.debug({message: `Save Config `});
        //this.config.events = this.events
        //
        //
        //
        // jsonfile.writeFileSync(this.configFile, this.config, {spaces: 2, EOL: '\r\n'})
        //let nodes = []
        /*for (let node in this.config.nodes){
            nodes.push(this.config.nodes[node])
        }*/
        this.emit('nodes', this.config.nodes);
        //this.emit('nodes', Object.values(this.config.nodes))
    }

    QNN() {//Query Node Number
        for (let node in this.config.nodes) {
            this.config.nodes[node].status = false
        }
        return this.header + '0D' + ';'
    }

    RQNP() {//Request Node Parameters
        return this.header + '10' + ';'
    }

    RQNPN(nodeId, param) {//Read Node Parameter
        return this.header + '73' + decToHex(nodeId, 4) + decToHex(param, 2) + ';'
    }

    NNLRN(nodeId) {
		if (nodeId >= 0 && nodeId <= 0xFFFF) {
			return this.header + '53' + decToHex(nodeId, 4) + ';'
		}
    }

    SNN(nodeId) {
        if (nodeId >= 0 && nodeId <= 0xFFFF) {
            return this.header + '42' + decToHex(nodeId, 4) + ';'
        }
    }

    NNULN(nodeId) {
        return this.header + '54' + decToHex(nodeId, 4) + ';'
    }

    NERD(nodeId) {//Request All Events
        return this.header + '57' + decToHex(nodeId, 4) + ';'
    }

    NENRD(nodeId, eventId) { //Request specific event
        return this.header + '72' + decToHex(nodeId, 4) + decToHex(eventId, 2) + ';'
    }

    REVAL(nodeId, eventId, valueId) {//Read an Events EV by index
		//winston.debug({message: `Reval NodeId : ${nodeId} EventId : ${eventId} Event Value : ${valueId}`});
        return this.header + '9C' + decToHex(nodeId, 4) + decToHex(eventId, 2) + decToHex(valueId, 2) + ';'
    }

    EVLRN(event, variableId, valueId) {//Read an Events EV by index
		//winston.debug({message: `EVLRN Event : ${event} EventId : ${eventId} Event Value : ${valueId}`});
        return this.header + 'D2' + event + decToHex(variableId, 2) + decToHex(valueId, 2) + ';'
    }

    EVULN(event) {//Read an Events EV by index
		//winston.debug({message: `EVULN Event : ${event}`});
        return this.header + '95' + event + ';'
    }

    NVRD(nodeId, variableId) {// Read Node Variable
        return this.header + '71' + decToHex(nodeId, 4) + decToHex(variableId, 2) + ';'
    }

    RQEVN(nodeId) {// Read Node Variable
        return this.header + '58' + decToHex(nodeId, 4) + ';'
    }

    NVSET(nodeId, variableId, variableVal) {// Read Node Variable
		//winston.debug({message: `NVSET NodeId : ${nodeId} VariableId : ${variableId} Variable Value : ${variableVal} :: ${decToHex(variableVal, 2)}`});
        return this.header + '96' + decToHex(nodeId, 4) + decToHex(variableId, 2) + decToHex(variableVal, 2) + ';'
    }

    ACON(nodeId, eventId) {
        const eId = decToHex(nodeId, 4) + decToHex(eventId, 4)
		//winston.debug({message: `ACON admin ${eId}`});
        if (eId in this.config.events) {
            this.config.events[eId]['status'] = 'on'
            this.config.events[eId]['count'] += 1
        } else {
            let output = {}
            output['id'] = eId
            output['nodeId'] = nodeId
            output['eventId'] = eventId
            output['status'] = 'on'
            output['type'] = 'long'
            output['count'] = 1
            this.config.events[eId] = output
        }
        //this.config.events[eId]['status'] = 'on'
        //this.config.events[eId]['count'] += 1
		//winston.debug({message: `ACON Output ${this.config.events}`});
        this.emit('events', Object.values(this.config.events))

        return this.header + '90' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';';
    }

    ACOF(nodeId, eventId) {
        const eId = decToHex(nodeId, 4) + decToHex(eventId, 4)
		//winston.debug({message: `ACOF admin ${eId}`});
        if (eId in this.config.events) {
            this.config.events[eId]['status'] = 'off'
            this.config.events[eId]['count'] += 1
        } else {
            let output = {}
            output['id'] = eId
            output['nodeId'] = nodeId
            output['eventId'] = eventId
            output['status'] = 'off'
            output['type'] = 'long'
            output['count'] = 1
            this.config.events[eId] = output
        }
        //this.config.events[eId]['status'] = 'off'
        //this.config.events[eId]['count'] += 1
        this.emit('events', Object.values(this.config.events))

        return this.header + '91' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';';
    }

    ASON(nodeId, deviceNumber) {
        const eId = decToHex(nodeId, 4) + decToHex(deviceNumber, 4)
		//winston.debug({message: `ASON admin ${eId}`});
        if (eId in this.config.events) {
            this.config.events[eId]['status'] = 'on'
            this.config.events[eId]['count'] += 1
        } else {
            let output = {}
            output['id'] = eId
            output['nodeId'] = nodeId
            output['eventId'] = deviceNumber
            output['status'] = 'on'
            output['type'] = 'short'
            output['count'] = 1
            this.config.events[eId] = output
        }
        this.emit('events', Object.values(this.config.events))
		//Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
        return this.header + '98' + decToHex(nodeId, 4) + decToHex(deviceNumber, 4) + ';';
    }

    ASOF(nodeId, deviceNumber) {
        const eId = decToHex(nodeId, 4) + decToHex(deviceNumber, 4)
		//winston.debug({message: `ASOFadmin ${eId}`});
        if (eId in this.config.events) {
            this.config.events[eId]['status'] = 'off'
            this.config.events[eId]['count'] += 1
        } else {
            let output = {}
            output['id'] = eId
            output['nodeId'] = nodeId
            output['eventId'] = deviceNumber
            output['status'] = 'off'
            output['type'] = 'short'
            output['count'] = 1
            this.config.events[eId] = output
        }
        this.emit('events', Object.values(this.config.events))
		//Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
        return this.header + '99' + decToHex(nodeId, 4) + decToHex(deviceNumber, 4) + ';';
    }

    QLOC(sessionId) {
        return this.header + '22' + decToHex(sessionId, 2) + ';';
    }

    /*ENRSP() {
        let output = '';
		winston.debug({message: `ENRSP : ${Object.keys(this.events).length}`});
        const eventList = Object.keys(this.events)
        for (let i = 0, len = eventList.length; i < len; i++) {
            output += this.header + 'F2' + pad(this.nodeId.toString(16), 4) + eventList[i] + pad((i+1).toString(16), 2) + ';'
			winston.debug({message: `ENSRP output : ${output}`});
        }
        return output
    }*/

    /*PNN() {
        return this.header + 'B6' + pad(this.nodeId.toString(16), 4) + pad(this.manufId.toString(16), 2) + pad(this.moduleId.toString(16), 2) + pad(this.flags(16), 2) + ';'

    }

    PARAMS() {
        var par = this.params();
		//winston.debug({message: 'RQNPN :'+par[index]});
        let output = this.header + 'EF'
        for (var i = 1; i < 8; i++) {
            output += par[i]
        }
        output += ';'
        return output;

    }

    RQNN() {
		winston.debug({message: `RQNN TM : ${this.TEACH_MODE ? 'TRUE' : 'FALSE'}`});
        return this.header + '50' + pad(this.nodeId.toString(16), 4) + ';';
    }

    NNACK() {
        return this.header + '52' + pad(this.nodeId.toString(16), 4) + ';';
    }

    WRACK() {
        return this.header + '59' + pad(this.nodeId.toString(16), 4) + ';';
    }

    NUMEV() {
        return this.header + '74' + pad(this.nodeId.toString(16), 4) + pad(Object.keys(this.events).length.toString(16), 2) + ';';
        //object.keys(this.events).length
    }

    NEVAL(eventIndex, eventNo) {
        const eventId = Object.keys(this.events)[eventIndex-1]
		winston.debug({message: `NEVAL ${eventId} : ${eventIndex} : ${eventNo} -- ${Object.keys(this.events)}`});
        return this.header + 'B5' + pad(this.nodeId.toString(16), 4) + pad(eventIndex.toString(16), 2) + pad(eventNo.toString(16), 2)+ pad(this.events[eventId][eventNo].toString(16), 2) + ';'
    }

    ENRSP() {
        let output = '';
		winston.debug({message: `ENRSP : ${Object.keys(this.events).length}`});
        const eventList = Object.keys(this.events)
        for (let i = 0, len = eventList.length; i < len; i++) {
            output += this.header + 'F2' + pad(this.nodeId.toString(16), 4) + eventList[i] + pad((i+1).toString(16), 2) + ';'
			winston.debug({message: `ENSRP output : ${output}`});
        }
        return output
    }

    PARAN(index) {
        const par = this.params();
		//winston.debug({message: 'RQNPN :'+par[index]});
        return this.header + '9B' + pad(this.nodeId.toString(16), 4) + pad(index.toString(16), 2) + pad(par[index].toString(16), 2) + ';';
    }

    NVANS(index) {
        return this.header + '97' + pad(this.nodeId.toString(16), 4) + pad(index.toString(16), 2) + pad(this.variables[index].toString(16), 2) + ';';
    }

    NAME() {
        let name = this.name + '       '
        let output = ''
        for (let i = 0; i < 7; i++) {
            output = output + pad(name.charCodeAt(i).toString(16), 2)
        }
        return this.header + 'E2' + output + ';'
    }

    */
};


module.exports = {
    cbusAdmin: cbusAdmin
}



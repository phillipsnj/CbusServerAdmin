'use strict';

const net = require('net')
const jsonfile = require('jsonfile')
const cbusMessage = require('./mergCbusMessage.js')
//const merg = jsonfile.readFileSync('./nodeConfig.json')


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
        console.log(`merg :${JSON.stringify(this.merg)}`)
        //console.log(`merg- 32 :${JSON.stringify(this.merg['modules'][32]['name'])}`)
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
            console.log('Client Connected');
        })
        this.client.on('data', function (data) { //Receives packets from network and process individual Messages
            const outMsg = data.toString().split(";");
            for (var i = 0; i < outMsg.length - 1; i++) {
                let msg = new cbusMessage.cbusMessage(outMsg[i]);
                //console.log(`CbusAdminServer Message Rv: ${i}  ${msg.opCode()} ${msg.nodeId()} ${msg.eventId()} ${msg.messageOutput()} ${msg.header()}`);
                this.action_message(msg)
            }
        }.bind(this))
        this.client.on('error', (err) => {
            console.log(`TCP ERROR ${err.code}`)
        })
        this.client.on('close', function () {
            console.log('Connection Closed')
            setTimeout(() => {
                this.client.connect(NET_PORT, NET_ADDRESS, function () {
                    console.log('Client ReConnected');
                })
            }, 1000)
        }.bind(this))
        this.actions = { //actions when Opcodes are received
            'B6': (msg) => { //PNN Recieved from Node
                //console.log(`merg :${JSON.stringify(this.merg)}`)
                const ref = msg.nodeId()

                console.log(`PNN (B6) Node found ${msg.messageOutput()} NodeId ${msg.nodeId()} ManufId ${msg.manufId()} ModuleId ${msg.moduleId()} flags ${msg.flags()}`)
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
                    //console.log(`Flags : ${outFlags} : ${outFlags.substr(7, 1)}`)
                    this.config.nodes[ref].consumer = (msg.flags() & 1) ? true : false
                    this.config.nodes[ref].producer = (msg.flags() & 2) ? true : false
                    this.config.nodes[ref].flim = (msg.flags() & 4) ? true : false
                    this.config.nodes[ref].bootloader = (msg.flags() & 8) ? true : false
                    this.config.nodes[ref].coe = (msg.flags() & 16) ? true : false
                    this.config.nodes[ref].learn = (msg.flags() & 16) ? true : false
                }
                this.config.nodes[ref].status = true
                //this.saveConfig()
                this.cbusSend(this.RQNPN(msg.nodeId(), 0))// Get the number of Parameters
                //this.cbusSend(this.RQNPN(msg.nodeId(),5))// Get the number of Event Variables
                this.cbusSend(this.RQNPN(msg.nodeId(), 6))// Get the number of Node Variables
                this.cbusSend((this.RQEVN(msg.nodeId())))
                //this.cbusSend(this.NVRD(msg.nodeId(),1))//
                /*let nodes = []
                for (let node in this.config.nodes){
                    nodes.push(this.config.nodes[node])
                }
                this.emit('nodes', nodes);*/
                //
                //this.cbusSend(this.RQNPN(msg.nodeId(), 0)) //Get the number of node Parameters
                //this.cbusSend(this.NERD(msg.nodeId())) // Read back all stored events in a node
                this.saveConfig()
            },
            '90': (msg) => {//Accessory On Long Event
                this.eventSend(msg, 'on', 'long')
            },
            '91': (msg) => {//Accessory Off Long Event
                this.eventSend(msg, 'off', 'long')
            },
            '98': (msg) => {//Accessory On Long Event
                this.eventSend(msg, 'on', 'short')
            },
            '99': (msg) => {//Accessory Off Long Event
                this.eventSend(msg, 'off', 'short')
            },
            'EF': (msg) => {//Request Node Parameter in setup
                // mode
                //console.log(`PARAMS (EF) Received`)
            },
            '50': (msg) => {//Request Node Number
                // mode
                //console.log(`RQNN (50) Received`)
                this.emit('requestNodeNumber')
            },
            '63': (msg) => {//CMDERR
                //console.log(`CMD ERROR Node ${msg.nodeId()} Error ${msg.errorId()}`)
                let output = {}
                output['type'] = 'DCC'
                output['Error'] = msg.errorId()
                output['Message'] = this.merg.dccErrors[msg.errorId()]
                output['data'] = msg.getStr(9, 4)
                this.emit('dccError', output)
            },
            '6F': (msg) => {//Cbus Error
                //console.log(`CBUS ERROR Node ${msg.nodeId()} Error ${msg.errorId()}`)
                let ref = msg.nodeId().toString() + '-' + msg.errorId().toString()
                if (ref in this.cbusErrors) {
                    this.cbusErrors[ref].count += 1
                } else {
                    let output = {}
                    output['id'] = msg.nodeId().toString() + '-' + msg.errorId().toString()
                    output['type'] = 'CBUS'
                    output['Error'] = msg.errorId()
                    output['Message'] = this.merg.cbusErrors[msg.errorId()]
                    output['node'] = msg.nodeId()
                    output['count'] = 1
                    //this.cbusErrors.push(output)
                    this.cbusErrors[ref] = output
                }
                this.emit('cbusError', this.cbusErrors)
            },
            'F2': (msg) => {//ENSRP Response to NERD/NENRD
                //console.log(`ENSRP (F2) Response to NERD : Node : ${msg.nodeId()} Action : ${msg.actionId()} Action Number : ${msg.actionEventId()}`)
                //console.log((`Number of Event Variables ${this.config.nodes[msg.nodeId()].parameters[5]}`))
                const ref = msg.actionEventId()
                if (!(ref in this.config.nodes[msg.nodeId()].actions)) {
                    this.config.nodes[msg.nodeId()].actions[msg.actionEventId()] = {
                        "event": msg.actionId(),
                        "variables": [this.config.nodes[msg.nodeId()].parameters[5]],
                        "actionId": msg.actionEventId()
                    }
                    this.cbusSend(this.REVAL(msg.nodeId(), msg.actionEventId(), 0))
                    this.cbusSend(this.REVAL(msg.nodeId(), msg.actionEventId(), 1))
                    this.saveConfig()
                }
                //this.saveConfig()
            },
            'B5': (msg) => {//Read of EV value Response REVAL
                //console.log(`REVAL (B5) ${msg.nodeId()} Event : ${msg.actionEventIndex()} Event Variable : ${msg.actionEventVarId()} Event Variable Value : ${msg.actionEventVarVal()}`)
                if (this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] != null) {
                    //console.log(`Event Variable Exists `)
                    if (this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] != msg.actionEventVarVal()) {
                        console.log(`Event Variable Value has Changed `)
                        this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] = msg.actionEventVarVal()
                        this.saveConfig()
                    } else {
                        console.log(`Event Variable Value has not Changed `)
                    }
                } else {
                    console.log(`Event Variable Does not exist on config`)
                    this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] = msg.actionEventVarVal()
                    this.saveConfig()
                }
                //this.config.nodes[msg.nodeId()].actions[msg.actionEventIndex()].variables[msg.actionEventVarId()] = msg.actionEventVarVal()
                //this.saveConfig()
            },
            '97': (msg) => { //Receive Node Variable Value
                //console.log(`NVANS (97) Node ${msg.nodeId()} : ${msg.variableId()} : ${msg.variableVal()}`)
                if (this.config.nodes[msg.nodeId()].variables[msg.variableId()] != null) {
                    if (this.config.nodes[msg.nodeId()].variables[msg.variableId()] != msg.variableVal()) {
                        console.log(`Variable value has changed`)
                        this.config.nodes[msg.nodeId()].variables[msg.variableId()] = msg.variableVal()
                        this.saveConfig()
                    } else {
                        console.log(`Variable value has not changed`)
                    }
                } else {
                    console.log(`Variable value does not exist in config`)
                    this.config.nodes[msg.nodeId()].variables[msg.variableId()] = msg.variableVal()
                    this.saveConfig()
                }
                //this.config.nodes[msg.nodeId()].variables[msg.variableId()] = msg.variableVal()
                //this.saveConfig()
            },
            '9B': (msg) => {//PARAN Parameter readback by Index
                //console.log(`PARAN (9B) ${msg.nodeId()} Parameter ${msg.paramId()} Value ${msg.paramValue()}`)
                if (this.config.nodes[msg.nodeId()].parameters[msg.paramId()] != null) {
                    if (this.config.nodes[msg.nodeId()].parameters[msg.paramId()] != msg.paramValue()) {
                        console.log(`Parameter value has changed`)
                        this.config.nodes[msg.nodeId()].parameters[msg.paramId()] = msg.paramValue()
                        this.saveConfig()
                    } else {
                        console.log(`Parameter value has not changed`)
                    }
                } else {
                    //console.log(`Parameter value does not exist in config`)
                    this.config.nodes[msg.nodeId()].parameters[msg.paramId()] = msg.paramValue()
                    this.saveConfig()
                }
                //this.config.nodes[msg.nodeId()].parameters[msg.paramId()] = msg.paramValue()
                //this.saveConfig()
            },
            '01': (msg) => {
                console.log("ACK (01) : " + msg.opCode() + ' ' + msg.messageOutput() + ' ' + msg.deCodeCbusMsg());
            },
            '59': (msg) => {
                console.log("WRACK (59) : " + msg.opCode() + ' ' + msg.messageOutput() + ' ' + msg.deCodeCbusMsg());
            },
            '52': (msg) => {
                console.log("NNACK (59) : " + msg.opCode() + ' ' + msg.messageOutput() + ' ' + msg.deCodeCbusMsg());
            },
            '74': (msg) => {
                console.log(`NUMNEV (74) : ${msg.nodeId()} :: ${msg.paramId()}`);
                if (this.config.nodes[msg.nodeId()].EvCount != null) {
                    if (this.config.nodes[msg.nodeId()].EvCount != msg.variableId()) {
                        this.config.nodes[msg.nodeId()].EvCount = msg.variableId()
                        this.saveConfig()
                    } else {
                        console.log(`EvCount value has not changed`)
                    }
                } else {
                    this.config.nodes[msg.nodeId()].EvCount = msg.variableId()
                    this.saveConfig()
                }
            },
            '21': (msg) => {
                console.log(`Session Cleared : ${msg.sessionId()}`)
                let ref = msg.opCode()
                let session = msg.sessionId()
                if (session in this.dccSessions) {
                    this.dccSessions[session].status = 'In Active'
                } else {
                    console.log(`Session ${session} does not exist`)
                }
                this.emit('dccSessions', this.dccSessions)
            },
            '23': (msg) => {
                console.log(`Session Keep Alive : ${msg.sessionId()}`)
                let ref = msg.opCode()
                let session = msg.sessionId()
                if (session in this.dccSessions) {
                    this.dccSessions[session].count += 1
                    this.dccSessions[session].status = 'Active'
                } else {
                    console.log(`Session ${session} does not exist`)
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 1
                    this.dccSessions[session].status = 'Active'
                    this.cbusSend(this.QLOC(session))
                }
                this.emit('dccSessions', this.dccSessions)
            },
            'E1': (msg) => {
                let session = msg.sessionId()
                let loco = msg.locoId()
                let speed = msg.locoSpeed()
                let direction = 'Reverse'
                let F1 = msg.locoF1()
                let F2 = msg.locoF2()
                let F3 = msg.locoF3()
                console.log(`Engine Report : ${session} : ${speed} : ${direction}`)
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
            '47': (msg) => {
                let session = msg.sessionId()
                let speed = msg.locoId()
                let direction = 'Reverse'
                if (speed > 127) {
                    direction = 'Forward'
                    speed = speed - 128
                }
                if (!(session in this.dccSessions)) {
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 0
                }
                console.log(`(47) DCC Speed Change : ${session} : ${direction} : ${speed}`)
                this.dccSessions[session].direction = direction
                this.dccSessions[session].speed = speed
                this.emit('dccSessions', this.dccSessions)
                //this.cbusSend(this.QLOC(session))
            },
            '60': (msg) => {
                let session = msg.sessionId()
                if (!(session in this.dccSessions)) {
                    this.dccSessions[session] = {}
                    this.dccSessions[session].count = 0
                }
                let functionRange = msg.getInt(11, 2)
                let dccNMRA = msg.getInt(13, 2)
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
                console.log(`DCC Set Engine Function : ${msg.sessionId()} ${functionRange} ${dccNMRA} : ${functionArray}`)
                this.emit('dccSessions', this.dccSessions)
                //this.cbusSend(this.QLOC(session))
            },
            'DEFAULT': (msg) => {
                console.log("Opcode " + msg.opCode() + ' NodeId ' + msg.nodeId() + ' is not supported by the Admin module');
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

    action_message(msg) {
        if (this.actions[msg.opCode()]) {
            this.actions[msg.opCode()](msg);
        } else {
            this.actions['DEFAULT'](msg);
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
			//console.log(`cbusSend Base : ${msg.toUpperCase()}`)
			this.emit('cbus', msg.toUpperCase());
			this.client.write(msg.toUpperCase());
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
        //console.log(`EventSend :${JSON.stringify(msg)}`)
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
        console.log(`Save Config `)
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
        //console.log(`Reval NodeId : ${nodeId} EventId : ${eventId} Event Value : ${valueId}`)
        return this.header + '9C' + decToHex(nodeId, 4) + decToHex(eventId, 2) + decToHex(valueId, 2) + ';'
    }

    EVLRN(event, variableId, valueId) {//Read an Events EV by index
        //console.log(`EVLRN Event : ${event} EventId : ${eventId} Event Value : ${valueId}`)
        return this.header + 'D2' + event + decToHex(variableId, 2) + decToHex(valueId, 2) + ';'
    }

    EVULN(event) {//Read an Events EV by index
        //console.log(`EVULN Event : ${event}`)
        return this.header + '95' + event + ';'
    }

    NVRD(nodeId, variableId) {// Read Node Variable
        return this.header + '71' + decToHex(nodeId, 4) + decToHex(variableId, 2) + ';'
    }

    RQEVN(nodeId) {// Read Node Variable
        return this.header + '58' + decToHex(nodeId, 4) + ';'
    }

    NVSET(nodeId, variableId, variableVal) {// Read Node Variable
        //console.log(`NVSET NodeId : ${nodeId} VariableId : ${variableId} Variable Value : ${variableVal} :: ${decToHex(variableVal, 2)}`)
        return this.header + '96' + decToHex(nodeId, 4) + decToHex(variableId, 2) + decToHex(variableVal, 2) + ';'
    }

    ACON(nodeId, eventId) {
        const eId = decToHex(nodeId, 4) + decToHex(eventId, 4)
        this.config.events[eId]['status'] = 'on'
        this.config.events[eId]['count'] += 1
        this.emit('events', Object.values(this.config.events))
        //console.log(`ACON admin ${eId}`)
        return this.header + '90' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';';
    }

    ACOF(nodeId, eventId) {
        const eId = decToHex(nodeId, 4) + decToHex(eventId, 4)
        this.config.events[eId]['status'] = 'off'
        this.config.events[eId]['count'] += 1
        this.emit('events', Object.values(this.config.events))
        return this.header + '91' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';';
    }

    ASON(eventId) {
        return this.header + '980000' + decToHex(eventId, 4) + ';';
    }

    ASOF(eventId) {
        return this.header + '990000' + decToHex(eventId, 4) + ';';
    }

    QLOC(sessionId) {
        return this.header + '22' + decToHex(sessionId, 2) + ';';
    }

    /*ENRSP() {
        let output = '';
        console.log(`ENRSP : ${Object.keys(this.events).length}`);
        const eventList = Object.keys(this.events)
        for (let i = 0, len = eventList.length; i < len; i++) {
            output += this.header + 'F2' + pad(this.nodeId.toString(16), 4) + eventList[i] + pad((i+1).toString(16), 2) + ';'
            console.log(`ENSRP output : ${output}`)
        }
        return output
    }*/

    /*PNN() {
        return this.header + 'B6' + pad(this.nodeId.toString(16), 4) + pad(this.manufId.toString(16), 2) + pad(this.moduleId.toString(16), 2) + pad(this.flags(16), 2) + ';'

    }

    PARAMS() {
        var par = this.params();
        //console.log('RQNPN :'+par[index]);
        let output = this.header + 'EF'
        for (var i = 1; i < 8; i++) {
            output += par[i]
        }
        output += ';'
        return output;

    }

    RQNN() {
        console.log(`RQNN TM : ${this.TEACH_MODE ? 'TRUE' : 'FALSE'}`)
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
        console.log(`NEVAL ${eventId} : ${eventIndex} : ${eventNo} -- ${Object.keys(this.events)}`)
        return this.header + 'B5' + pad(this.nodeId.toString(16), 4) + pad(eventIndex.toString(16), 2) + pad(eventNo.toString(16), 2)+ pad(this.events[eventId][eventNo].toString(16), 2) + ';'
    }

    ENRSP() {
        let output = '';
        console.log(`ENRSP : ${Object.keys(this.events).length}`);
        const eventList = Object.keys(this.events)
        for (let i = 0, len = eventList.length; i < len; i++) {
            output += this.header + 'F2' + pad(this.nodeId.toString(16), 4) + eventList[i] + pad((i+1).toString(16), 2) + ';'
            console.log(`ENSRP output : ${output}`)
        }
        return output
    }

    PARAN(index) {
        const par = this.params();
        //console.log('RQNPN :'+par[index]);
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



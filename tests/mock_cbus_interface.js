const EventEmitter = require('events').EventEmitter;
const jsonfile = require('jsonfile')


//const cbusMessage = require('./../merg/mergCbusMessage.js')


function decToHex(num, len){
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    //return (num + Math.pow(16, len)).toString(16).slice(-len).toUpperCase()
    return padded.substr(-len)
}


class cbusAdmin extends EventEmitter {
    constructor() {
        console.log(`Mock CBUS: Interface created`);
		super();
        const merg = jsonfile.readFileSync('./config/mergConfig.json')
        this.merg = merg

		this.sendArray = [];
 
		this.pr1 = 2
        this.pr2 = 3
        this.canId = 60
        const outHeader = ((((this.pr1 * 4) + this.pr2) * 128) + this.canId) << 5
        this.header = ':S' + outHeader.toString(16).toUpperCase() + 'N'
		

        this.cbusErrors = {}
	}

	cbusSend(msg) {
		this.sendArray.push(msg);
        console.log("Mock CBUS: Send invoked : " + `${msg}`);
    }
	
	getSendArray() {
		return this.sendArray;
	}
	
	clearSendArray() {
		this.sendArray = [];
	}
	
	ACOF(nodeId, eventId) {
		return this.header + '91' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';';
    }
	
	ACON(nodeId, eventId) {		//
        return this.header + '90' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';';
    }

    EVLRN(event, eventId, valueId) {//Read an Events EV by index
        //console.log(`EVLRN Event : ${event} EventId : ${eventId} Event Value : ${valueId}`)
        return this.header + 'D2' + decToHex(event, 4) + decToHex(eventId, 2) + decToHex(valueId, 2) + ';'
    }

    EVULN(event) {
        console.log(`EVULN Event : ${event}`)
        return this.header + '95' + event + ';'
    }

	

    NERD(nodeId) {//Request All Events
        return this.header + '57' + decToHex(nodeId, 4) + ';'
    }

    NNLRN(nodeId) {
        return this.header + '53' + decToHex(nodeId, 4) + ';'
    }

    NNULN(nodeId) {
        return this.header + '54' + decToHex(nodeId, 4) + ';'
    }

    NVRD(nodeId, variableId) {// Read Node Variable
        return this.header + '71' + decToHex(nodeId, 4) + decToHex(variableId, 2) + ';'
    }

    NVSET(nodeId, variableId, variableVal) {
        console.log(`NVSET NodeId : ${nodeId} VariableId : ${variableId} Variable Value : ${variableVal} :: ${decToHex(variableVal, 2)}`)
        return this.header + '96' + decToHex(nodeId, 4) + decToHex(variableId, 2) + decToHex(variableVal, 2) + ';'
    }
	
    REVAL(nodeId, eventId, valueId) {//Read an Events EV by index
        return this.header + '9C' + decToHex(nodeId, 4) + decToHex(eventId, 2) + decToHex(valueId, 2) + ';'
    }

    RQEVN(nodeId) {// Read Node Variable
        return this.header + '58' + decToHex(nodeId, 4) + ';'
    }

    RQNPN(nodeId, param) {		//Read Node Parameter
        return this.header + '73' + decToHex(nodeId, 4) + decToHex(param, 2) + ';'
    }

	QNN() {						//Query Node Number
        return this.header + '0D' + ';'
    }

	Create_cbusError(msg)
	{
        console.log("Mock CBUS: cbusError invoked : " + msg);
        this.emit('cbusError', msg)
	}
	
	Create_cbusNoSupport(msg)
	{
        console.log("Mock CBUS: cbusNoSupport invoked : " + msg);
        this.emit('cbusNoSupport', msg)
	}
	
	Create_dccSessions(msg)
	{
        console.log("Mock CBUS: dccSessions invoked : " + msg);
        this.emit('dccSessions', msg)
	}
	
	Create_Events(msg)
	{
        console.log("Mock CBUS: events invoked : " + msg);
        this.emit('events', msg)
	}
	
	Create_Nodes(msg)
	{
        console.log("Mock CBUS: nodes invoked : " + msg);
        this.emit('nodes', msg)
	}
	
	Create_dccError(msg)
	{
        console.log("Mock CBUS: dccError invoked : " + msg);
        this.emit('dccError', msg)
	}
}

module.exports = {
    cbusAdmin: cbusAdmin
}

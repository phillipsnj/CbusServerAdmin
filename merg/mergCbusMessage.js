class cbusMessage {
    constructor(msg) {
        this.message = msg.toString();
        /*        this.header = parseInt(this.message.substr(0,7),16)
                this.prority1 = this.header >>>14
                this.prority2 = this.header >>>12 & 3;
                this.canId = header >>>5 & 31
                this.type = this.message.substr(6,1)*/
    }

   /* header() {
        const header = parseInt(this.message.substr(2, 4), 16)
        const priority1 = header >>> 14
        const priority2 = header >>> 12 & 3;
        const canId = header >>> 5 & 31
        const type = this.message.substr(6, 1)
        const outHeader = ((((priority1 * 4) + priority2) * 128) + canId) << 5
        //return `Pr1:${priority1} Pr2:${priority2} CanId:${canId} Type:${type} Header:${header} outHeader:${outHeader}`
        return `:S${outHeader.toString(16).toUpperCase()}N`
    }
*/
    deCodeCbusMsg() {
        const event = this.message;
        const header = parseInt(event.substr(2, 4), 16);
        const pr1 = header >>> 14;
        const pr2 = header >>> 12 & 3;
        const canNodeId = header >>> 5 & 31;
        const type = event.substr(6, 1);
        const opCode = event.substr(7, 2);
        const nodeId = parseInt(event.substr(9, 4), 16);
        const eventId = event.substr(13, 4);
        return ` PR1:${pr1} PR2:${pr2} CanId:${canNodeId} type:${type} opCode:${opCode} Cbus NodeId:${nodeId} Event Id:${eventId}`;
    }

    opCode() {
        return this.message.substr(7, 2);
    }

    nodeId() {
        return parseInt(this.message.substr(9, 4), 16);
    }

    sessionId() {
        return parseInt(this.message.substr(9, 2), 16);
    }

    locoId() {
        return parseInt(this.message.substr(11, 4), 16);
    }

    locoSpeed() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    locoF1() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    locoF2() {
        return parseInt(this.message.substr(19, 2), 16);
    }

    locoF3() {
        return parseInt(this.message.substr(21, 2), 16);
    }

    eventId() {
        return parseInt(this.message.substr(13, 4), 16);
    }

    fullEventId() {
        return this.message.substr(9, 8);
    }

    shortEventId() {
        return '0000'+this.message.substr(13, 4);
    }

    manufId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    moduleId() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    flags() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    paramId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    errorId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    actionId() {
        return this.message.substr(13, 8);
    }

    actionEventId() {
        return parseInt(this.message.substr(21, 2), 16);
    }

    actionEventIndex() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    actionEventVarId() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    actionEventVarVal() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    variableId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    variableVal() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    paramValue() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    eventNo() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    eventValue() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    eventIndex() {
        return this.message.substr(9, 8)

    }

    eventVariableIndex() {
        return parseInt(this.message.substr(13, 2), 16);
        //return this.message.substr(13, 2)
    }

    getInt(start, length) {
        return parseInt(this.message.substr(start, length), 16);
    }

    getStr(start, length) {
        return this.message.substr(start, length)
    }

    index() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    value() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    data() {
        var data = [];
        var dataStr = this.message.substr(7, this.message.length - 7);
        for (var i = 0; i < dataStr.length - 1; i += 2)
            data.push(dataStr.substr(i, 2));
        return data;
    }

    messageOutput() {
        return this.message
    }
	
	TranslateMessage()
	{
		switch (this.opCode()) {
					case '0D':
						// QNN Format: [<MjPri><MinPri=3><CANID>]<0D>
						return "QNN";
						break;
					case '42':
						// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
						return "SNN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '53':
						// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
						return "NNLRN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '54':
						// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
						return "NNULN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '57':
						// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
						return "NERD Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '58':
						// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						return "RQEVN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '71':
						// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
						return "NVRD Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Node Variable Index " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '73':
						// RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						return "NVRD Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Node Parameter Index " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '90':
						// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
						return "ACON Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event " + parseInt(this.message.substr(13, 4), 16);
						break;
					case '91':
						// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
						return "ACOF Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event " + parseInt(this.message.substr(13, 4), 16);
						break;
					case '95':
						// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
						return "EVULN Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event " + parseInt(this.message.substr(13, 4), 16);
						break;
					case '96':
						// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
						return "NVSET Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Node Variable Index " + parseInt(this.message.substr(13, 2), 16) +
								" Value " + parseInt(this.message.substr(15, 2), 16);
						break;
					case '98':
						// ASON Format: <MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
						return "ASON Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Device " + parseInt(this.message.substr(13, 4), 16);
						break;
					case '99':
						// ASOF Format: <MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
						return "ASOF Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Device " + parseInt(this.message.substr(13, 4), 16);
						break;
					case '9C':
						// RETVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
						return "RETVAL Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event Index " + parseInt(this.message.substr(13, 2), 16) + 
								" Value Index " + parseInt(this.message.substr(15, 2), 16);
						break;
					case 'B6':
						// PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
						return "PNN NodeId " + parseInt(this.message.substr(9, 4), 16) + 
								" ManufId " + parseInt(this.message.substr(13, 2), 16) + 
								" ModuleId " + parseInt(this.message.substr(15, 2), 16) + 
								" flags " + parseInt(this.message.substr(17, 2), 16);
						break;
					case 'D2':
						// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo>
						return "EVULN Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event " + parseInt(this.message.substr(13, 4), 16);
						break;
					default:
						return "No translation for Opcode";
						break;
					}
	}
}

module.exports = {
    cbusMessage: cbusMessage
}
var translator = require('./translateCbusMessage.js')


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






class cbusMessage {
    constructor(msg) {
        this.message = msg.toString();
    }

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

    //
    // Decoding methods
    //

    static decodeERR (message) {
        // ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
        return {'mnemonic': 'ERR',
                'data1': parseInt(message.substr(9, 2), 16),
                'data2': parseInt(message.substr(11, 2), 16),
                'data3': parseInt(message.substr(13, 2), 16),
        }
    }

    static decodeKLOC (message) {
        // KLOC Format: [<MjPri><MinPri=2><CANID>]<21><Session>
        return {'session': parseInt(message.substr(9, 2), 16)
        }
    }
    
    static decodeNEVAL(message) {
        // NEVAL Format: [<MjPri><MinPri=3><CANID>]<B5><NN hi><NN lo><EN#><EV#><EVval>
        return {'nodeId': parseInt(message.substr(9, 4), 16),
                'eventIndex': parseInt(message.substr(13, 2), 16),
                'eventVariableIndex': parseInt(message.substr(15, 2), 16),
                'eventVariableValue': parseInt(message.substr(17, 2), 16),
        }
    }

    static decodeNUMEV (message) {
        // NUMEV Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
        return {'nodeId': parseInt(message.substr(9, 4), 16),
                'eventCount': parseInt(message.substr(13, 2), 16),
        }
    }
    
    static decodeNVANS (message) {
        // NVANS Format: [[<MjPri><MinPri=3><CANID>]<97><NN hi><NN lo><NV# ><NV val>
        return {'nodeId': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16),
                'nodeVariableValue': parseInt(message.substr(15, 2), 16),
        }
    }
    
    static decodePARAN (message) {
        // PARAN Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
        return {'nodeId': parseInt(message.substr(9, 4), 16), 
                'parameterIndex': parseInt(message.substr(13, 2), 16),
                'parameterValue': parseInt(message.substr(15, 2), 16),
        }
    }

    static decodePLOC (message) {
        // PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
        var speedDir = parseInt(message.substr(15, 2), 16)
        return {'session': parseInt(message.substr(9, 2), 16),
                'address': parseInt(message.substr(11, 4), 16),
                'speed': speedDir % 128,
                'direction': (speedDir > 127) ? 'Forward' : 'Reverse',
                'Fn1': parseInt(message.substr(17, 2), 16),
                'Fn2': parseInt(message.substr(19, 2), 16),
                'Fn3': parseInt(message.substr(21, 2), 16),
        }
    }
    
    static decodePNN (message) {
        // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
        return {'nodeId': parseInt(message.substr(9, 4), 16),
                'manufacturerId': parseInt(message.substr(13, 2), 16), 
                'moduleId': parseInt(message.substr(15, 2), 16), 
                'flags': parseInt(message.substr(17, 2), 16),
        }
    }

    //
    // Encoding methods
    //

    static header() {
        return ':SB780N'
    }

    static encodeEVULN(eventName) {
		// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
        return cbusMessage.header + '95' + eventName + ';'
    }

    static encodeNENRD(nodeId, eventIndex) {
		// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
        return cbusMessage.header + '72' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + ';'
    }

    static encodeNERD(nodeId) {//Request All Events
		// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
        return cbusMessage.header + '57' + decToHex(nodeId, 4) + ';'
    }

    static encodeNNLRN(nodeId) {
		// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
		if (nodeId >= 0 && nodeId <= 0xFFFF) {
			return cbusMessage.header + '53' + decToHex(nodeId, 4) + ';'
		}
    }

    static encodeNNULN(nodeId) {
		// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
        return cbusMessage.header + '54' + decToHex(nodeId, 4) + ';'
    }

    static encodeNVRD(nodeId, nodeVariableIndex) {
		// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
        return cbusMessage.header + '71' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + ';'
    }

    static encodeNVSET(nodeId, nodeVariableIndex, nodeVariableValue) {
		// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
        return cbusMessage.header + '96' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + decToHex(nodeVariableValue, 2) + ';'
    }

    static encodeREVAL(nodeId, eventIndex, eventVariableIndex) {
        // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
        return cbusMessage.header + '9C' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + decToHex(eventVariableIndex, 2) + ';'
    }

    static encodeRQEVN(nodeId) {
		// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
        return cbusMessage.header + '58' + decToHex(nodeId, 4) + ';'
    }

    static encodeRQNP() {//Request Node Parameters
		// RQNP Format: [<MjPri><MinPri=3><CANID>]<10>
        return cbusMessage.header + '10' + ';'
    }

    static encodeRQNPN(nodeId, param) {//Read Node Parameter
        // RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
        return cbusMessage.header + '73' + decToHex(nodeId, 4) + decToHex(param, 2) + ';'
    }

    static encodeSNN(nodeId) {
		// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
        if (nodeId >= 0 && nodeId <= 0xFFFF) {
            return cbusMessage.header + '42' + decToHex(nodeId, 4) + ';'
        }
    }

    static encodeQLOC(sessionId) {
		// QLOC Format: [<MjPri><MinPri=2><CANID>]<22><Session>
        return cbusMessage.header + '22' + decToHex(sessionId, 2) + ';';
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
	
	
	translateMessage()
	{
		return translator.translateCbusMessage(this.message);
	}
	
}


    const header = function() {
        return ':SB780N'
    }




    // 23 DKEEP
    //
    exports.decodeDKEEP = function(message) {
        // DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
        return {'mnemonic': 'DKEEP',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16)
        }
    }
    exports.encodeDKEEP = function(session) {
        // DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
        return header() + '23' + decToHex(session, 2) + ';';
    }
    

    // 47 DSPD
    //
    exports.decodeDSPD = function(message) {
        // DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
        var speedDir = parseInt(message.substr(11, 2), 16)
        return {'mnemonic': 'DSPD',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'speed': speedDir % 128,
                'direction': (speedDir > 127) ? 'Forward' : 'Reverse',
        }
    }
    exports.encodeDSPD = function(session, speed, direction) {
        // DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
        var speedDir = speed + (direction == 'Reverse') ? 0 : 128
        return header() + '27' + decToHex(session, 2) + decToHex(speedDir, 2) + ';';
    }
    

    // 60 DFUN
    //
    exports.decodeDFUN = function(message) {
        // DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
        return {'mnemonic': 'DFUN',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'Fn1': parseInt(message.substr(11, 2), 16),
                'Fn2': parseInt(message.substr(13, 2), 16),
        }
    }
    exports.encodeDFUN = function(session, Fn1, Fn2) {
        // DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
        return header() + '60' + decToHex(session, 2) + decToHex(Fn1, 2) + decToHex(Fn2, 2) + ';';
    }


    // 63 ERR
    //
    exports.decodeERR = function(message) {
        // ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
        return {'mnemonic': 'ERR',
                'opCode': message.substr(7, 2),
                'data1': parseInt(message.substr(9, 2), 16),
                'data2': parseInt(message.substr(11, 2), 16),
                'data3': parseInt(message.substr(13, 2), 16),
        }
    }
    exports.encodeERR = function(data1, data2, data3) {
        // ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
        return header() + '63' + decToHex(data1, 2) + decToHex(data2, 2) + decToHex(data3, 2) + ';';
    }

    
    // 6F CMDERR
    //
    exports.decodeCMDERR = function(message) {
        // CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
		return {'mnemonic': 'CMDERR',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'error': parseInt(message.substr(13, 2), 16),
        }
    }
    exports.encodeCMDERR = function(nodeId, error) {
        // CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
        return header() + '6F' + decToHex(nodeId, 4) + decToHex(error, 2) + ';';
    }


    // 90 ACON
    //
    exports.decodeACON = function(message) {
		// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
		return {'mnemonic': 'ACON',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    exports.encodeACON = function(nodeId, eventNumber) {
		// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
        return header() + '90' + decToHex(nodeId, 4) + decToHex(eventNumber, 4) + ';';
    }


    // 91 ACOF
    //
    exports.decodeACOF = function(message) {
		// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
		return {'mnemonic': 'ACOF',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    exports.encodeACOF = function(nodeId, eventNumber) {
		// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
        return header() + '91' + decToHex(nodeId, 4) + decToHex(eventNumber, 4) + ';';
    }


    // 98 ASON
    //
    exports.decodeASON = function(message) {
		// ASON Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
		return {'mnemonic': 'ASON',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    exports.encodeASON = function(nodeId, deviceNumber) {
		// ASON Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
        return header() + '98' + decToHex(nodeId, 4) + decToHex(deviceNumber, 4) + ';';
    }


    // 99 ASOF
    //
    exports.decodeASOF = function(message) {
		// ASOF Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
		return {'mnemonic': 'ASOF',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    exports.encodeASOF = function(nodeId, deviceNumber) {
		// ASOF Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
        return header() + '99' + decToHex(nodeId, 4) + decToHex(deviceNumber, 4) + ';';
    }


    // D2 EVLRN
    //
    exports.decodeEVLRN = function(message) {
		// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
        return {'mnemonic': 'EVLRN',
                'opCode': message.substr(7, 2),
                'eventName': message.substr(9, 8),
                'eventVariableIndex': parseInt(message.substr(17, 2), 16),
                'eventVariableValue': parseInt(message.substr(19, 2), 16),
        }
    }
    exports.encodeEVLRN = function(eventName, eventVariableIndex, eventVariableValue) {
		// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
        return header() + 'D2' + eventName + decToHex(eventVariableIndex, 2) + decToHex(eventVariableValue, 2) + ';'
    }
    

    // F2 ENRSP
    //
    exports.decodeENRSP = function(message) {
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
        return {'mnemonic': 'ENRSP',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
                'eventName': message.substr(13, 8),
                'eventIndex': parseInt(message.substr(21, 2), 16),
        }
    }
    exports.encodeENRSP = function(nodeId, eventName, eventIndex) {
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
        return header() + 'F2' + decToHex(nodeId, 4) + eventName + decToHex(eventIndex, 2) + ';';
    }


    

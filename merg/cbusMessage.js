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

}


    const header = function() {
        return ':SB780N'
    }



    // 10 RQNP
    //
    exports.decodeRQNP = function(message) {
        return {'mnemonic': 'RQNP',
                'opCode': message.substr(7, 2),
        }
    }
    exports.encodeRQNP = function() {//Request Node Parameters
		// RQNP Format: [<MjPri><MinPri=3><CANID>]<10>
        return header() + '10' + ';'
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
    

    // 53 NNLRN
    //
    exports.decodeNNLRN = function(message) {
		// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
        return {'mnemonic': 'NNLRN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    exports.encodeNNLRN = function(nodeId) {
		// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
		if (nodeId >= 0 && nodeId <= 0xFFFF) {
			return header() + '53' + decToHex(nodeId, 4) + ';'
		}
    }


    // 54 NNULN
    //
    exports.decodeNNULN = function(message) {
		// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
        return {'mnemonic': 'NNULN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    exports.encodeNNULN = function(nodeId) {
		// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
        return header() + '54' + decToHex(nodeId, 4) + ';'
    }


    // 57 NERD
    //
    exports.decodeNERD = function(message) {
		// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
        return {'mnemonic': 'NERD',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    exports.encodeNERD = function(nodeId) {
		// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
        return header() + '57' + decToHex(nodeId, 4) + ';'
    }


    // 58 RQEVN
    //
    exports.decode = function(message) {
		// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
        return {'mnemonic': 'RQEVN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    exports.encodeRQEVN = function(nodeId) {
		// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
        return header() + '58' + decToHex(nodeId, 4) + ';'
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


    // 71 NVRD
    //
    exports.decodeNVRD = function(message) {
		// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
		return {'mnemonic': 'NVRD',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16),
        }
    }
    exports.encodeNVRD = function(nodeId, nodeVariableIndex) {
		// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
        return header() + '71' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + ';'
    }


    // 72 NENRD
    //
    exports.decodeNENRD = function(message) {
		// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
		return {'mnemonic': 'NENRD',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventIndex': parseInt(message.substr(13, 2), 16),
        }
    }
    exports.encodeNENRD = function(nodeId, eventIndex) {
		// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
        return header() + '72' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + ';'
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


    // 95 EVULN
    //
    exports.decodeEVULN = function(message) {
		// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
        return {'mnemonic': 'EVULN',
                'opCode': message.substr(7, 2),
                'eventName': message.substr(9, 8),
        }
    }
    exports.encodeEVULN = function(eventName) {
		// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
        return header() + '95' + eventName + ';'
    }


    // 96 NVSET
    //
    exports.decodeNVSET = function(message) {
		// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
        return {'mnemonic': 'NVSET',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16), 
                'nodeVariableValue': parseInt(message.substr(15, 2), 16), 
        }
    }
    exports.encodeNVSET = function(nodeId, nodeVariableIndex, nodeVariableValue) {
		// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
        return header() + '96' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + decToHex(nodeVariableValue, 2) + ';'
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


    // 9C REVAL
    //
    exports.decodeREVAL = function(message) {
        // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
        return {'mnemonic': 'REVAL',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventIndex': parseInt(message.substr(13, 2), 16), 
                'eventVariableIndex': parseInt(message.substr(15, 2), 16), 
        }
    }
    exports.encodeREVAL = function(nodeId, eventIndex, eventVariableIndex) {
        // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
        return header() + '9C' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + decToHex(eventVariableIndex, 2) + ';'
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


    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// cbusMessage encode & decoding functions
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
'use strict';

    function decToHex(num, len) {
        return parseInt(num).toString(16).toUpperCase().padStart(len, '0');
    }

    const header = function() {
        return ':SB780N'
    }

class cbusLibrary {
    constructor() {
    }
    
    //
    // Functions strictly arranged by numerical opcode to ensure that it's easy to spot if a function already exists
    //
    //
    

    decode = function(message) {
        if (message == undefined) message = this.message;
        var opCode = message.substr(7, 2);
        switch (opCode) {
        case '10':
            return this.decodeRQNP(message);
            break;
        case '21':
            return this.decodeKLOC(message);
            break;
        case '22':
            return this.decodeQLOC(message);
            break;
        case '23':
            return this.decodeDKEEP(message);
            break;
        case '27':
            return this.decodeDSPD(message);
            break;
        case '42':
            return this.decodeSNN(message);
            break;
        case '53':
            return this.decodeNNLRN(message);
            break;
        case '54':
            return this.decodeNNULN(message);
            break;
        case '57':
            return this.decodeNERD(message);
            break;
        case '58':
            return this.decodeRQEVN(message);
            break;
        case '60':
            return this.decodeDFUN(message);
            break;
        case '6F':
            return this.decodeCMDERR(message);
            break;
        case '71':
            return this.decodeNVRD(message);
            break;
        case '72':
            return this.decodeNENRD(message);
            break;
        case '73':
            return this.decodeRQNPN(message);
            break;
        case '74':
            return this.decodeNUMEV(message);
            break;
        case '90':
            return this.decodeACON(message);
            break;
        case '91':
            return this.decodeACOF(message);
            break;
        case '95':
            return this.decodeEVULN(message);
            break;
        case '96':
            return this.decodeNVSET(message);
            break;
        case '97':
            return this.decodeNVANS(message);
            break;
        case '98':
            return this.decodeASON(message);
            break;
        case '99':
            return this.decodeASOF(message);
            break;
        case '9B':
            return this.decodePARAN(message);
            break;
        case '9C':
            return this.decodeREVAL(message);
            break;
        case 'B5':
            return this.decodeNEVAL(message);
            break;
        case 'B6':
            return this.decodePNN(message);
            break;
        case 'D2':
            return this.decodeEVLRN(message);
            break;
        case 'E1':
            return this.decodePLOC(message);
            break;
        case 'F2':
            return this.decodeENRSP(message);
            break;

        default:
            return {'mnemonic': 'UNSUPPORTED', 'opCode': message.substr(7, 2)}
            break;
        }
    }



    // 10 RQNP
    //
    decodeRQNP = function(message) {
        return {'mnemonic': 'RQNP',
                'opCode': message.substr(7, 2),
        }
    }
    encodeRQNP = function() {//Request Node Parameters
		// RQNP Format: [<MjPri><MinPri=3><CANID>]<10>
        return header() + '10' + ';'
    }


    // 21 KLOC
    //
    decodeKLOC = function(message) {
        // KLOC Format: [<MjPri><MinPri=2><CANID>]<21><Session>
        return {'mnemonic': 'KLOC',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16)
        }
    }
    encodeKLOC = function(session) {
        // KLOC Format: [<MjPri><MinPri=2><CANID>]<21><Session>
        return header() + '21' + decToHex(session, 2) + ';';
    }
    

    // 22 QLOC
    //
    decodeQLOC = function(message) {
		// QLOC Format: [<MjPri><MinPri=2><CANID>]<22><Session>
        return {'mnemonic': 'QLOC',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16)
        }
    }
    encodeQLOC = function(session) {
		// QLOC Format: [<MjPri><MinPri=2><CANID>]<22><Session>
        return header() + '22' + decToHex(session, 2) + ';';
    }


    // 23 DKEEP
    //
    decodeDKEEP = function(message) {
        // DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
        return {'mnemonic': 'DKEEP',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16)
        }
    }
    encodeDKEEP = function(session) {
        // DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
        return header() + '23' + decToHex(session, 2) + ';';
    }
    

    // 27 DSPD
    //
    decodeDSPD = function(message) {
        // DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
        var speedDir = parseInt(message.substr(11, 2), 16)
        return {'mnemonic': 'DSPD',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'speed': speedDir % 128,
                'direction': (speedDir > 127) ? 'Forward' : 'Reverse',
        }
    }
    encodeDSPD = function(session, speed, direction) {
        // DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
        var speedDir = speed + parseInt((direction == 'Reverse') ? 0 : 128)
        return header() + '27' + decToHex(session, 2) + decToHex(speedDir, 2) + ';';
    }
    

    // 42 SNN
    //
    decodeSNN = function(message) {
		// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
        return {'mnemonic': 'SNN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16)
        }
    }
    encodeSNN = function(nodeId) {
		// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
        if (nodeId >= 0 && nodeId <= 0xFFFF) {
            return header() + '42' + decToHex(nodeId, 4) + ';'
        }
    }


    // 53 NNLRN
    //
    decodeNNLRN = function(message) {
		// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
        return {'mnemonic': 'NNLRN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNNLRN = function(nodeId) {
		// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
		if (nodeId >= 0 && nodeId <= 0xFFFF) {
			return header() + '53' + decToHex(nodeId, 4) + ';'
		}
    }


    // 54 NNULN
    //
    decodeNNULN = function(message) {
		// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
        return {'mnemonic': 'NNULN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNNULN = function(nodeId) {
		// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
        return header() + '54' + decToHex(nodeId, 4) + ';'
    }


    // 57 NERD
    //
    decodeNERD = function(message) {
		// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
        return {'mnemonic': 'NERD',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNERD = function(nodeId) {
		// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
        return header() + '57' + decToHex(nodeId, 4) + ';'
    }


    // 58 RQEVN
    //
    decodeRQEVN = function(message) {
		// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
        return {'mnemonic': 'RQEVN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
        }
    }
    encodeRQEVN = function(nodeId) {
		// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
        return header() + '58' + decToHex(nodeId, 4) + ';'
    }


    // 60 DFUN
    //
    decodeDFUN = function(message) {
        // DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
        return {'mnemonic': 'DFUN',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'Fn1': parseInt(message.substr(11, 2), 16),
                'Fn2': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeDFUN = function(session, Fn1, Fn2) {
        // DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
        return header() + '60' + decToHex(session, 2) + decToHex(Fn1, 2) + decToHex(Fn2, 2) + ';';
    }


    // 63 ERR
    //
    decodeERR = function(message) {
        // ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
        return {'mnemonic': 'ERR',
                'opCode': message.substr(7, 2),
                'data1': parseInt(message.substr(9, 2), 16),
                'data2': parseInt(message.substr(11, 2), 16),
                'data3': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeERR = function(data1, data2, data3) {
        // ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
        return header() + '63' + decToHex(data1, 2) + decToHex(data2, 2) + decToHex(data3, 2) + ';';
    }

    
    // 6F CMDERR
    //
    decodeCMDERR = function(message) {
        // CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
		return {'mnemonic': 'CMDERR',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'error': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeCMDERR = function(nodeId, error) {
        // CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
        return header() + '6F' + decToHex(nodeId, 4) + decToHex(error, 2) + ';';
    }


    // 71 NVRD
    //
    decodeNVRD = function(message) {
		// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
		return {'mnemonic': 'NVRD',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeNVRD = function(nodeId, nodeVariableIndex) {
		// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
        return header() + '71' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + ';'
    }


    // 72 NENRD
    //
    decodeNENRD = function(message) {
		// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
		return {'mnemonic': 'NENRD',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventIndex': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeNENRD = function(nodeId, eventIndex) {
		// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
        return header() + '72' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + ';'
    }


    // 73 RQNPN
    //
    decodeRQNPN = function(message) {
        // RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
		return {'mnemonic': 'RQNPN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'ParameterIndex': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeRQNPN = function(nodeId, ParameterIndex) {
        // RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
        return header() + '73' + decToHex(nodeId, 4) + decToHex(ParameterIndex, 2) + ';'
    }


    // 74 NUMEV
    //
    decodeNUMEV = function(message) {
        // NUMEV Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
        return {'mnemonic': 'NUMEV',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
                'eventCount': parseInt(message.substr(13, 2), 16),
        }
    }
    encodeNUMEV = function(nodeId, eventCount) {
        // NUMEV Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
        return header() + '74' + decToHex(nodeId, 4) + decToHex(eventCount, 2) + ';'
    }
    

    // 90 ACON
    //
    decodeACON = function(message) {
		// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
		return {'mnemonic': 'ACON',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    encodeACON = function(nodeId, eventNumber) {
		// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
        return header() + '90' + decToHex(nodeId, 4) + decToHex(eventNumber, 4) + ';';
    }


    // 91 ACOF
    //
    decodeACOF = function(message) {
		// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
		return {'mnemonic': 'ACOF',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    encodeACOF = function(nodeId, eventNumber) {
		// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
        return header() + '91' + decToHex(nodeId, 4) + decToHex(eventNumber, 4) + ';';
    }


    // 95 EVULN
    //
    decodeEVULN = function(message) {
		// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
        return {'mnemonic': 'EVULN',
                'opCode': message.substr(7, 2),
                'eventName': message.substr(9, 8),
        }
    }
    encodeEVULN = function(eventName) {
		// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
        return header() + '95' + eventName + ';'
    }


    // 96 NVSET
    //
    decodeNVSET = function(message) {
		// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
        return {'mnemonic': 'NVSET',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16), 
                'nodeVariableValue': parseInt(message.substr(15, 2), 16), 
        }
    }
    encodeNVSET = function(nodeId, nodeVariableIndex, nodeVariableValue) {
		// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
        return header() + '96' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + decToHex(nodeVariableValue, 2) + ';'
    }


    // 97 NVANS
    //
    decodeNVANS = function(message) {
        // NVANS Format: [[<MjPri><MinPri=3><CANID>]<97><NN hi><NN lo><NV# ><NV val>
        return {'mnemonic': 'NVANS',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16),
                'nodeVariableValue': parseInt(message.substr(15, 2), 16),
        }
    }
    encodeNVANS = function(nodeId, nodeVariableIndex, nodeVariableValue) {
        // NVANS Format: [[<MjPri><MinPri=3><CANID>]<97><NN hi><NN lo><NV# ><NV val>
        return header() + '97' + decToHex(nodeId, 4) + decToHex(nodeVariableIndex, 2) + decToHex(nodeVariableValue, 2) + ';'
    }
    

    // 98 ASON
    //
    decodeASON = function(message) {
		// ASON Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
		return {'mnemonic': 'ASON',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    encodeASON = function(nodeId, deviceNumber) {
		// ASON Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
        return header() + '98' + decToHex(nodeId, 4) + decToHex(deviceNumber, 4) + ';';
    }


    // 99 ASOF
    //
    decodeASOF = function(message) {
		// ASOF Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
		return {'mnemonic': 'ASOF',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
        }
    }
    encodeASOF = function(nodeId, deviceNumber) {
		// ASOF Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
        return header() + '99' + decToHex(nodeId, 4) + decToHex(deviceNumber, 4) + ';';
    }


    // 9B PARAN
    //
    decodePARAN = function(message) {
        // PARAN Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
        return {'mnemonic': 'PARAN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'parameterIndex': parseInt(message.substr(13, 2), 16),
                'parameterValue': parseInt(message.substr(15, 2), 16),
        }
    }
    encodePARAN = function(nodeId, parameterIndex, parameterValue) {
        // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
        return header() + '9B' + decToHex(nodeId, 4) + decToHex(parameterIndex, 2) + decToHex(parameterValue, 2) + ';'
    }


    // 9C REVAL
    //
    decodeREVAL = function(message) {
        // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
        return {'mnemonic': 'REVAL',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16), 
                'eventIndex': parseInt(message.substr(13, 2), 16), 
                'eventVariableIndex': parseInt(message.substr(15, 2), 16), 
        }
    }
    encodeREVAL = function(nodeId, eventIndex, eventVariableIndex) {
        // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
        return header() + '9C' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + decToHex(eventVariableIndex, 2) + ';'
    }


    // B5 NEVAL
    //
    decodeNEVAL = function(message) {
        // NEVAL Format: [<MjPri><MinPri=3><CANID>]<B5><NN hi><NN lo><EN#><EV#><EVval>
        return {'mnemonic': 'NEVAL',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
                'eventIndex': parseInt(message.substr(13, 2), 16),
                'eventVariableIndex': parseInt(message.substr(15, 2), 16),
                'eventVariableValue': parseInt(message.substr(17, 2), 16),
        }
    }
    encodeNEVAL = function(nodeId, eventIndex, eventVariableIndex, eventVariableValue) {
        // NEVAL Format: [<MjPri><MinPri=3><CANID>]<B5><NN hi><NN lo><EN#><EV#><EVval>
        return header() + 'B5' + decToHex(nodeId, 4) + decToHex(eventIndex, 2) + decToHex(eventVariableIndex, 2) + decToHex(eventVariableValue, 2) + ';'
    }


    // B6 PNN
    //
    decodePNN = function(message) {
        // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
        return {'mnemonic': 'PNN',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
                'manufacturerId': parseInt(message.substr(13, 2), 16), 
                'moduleId': parseInt(message.substr(15, 2), 16), 
                'flags': parseInt(message.substr(17, 2), 16),
        }
    }
    encodePNN = function(nodeId, manufacturerId, moduleId, flags) {
        // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
        return header() + 'B6' + decToHex(nodeId, 4) + decToHex(manufacturerId, 2) + decToHex(moduleId, 2) + decToHex(flags, 2) + ';'
    }


    // D2 EVLRN
    //
    decodeEVLRN = function(message) {
		// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
        return {'mnemonic': 'EVLRN',
                'opCode': message.substr(7, 2),
                'eventName': message.substr(9, 8),
                'eventVariableIndex': parseInt(message.substr(17, 2), 16),
                'eventVariableValue': parseInt(message.substr(19, 2), 16),
        }
    }
    encodeEVLRN = function(eventName, eventVariableIndex, eventVariableValue) {
		// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
        return header() + 'D2' + eventName + decToHex(eventVariableIndex, 2) + decToHex(eventVariableValue, 2) + ';'
    }
    

    // E1 PLOC
    //
    decodePLOC = function(message) {
        // PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
        var speedDir = parseInt(message.substr(15, 2), 16)
        return {'mnemonic': 'PLOC',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'address': parseInt(message.substr(11, 4), 16),
                'speed': speedDir % 128,
                'direction': (speedDir > 127) ? 'Forward' : 'Reverse',
                'Fn1': parseInt(message.substr(17, 2), 16),
                'Fn2': parseInt(message.substr(19, 2), 16),
                'Fn3': parseInt(message.substr(21, 2), 16),
        }
    }
    encodePLOC = function(session, address, speed, direction, Fn1, Fn2, Fn3) {
        // PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
        var speedDir = speed + parseInt((direction == 'Reverse') ? 0 : 128)
        return header() + 'E1' + decToHex(session, 2) + decToHex(address, 4) + decToHex(speedDir, 2) + decToHex(Fn1, 2) + decToHex(Fn2, 2) + decToHex(Fn3, 2) + ';';
    }
    

    // F2 ENRSP
    //
    decodeENRSP = function(message) {
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
        return {'mnemonic': 'ENRSP',
                'opCode': message.substr(7, 2),
                'nodeId': parseInt(message.substr(9, 4), 16),
                'eventName': message.substr(13, 8),
                'eventIndex': parseInt(message.substr(21, 2), 16),
        }
    }
    encodeENRSP = function(nodeId, eventName, eventIndex) {
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
        return header() + 'F2' + decToHex(nodeId, 4) + eventName + decToHex(eventIndex, 2) + ';';
    }

}

module.exports = new cbusLibrary();


/* module.exports = {
    cbusMessage: cbusMessage
}
 */


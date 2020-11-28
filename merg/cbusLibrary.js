////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// cbusLibrary
// Includes encode & decoding functions
//
//		expects the 'raw' CBUS message in the 'Grid connect' CAN over serial message syntax
//
//     : <S | X> <IDENTIFIER> <N> <DATA-0> <DATA-1> … <DATA-7> ;
//
//          Each byte occupies two character positions, starting at position 0
//          For CBUS, an 11 bit CAN identifier is used, and occupies character positions 2 to 5
//          The actual CBUS data starts at character position 7
//          The CBUS opCode is always character positions 7 & 8
//          Any further CBUS data (dependant on opCode) starts at character position 9
//
//      All formats & naming conventions taken from CBUS specification
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
'use strict';


function decToHex(num, len) {return parseInt(num).toString(16).toUpperCase().padStart(len, '0');}

class cbusLibrary {
    constructor() {
        this.canHeader = {
                    'MjPri': 2,     // lowest allowed priority (highest value)
                    'CAN_ID': 60,
        }
    }

    //
    // header() provides the prefix to add to CBUS data to compose a transmittable message
    // CAN uses a bitwise arbitration scheme whereby the header with the lowest value has priority
    // So higher values have lower priority
    // The CAN protocol prohibits a sequence of 7 or more 1 bits at the start of the header, so a
    // MjPri. of 11 in binary (3 in decimal) is not used
    //
    header = function({
                    MjPri = this.canHeader.MjPri,
                    MinPri = 3,
                    CAN_ID = this.canHeader.CAN_ID
        } = {}) {
        // ensure all variables don't exceed the appropriate number of bits for encoding
        if (MjPri > 2) {MjPri = 2}      // MjPri is two bits, but a value of 3 is not allowed
        MinPri = MinPri % 4             // MinPri is two bits, 0 to 3
        CAN_ID = CAN_ID % 128           // CAN_ID is 7 bits, 0 to 127
		var identifier = parseInt(MjPri << 14) + parseInt(MinPri << 12) + parseInt(CAN_ID << 5) 
        return ':S' + decToHex(identifier, 4) + 'N'
    }

    getCanHeader() {
        return this.canHeader
        }
    setCanHeader(MjPri, CAN_ID) {
        if (MjPri != undefined) { 
        this.canHeader.MjPri = (MjPri > 2) ? 2 : MjPri}                     // MjPri is two bits, but a value of 3 is n0t allowed
        if (CAN_ID != undefined) { this.canHeader.CAN_ID = CAN_ID % 128}    // CAN_ID is 7 bits, 0 to 127
    }
    


    //
    //
    // Decode / Encode Functions strictly arranged by numerical opcode to ensure that it's easy to spot if a function already exists
    //
    //


    //
    // As a full message contains the opCode, a single function can be used to decode any message
    // and it then works out which decoding routine to call dependant on the opCode
    //
    decode = function(message) {
        if (message == undefined) message = this.message;
        var opCode = message.substr(7, 2);
        switch (opCode) {
        case '00':
            return this.decodeACK(message);
            break;
        case '01':
            return this.decodeNAK(message);
            break;
        case '02':
            return this.decodeHLT(message);
            break;
        case '03':
            return this.decodeBON(message);
            break;
        case '04':
            return this.decodeTOF(message);
            break;
        case '05':
            return this.decodeTON(message);
            break;
        case '06':
            return this.decodeESTOP(message);
            break;
        case '07':
            return this.decodeARST(message);
            break;
        case '08':
            return this.decodeRTOF(message);
            break;
        case '09':
            return this.decodeRTON(message);
            break;
        case '0A':
            return this.decodeRESTP(message);
            break;
        // 0B reserved
        case '0C':
            return this.decodeRSTAT(message);
            break;
        case '0D':
            return this.decodeQNN(message);
            break;
        // 0E, 0F reserved
        case '10':
            return this.decodeRQNP(message);
            break;
        case '11':
            return this.decodeRQMN(message);
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
        case '42':
            return this.decodeSNN(message);
            break;
        case '47':
            return this.decodeDSPD(message);
            break;
		case '50':
            return this.decodeRQNN(message);
            break;
        case '52':
            return this.decodeNNACK(message);
            break;
        case '53':
            return this.decodeNNLRN(message);
            break;
        case '54':
            return this.decodeNNULN(message);
            break;
        case '55':
            return this.decodeNNCLR(message);
            break;
        case '57':
            return this.decodeNERD(message);
            break;
        case '58':
            return this.decodeRQEVN(message);
            break;
        case '59':
            return this.decodeWRACK(message);
            break;
        case '60':
            return this.decodeDFUN(message);
            break;
        case '63':
            return this.decodeERR(message);
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
        case 'B0':
            return this.decodeACON1(message);
            break;
        case 'B1':
            return this.decodeACOF1(message);
            break;
        case 'B5':
            return this.decodeNEVAL(message);
            break;
        case 'B6':
            return this.decodePNN(message);
            break;
        case 'B8':
            return this.decodeASON1(message);
            break;
        case 'B9':
            return this.decodeASOF1(message);
            break;
        case 'D0':
            return this.decodeACON2(message);
            break;
        case 'D1':
            return this.decodeACOF2(message);
            break;
        case 'D2':
            return this.decodeEVLRN(message);
            break;
        case 'D8':
            return this.decodeASON2(message);
            break;
        case 'D9':
            return this.decodeASOF2(message);
            break;
        case 'E1':
            return this.decodePLOC(message);
            break;
        case 'F0':
            return this.decodeACON3(message);
            break;
        case 'F1':
            return this.decodeACOF3(message);
            break;
        case 'F2':
            return this.decodeENRSP(message);
            break;
        case 'F8':
            return this.decodeASON3(message);
            break;
        case 'F9':
            return this.decodeASOF3(message);
            break;

        default:
            return {'encoded': message ,'mnemonic': 'UNSUPPORTED', 'opCode': message.substr(7, 2)}
            break;
        }
    }



    // 00 ACK
    // ACK Format: [<MjPri><MinPri=2><CANID>]<00>
    decodeACK = function(message) {
        return {'encoded': message,
                'mnemonic': 'ACK',
                'opCode': message.substr(7, 2),
                'text': 'ACK (00)',
        }
    }
    encodeACK = function() {
        return this.header({MinPri: 2}) + '00' + ';'
    }


    // 01 NAK
    // NAK Format: [<MjPri><MinPri=2><CANID>]<01>
    //
    decodeNAK = function(message) {
        return {'encoded': message,
                'mnemonic': 'NAK',
                'opCode': message.substr(7, 2),
                'text': 'NAK (01)',
        }
    }
    encodeNAK = function() {
        return this.header({MinPri: 2}) + '01' + ';'
    }


    // 02 HLT
    // HLT Format: [<MjPri><MinPri=0><CANID>]<02>
    //
    decodeHLT = function(message) {
        return {'encoded': message,
                'mnemonic': 'HLT',
                'opCode': message.substr(7, 2),
                'text': 'HLT (02)',
        }
    }
    encodeHLT = function() {
        return this.header({MinPri: 0}) + '02' + ';'
    }


    // 03 BON
    // BON Format: [<MjPri><MinPri=1><CANID>]<03>
    //
    decodeBON = function(message) {
        return {'encoded': message,
                'mnemonic': 'BON',
                'opCode': message.substr(7, 2),
                'text': 'BON (03)',
        }
    }
    encodeBON = function() {
        return this.header({MinPri: 1}) + '03' + ';'
    }


    // 04 TOF
    // TOF Format: [<MjPri><MinPri=1><CANID>]<04>
    //
    decodeTOF = function(message) {
        return {'encoded': message,
                'mnemonic': 'TOF',
                'opCode': message.substr(7, 2),
                'text': 'TOF (04)',
        }
    }
    encodeTOF = function() {
        return this.header({MinPri: 1}) + '04' + ';'
    }


    // 05 TON
    // TON Format: [<MjPri><MinPri=1><CANID>]<05>
    //
    decodeTON = function(message) {
        return {'encoded': message,
                'mnemonic': 'TON',
                'opCode': message.substr(7, 2),
                'text': 'TON (05)',
        }
    }
    encodeTON = function() {
        return this.header({MinPri: 1}) + '05' + ';'
    }


    // 06 ESTOP
    // ESTOP Format: [<MjPri><MinPri=1><CANID>]<06>
    //
    decodeESTOP = function(message) {
        return {'encoded': message,
                'mnemonic': 'ESTOP',
                'opCode': message.substr(7, 2),
                'text': 'ESTOP (06)',
        }
    }
    encodeESTOP = function() {
        return this.header({MinPri: 1}) + '06' + ';'
    }


    // 07 ARST
    // ARST Format: [<MjPri><MinPri=0><CANID>]<07>
    //
    decodeARST = function(message) {
        return {'encoded': message,
                'mnemonic': 'ARST',
                'opCode': message.substr(7, 2),
                'text': 'ARST (07)',
        }
    }
    encodeARST = function() {
        return this.header({MinPri: 0}) + '07' + ';'
    }


    // 08 RTOF
    // RTOF Format: [<MjPri><MinPri=1><CANID>]<08>
    //
    decodeRTOF = function(message) {
        return {'encoded': message,
                'mnemonic': 'RTOF',
                'opCode': message.substr(7, 2),
                'text': 'RTOF (08)',
        }
    }
    encodeRTOF = function() {
        return this.header({MinPri: 1}) + '08' + ';'
    }


    // 09 RTON
    // RTON Format: [<MjPri><MinPri=1><CANID>]<09>
    //
    decodeRTON = function(message) {
        return {'encoded': message,
                'mnemonic': 'RTON',
                'opCode': message.substr(7, 2),
                'text': 'RTON (09)',
        }
    }
    encodeRTON = function() {
        return this.header({MinPri: 1}) + '09' + ';'
    }


    // 0A RESTP
    // RESTP Format: [<MjPri><MinPri=0><CANID>]<0A>
    //
    decodeRESTP = function(message) {
        return {'encoded': message,
                'mnemonic': 'RESTP',
                'opCode': message.substr(7, 2),
                'text': 'RESTP (0A)',
        }
    }
    encodeRESTP = function() {
        return this.header({MinPri: 0}) + '0A' + ';'
    }


    // 0C RSTAT
    // RSTAT Format: [<MjPri><MinPri=2><CANID>]<0C>
    //
    decodeRSTAT = function(message) {
        return {'encoded': message,
                'mnemonic': 'RSTAT',
                'opCode': message.substr(7, 2),
                'text': 'RSTAT (0C)',
        }
    }
    encodeRSTAT = function() {
        return this.header({MinPri: 2}) + '0C' + ';'
    }


    // 0D QNN
    // QNN Format: [<MjPri><MinPri=3><CANID>]<0D>
    //
    decodeQNN = function(message) {
        return {'encoded': message,
                'mnemonic': 'QNN',
                'opCode': message.substr(7, 2),
                'text': 'QNN (0D)',
        }
    }
    encodeQNN = function() {//Request Node Parameters
        return this.header({MinPri: 3}) + '0D' + ';'
    }


    // 10 RQNP
    // RQNP Format: [<MjPri><MinPri=3><CANID>]<10>
    //
    decodeRQNP = function(message) {
        return {'encoded': message,
                'mnemonic': 'RQNP',
                'opCode': message.substr(7, 2),
                'text': 'RQNP (10)',
        }
    }
    encodeRQNP = function() {
        return this.header({MinPri: 3}) + '10' + ';'
    }


    // 11 RQMN
	// RQMN Format: [<MjPri><MinPri=2><CANID>]<11>
    //
    decodeRQMN = function(message) {
        return {'encoded': message,
                'mnemonic': 'RQMN',
                'opCode': message.substr(7, 2),
                'text': 'RQMN (11)',
        }
    }
    encodeRQMN = function() {//Request Node Parameters
        return this.header({MinPri: 2}) + '11' + ';'
    }


    // 21 KLOC
    // KLOC Format: [<MjPri><MinPri=2><CANID>]<21><Session>
    //
    decodeKLOC = function(message) {
        return {'encoded': message,
                'mnemonic': 'KLOC',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'text': 'KLOC (21) Session ' + parseInt(message.substr(9, 2), 16),
        }
    }
    encodeKLOC = function(session) {
        return this.header({MinPri: 2}) + '21' + decToHex(session, 2) + ';';
    }
    

    // 22 QLOC
	// QLOC Format: [<MjPri><MinPri=2><CANID>]<22><Session>
    //
    decodeQLOC = function(message) {
        return {'encoded': message,
                'mnemonic': 'QLOC',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'text': 'QLOC (22) Session ' + parseInt(message.substr(9, 2), 16),
        }
    }
    encodeQLOC = function(session) {
        return this.header({MinPri: 2}) + '22' + decToHex(session, 2) + ';';
    }


    // 23 DKEEP
    // DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
    //
    decodeDKEEP = function(message) {
        return {'encoded': message,
                'mnemonic': 'DKEEP',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'text': 'DKEEP (23) Session ' + parseInt(message.substr(9, 2), 16),
        }
    }
    encodeDKEEP = function(session) {
        return this.header({MinPri: 2}) + '23' + decToHex(session, 2) + ';';
    }
    

    // 42 SNN
	// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
    //
    decodeSNN = function(message) {
        return {'encoded': message,
                'mnemonic': 'SNN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'SNN (42) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeSNN = function(nodeNumber) {
        if (nodeNumber >= 0 && nodeNumber <= 0xFFFF) {
            return this.header({MinPri: 3}) + '42' + decToHex(nodeNumber, 4) + ';'
        }
    }


    // 47 DSPD
    // DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
    //
    decodeDSPD = function(message) {
        var speedDir = parseInt(message.substr(11, 2), 16)
        var direction = (speedDir > 127) ? 'Forward' : 'Reverse'
        return {'encoded': message,
                'mnemonic': 'DSPD',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'speed': speedDir % 128,
                'direction': direction,
                'text': 'DSPD (47) Session ' + parseInt(message.substr(9, 2), 16) + 
                    ' Speed ' + speedDir % 128 + 
                    ' Direction ' + direction,
        }
    }
    encodeDSPD = function(session, speed, direction) {
        var speedDir = speed + parseInt((direction == 'Reverse') ? 0 : 128)
        return this.header({MinPri: 2}) + '47' + decToHex(session, 2) + decToHex(speedDir, 2) + ';';
    }
    

    // 50 RQNN
	// RQNN Format: [<MjPri><MinPri=3><CANID>]<50><NN hi><NN lo>
    //
    decodeRQNN = function(message) {
        return {'encoded': message,
                'mnemonic': 'RQNN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'RQNN (50) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeRQNN = function(nodeNumber) {
        return this.header({MinPri: 3}) + '50' + decToHex(nodeNumber, 4) + ';'
    }
    

    // 52 NNACK
	// NNACK Format: [<MjPri><MinPri=3><CANID>]<52><NN hi><NN lo>
    //
    decodeNNACK = function(message) {
        return {'encoded': message,
                'mnemonic': 'NNACK',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'NNACK (52) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNNACK = function(nodeNumber) {
		if (nodeNumber >= 0 && nodeNumber <= 0xFFFF) {
			return this.header({MinPri: 3}) + '52' + decToHex(nodeNumber, 4) + ';'
		}
    }


    // 53 NNLRN
	// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
    //
    decodeNNLRN = function(message) {
        return {'encoded': message,
                'mnemonic': 'NNLRN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'NNLRN (53) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNNLRN = function(nodeNumber) {
		if (nodeNumber >= 0 && nodeNumber <= 0xFFFF) {
			return this.header({MinPri: 3}) + '53' + decToHex(nodeNumber, 4) + ';'
		}
    }


    // 54 NNULN
	// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
    //
    decodeNNULN = function(message) {
        return {'encoded': message,
                'mnemonic': 'NNULN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'NNULN (54) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNNULN = function(nodeNumber) {
        return this.header({MinPri: 3}) + '54' + decToHex(nodeNumber, 4) + ';'
    }


    // 55 NNCLR
	// NNCLR Format: [<MjPri><MinPri=3><CANID>]<55><NN hi><NN lo>>
    //
    decodeNNCLR = function(message) {
        return {'encoded': message,
                'mnemonic': 'NNCLR',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'NNCLR (55) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNNCLR = function(nodeNumber) {
        return this.header({MinPri: 3}) + '55' + decToHex(nodeNumber, 4) + ';'
    }


    // 57 NERD
	// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
    //
    decodeNERD = function(message) {
		// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
        return {'encoded': message,
                'mnemonic': 'NERD',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'NERD (57) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeNERD = function(nodeNumber) {
        return this.header({MinPri: 3}) + '57' + decToHex(nodeNumber, 4) + ';'
    }


    // 58 RQEVN
    // RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
    //
    decodeRQEVN = function(message) {
		// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
        return {'encoded': message,
                'mnemonic': 'RQEVN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': 'RQEVN (58) Node ' + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeRQEVN = function(nodeNumber) {
        return this.header({MinPri: 3}) + '58' + decToHex(nodeNumber, 4) + ';'
    }


    // 59 WRACK
	// WRACK Format: [<MjPri><MinPri=3><CANID>]<59><NN hi><NN lo>
    //
    decodeWRACK = function(message) {
        return {'encoded': message,
                'mnemonic': 'WRACK',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'text': "WRACK (59) Node " + parseInt(message.substr(9, 4), 16),
        }
    }
    encodeWRACK = function(nodeNumber) {
        return this.header({MinPri: 3}) + '59' + decToHex(nodeNumber, 4) + ';'
    }


    // 60 DFUN
    // DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
    //
    decodeDFUN = function(message) {
        return {'encoded': message,
                'mnemonic': 'DFUN',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'Fn1': parseInt(message.substr(11, 2), 16),
                'Fn2': parseInt(message.substr(13, 2), 16),
                'text': "DFUN (60) Session " + parseInt(message.substr(9, 2), 16) +
					" Fn1 " + parseInt(message.substr(11, 2), 16) +
					" Fn2 " + parseInt(message.substr(13, 2), 16),
        }
    }
    encodeDFUN = function(session, Fn1, Fn2) {
        return this.header({MinPri: 2}) + '60' + decToHex(session, 2) + decToHex(Fn1, 2) + decToHex(Fn2, 2) + ';';
    }


    // 63 ERR
    // ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
    // data 3 is currently assigned to error number
    //
    decodeERR = function(message) {
        return {'encoded': message,
                'mnemonic': 'ERR',
                'opCode': message.substr(7, 2),
                'data1': parseInt(message.substr(9, 2), 16),
                'data2': parseInt(message.substr(11, 2), 16),
                'errorNumber': parseInt(message.substr(13, 2), 16),
                'text': "ERR (63) Data1 " + parseInt(message.substr(9, 2), 16) +
					" Data2 " + parseInt(message.substr(11, 2), 16) +
					" errorNumber " + parseInt(message.substr(13, 2), 16),
        }
    }
    encodeERR = function(data1, data2, errorNumber) {
        return this.header({MinPri: 2}) + '63' + decToHex(data1, 2) + decToHex(data2, 2) + decToHex(errorNumber, 2) + ';';
    }

    
    // 6F CMDERR
    // CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
    //
    decodeCMDERR = function(message) {
		return {'encoded': message,
                'mnemonic': 'CMDERR',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'errorNumber': parseInt(message.substr(13, 2), 16),
                'text': "CMDERR (6F) Node " + parseInt(message.substr(9, 4), 16) + 
					" errorNumber " + parseInt(message.substr(13, 2), 16)
        }
    }
    encodeCMDERR = function(nodeNumber, errorNumber) {
        return this.header({MinPri: 3}) + '6F' + decToHex(nodeNumber, 4) + decToHex(errorNumber, 2) + ';';
    }


    // 71 NVRD
    // NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
    //
    decodeNVRD = function(message) {
		return {'encoded': message,
                'mnemonic': 'NVRD',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16),
                'text': "NVRD (71) Node " + parseInt(message.substr(9, 4), 16) + 
					" Node Variable Index " + parseInt(message.substr(13, 2), 16)
        }
    }
    encodeNVRD = function(nodeNumber, nodeVariableIndex) {
        return this.header({MinPri: 3}) + '71' + decToHex(nodeNumber, 4) + decToHex(nodeVariableIndex, 2) + ';'
    }


    // 72 NENRD
	// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
    //
    decodeNENRD = function(message) {
		return {'encoded': message,
                'mnemonic': 'NENRD',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventIndex': parseInt(message.substr(13, 2), 16),
                'text': "NENRD (72) Node " + parseInt(message.substr(9, 4), 16) + 
					" Event Index " + parseInt(message.substr(13, 2), 16)
        }
    }
    encodeNENRD = function(nodeNumber, eventIndex) {
        return this.header({MinPri: 3}) + '72' + decToHex(nodeNumber, 4) + decToHex(eventIndex, 2) + ';'
    }


    // 73 RQNPN
    // RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
    //
    decodeRQNPN = function(message) {
		return {'encoded': message,
                'mnemonic': 'RQNPN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'ParameterIndex': parseInt(message.substr(13, 2), 16),
                'text': "RQNPN (73) Node " + parseInt(message.substr(9, 4), 16) + 
					" Node Parameter Index " + parseInt(message.substr(13, 2), 16)
        }
    }
    encodeRQNPN = function(nodeNumber, ParameterIndex) {
        return this.header({MinPri: 3}) + '73' + decToHex(nodeNumber, 4) + decToHex(ParameterIndex, 2) + ';'
    }


    // 74 NUMEV
    // NUMEV Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
    //
    decodeNUMEV = function(message) {
        return {'encoded': message,
                'mnemonic': 'NUMEV',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'eventCount': parseInt(message.substr(13, 2), 16),
                'text': "NUMEV (74) Node " + parseInt(message.substr(9, 4), 16) + 
					" Event Count " + parseInt(message.substr(13, 2), 16)
        }
    }
    encodeNUMEV = function(nodeNumber, eventCount) {
        return this.header({MinPri: 3}) + '74' + decToHex(nodeNumber, 4) + decToHex(eventCount, 2) + ';'
    }
    

    // 90 ACON
	// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
    //
    decodeACON = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACON',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {hex:''},
                'text': "ACON (90) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16)
        }
    }
    encodeACON = function(nodeNumber, eventNumber) {
        return this.header({MinPri: 3}) + '90' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) + ';';
    }


    // 91 ACOF
	// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
    //
    decodeACOF = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACOF',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {hex:''},
                'text': "ACOF (91) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16)
        }
    }
    encodeACOF = function(nodeNumber, eventNumber) {
        return this.header({MinPri: 3}) + '91' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) + ';';
    }


    // 95 EVULN
	// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
    //
    decodeEVULN = function(message) {
        return {'encoded': message,
                'mnemonic': 'EVULN',
                'opCode': message.substr(7, 2),
                'eventName': message.substr(9, 8),
                'text': "EVULN (95) eventName " + message.substr(9, 8),
        }
    }
    encodeEVULN = function(eventName) {
        return this.header({MinPri: 3}) + '95' + eventName + ';'
    }


    // 96 NVSET
	// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
    //
    decodeNVSET = function(message) {
        return {'encoded': message,
                'mnemonic': 'NVSET',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16), 
                'nodeVariableValue': parseInt(message.substr(15, 2), 16), 
                'text':  "NVSET (96) Node " + parseInt(message.substr(9, 4), 16) + 
					" Node Variable Index " + parseInt(message.substr(13, 2), 16) +
					" Node Variable Value " + parseInt(message.substr(15, 2), 16)
        }
    }
    encodeNVSET = function(nodeNumber, nodeVariableIndex, nodeVariableValue) {
        return this.header({MinPri: 3}) + '96' + decToHex(nodeNumber, 4) + decToHex(nodeVariableIndex, 2) + decToHex(nodeVariableValue, 2) + ';'
    }


    // 97 NVANS
    //
    decodeNVANS = function(message) {
        // NVANS Format: [[<MjPri><MinPri=3><CANID>]<97><NN hi><NN lo><NV# ><NV val>
        return {'encoded': message,
                'mnemonic': 'NVANS',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'nodeVariableIndex': parseInt(message.substr(13, 2), 16),
                'nodeVariableValue': parseInt(message.substr(15, 2), 16),
                'text':  "NVANS (97) Node " + parseInt(message.substr(9, 4), 16) + 
					" Node Variable Index " + parseInt(message.substr(13, 2), 16) +
					" Node Variable Value " + parseInt(message.substr(15, 2), 16)
        }
    }
    encodeNVANS = function(nodeNumber, nodeVariableIndex, nodeVariableValue) {
        return this.header({MinPri: 3}) + '97' + decToHex(nodeNumber, 4) + decToHex(nodeVariableIndex, 2) + decToHex(nodeVariableValue, 2) + ';'
    }
    

    // 98 ASON
	// ASON Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
    //
    decodeASON = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASON',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {hex:''},
                'text': "ASON (98) Node " + parseInt(message.substr(9, 4), 16) + 
					" Device Number " + parseInt(message.substr(13, 4), 16)
        }
    }
    encodeASON = function(nodeNumber, deviceNumber) {
        return this.header({MinPri: 3}) + '98' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) + ';';
    }


    // 99 ASOF
	// ASOF Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
    //
    decodeASOF = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASOF',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventData': {hex:''},
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'text': "ASOF (99) Node " + parseInt(message.substr(9, 4), 16) + 
					" Device Number " + parseInt(message.substr(13, 4), 16)
        }
    }
    encodeASOF = function(nodeNumber, deviceNumber) {
        return this.header({MinPri: 3}) + '99' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) + ';';
    }


    // 9B PARAN
    // PARAN Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
    //
    decodePARAN = function(message) {
        return {'encoded': message,
                'mnemonic': 'PARAN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'parameterIndex': parseInt(message.substr(13, 2), 16),
                'parameterValue': parseInt(message.substr(15, 2), 16),
                'text': "PARAN (9B) Node " + parseInt(message.substr(9, 4), 16) + 
					" Parameter Index " + parseInt(message.substr(13, 2), 16) + 
					" Parameter Value " + parseInt(message.substr(15, 2), 16)
        }
    }
    encodePARAN = function(nodeNumber, parameterIndex, parameterValue) {
        return this.header({MinPri: 3}) + '9B' + decToHex(nodeNumber, 4) + decToHex(parameterIndex, 2) + decToHex(parameterValue, 2) + ';'
    }


    // 9C REVAL
    // REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
    //
    decodeREVAL = function(message) {
        return {'encoded': message,
                'mnemonic': 'REVAL',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventIndex': parseInt(message.substr(13, 2), 16), 
                'eventVariableIndex': parseInt(message.substr(15, 2), 16), 
                'text': "REVAL (9C) Node " + parseInt(message.substr(9, 4), 16) + 
					" Event Index " + parseInt(message.substr(13, 2), 16) + 
					" Event VariableIndex " + parseInt(message.substr(15, 2), 16)
        }
    }
    encodeREVAL = function(nodeNumber, eventIndex, eventVariableIndex) {
        return this.header({MinPri: 3}) + '9C' + decToHex(nodeNumber, 4) + decToHex(eventIndex, 2) + decToHex(eventVariableIndex, 2) + ';'
    }


    // B0 ACON1
	// ACON1 Format: [<MjPri><MinPri=3><CANID>]<D0><NN hi><NN lo><EN hi><EN lo><data1>
    //
    decodeACON1 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACON1',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                hex:message.substr(17, 2)},
                'text': "ACON1 (B0) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16)
        }
    }
    encodeACON1 = function(nodeNumber, eventNumber, data1, data2) {
        return this.header({MinPri: 3}) + 'B0' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) +
            decToHex(data1, 2) + ';';
    }


    // B1 ACOF1
	// ACOF1 Format: [<MjPri><MinPri=3><CANID>]<B1><NN hi><NN lo><EN hi><EN lo><data1>
    //
    decodeACOF1 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACOF1',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                hex:message.substr(17, 2)},
                'text': "ACOF1 (B1) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16)
        }
    }
    encodeACOF1 = function(nodeNumber, eventNumber, data1) {
        return this.header({MinPri: 3}) + 'B1' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) +
            decToHex(data1, 2) + ';';
    }


    // B5 NEVAL
    // NEVAL Format: [<MjPri><MinPri=3><CANID>]<B5><NN hi><NN lo><EN#><EV#><EVval>
    //
    decodeNEVAL = function(message) {
        return {'encoded': message,
                'mnemonic': 'NEVAL',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'eventIndex': parseInt(message.substr(13, 2), 16),
                'eventVariableIndex': parseInt(message.substr(15, 2), 16),
                'eventVariableValue': parseInt(message.substr(17, 2), 16),
                'text': "NEVAL (B5) NodeId " + parseInt(message.substr(9, 4), 16) + 
					" Event Index " + parseInt(message.substr(13, 2), 16) + 
					" Event Variable Index " + parseInt(message.substr(15, 2), 16) + 
					" Event Variable Value " + parseInt(message.substr(17, 2), 16)
        }
    }
    encodeNEVAL = function(nodeNumber, eventIndex, eventVariableIndex, eventVariableValue) {
        return this.header({MinPri: 3}) + 'B5' + decToHex(nodeNumber, 4) + decToHex(eventIndex, 2) + decToHex(eventVariableIndex, 2) + decToHex(eventVariableValue, 2) + ';'
    }


    // B6 PNN
    // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
    //
    decodePNN = function(message) {
        return {'encoded': message,
                'mnemonic': 'PNN',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'manufacturerId': parseInt(message.substr(13, 2), 16), 
                'moduleId': parseInt(message.substr(15, 2), 16), 
                'flags': parseInt(message.substr(17, 2), 16),
                'text': "PNN (B6) Node " + parseInt(message.substr(9, 4), 16) + 
					" Manufacturer Id " + parseInt(message.substr(13, 2), 16) + 
					" Module Id " + parseInt(message.substr(15, 2), 16) + 
					" Flags " + parseInt(message.substr(17, 2), 16)
        }
    }
    encodePNN = function(nodeNumber, manufacturerId, moduleId, flags) {
        return this.header({MinPri: 3}) + 'B6' + decToHex(nodeNumber, 4) + decToHex(manufacturerId, 2) + decToHex(moduleId, 2) + decToHex(flags, 2) + ';'
    }


    

    // B8 ASON1
    // ASON1 Format: [<MjPri><MinPri=3><CANID>]<D8><NN hi><NN lo><EN hi><EN lo><data1>
    //
    decodeASON1 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASON1',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16),
                                hex:message.substr(17, 2)},
                'text': "ASON1 (B8) Node " + parseInt(message.substr(9, 4), 16) + 
					" deviceNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16)
        }
    }
    encodeASON1 = function(nodeNumber, deviceNumber, data1) {
        return this.header({MinPri: 3}) + 'B8' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) +
            decToHex(data1, 2) + ';';
    }


    // B9 ASOF1
	// ASOF1 Format: [<MjPri><MinPri=3><CANID>]<B9><NN hi><NN lo><EN hi><EN lo><data1>
    //
    decodeASOF1 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASOF1',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                hex:message.substr(17, 2)},
                'text': "ASOF1 (B9) Node " + parseInt(message.substr(9, 4), 16) + 
					" deviceNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16)
        }
    }
    encodeASOF1 = function(nodeNumber, deviceNumber, data1) {
        return this.header({MinPri: 3}) + 'B9' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) +
            decToHex(data1, 2) + ';';
    }


    // D0 ACON2
	// ACON2 Format: [<MjPri><MinPri=3><CANID>]<D0><NN hi><NN lo><EN hi><EN lo><data1><data2>
    //
    decodeACON2 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACON2',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                hex:message.substr(17, 4)},
                'text': "ACON2 (D0) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16)
        }
    }
    encodeACON2 = function(nodeNumber, eventNumber, data1, data2) {
        return this.header({MinPri: 3}) + 'D0' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + ';';
    }


    // D1 ACOF2
	// ACOF2 Format: [<MjPri><MinPri=3><CANID>]<D1><NN hi><NN lo><EN hi><EN lo><data1><data2>
    //
    decodeACOF2 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACOF2',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                hex:message.substr(17, 4)},
                'text': "ACOF2 (D1) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16)
        }
    }
    encodeACOF2 = function(nodeNumber, eventNumber, data1, data2) {
        return this.header({MinPri: 3}) + 'D1' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + ';';
    }


    // D2 EVLRN
	// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
    //
    decodeEVLRN = function(message) {
        return {'encoded': message,
                'mnemonic': 'EVLRN',
                'opCode': message.substr(7, 2),
                'eventName': message.substr(9, 8),
                'eventVariableIndex': parseInt(message.substr(17, 2), 16),
                'eventVariableValue': parseInt(message.substr(19, 2), 16),
                'text': "EVLRN (D2) eventName " + message.substr(9, 8) + 
					" Event Variable Index " + parseInt(message.substr(17, 2), 16) + 
					" Event Variable Value " + parseInt(message.substr(19, 2), 16)
        }
    }
    encodeEVLRN = function(eventName, eventVariableIndex, eventVariableValue) {
        return this.header({MinPri: 3}) + 'D2' + eventName + decToHex(eventVariableIndex, 2) + decToHex(eventVariableValue, 2) + ';'
    }
    

    // D8 ASON2
	// ASON2 Format: [<MjPri><MinPri=3><CANID>]<D8><NN hi><NN lo><EN hi><EN lo><data1><data2>
    //
    decodeASON2 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASON2',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                hex:message.substr(17, 4)},
                'text': "ASON2 (D8) Node " + parseInt(message.substr(9, 4), 16) + 
					" deviceNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16)
        }
    }
    encodeASON2 = function(nodeNumber, deviceNumber, data1, data2) {
        return this.header({MinPri: 3}) + 'D8' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + ';';
    }


    // D9 ASOF2
	// ASOF2 Format: [<MjPri><MinPri=3><CANID>]<D9><NN hi><NN lo><EN hi><EN lo><data1><data2>
    //
    decodeASOF2 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASOF2',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                hex:message.substr(17, 4)},
                'text': "ASOF2 (D9) Node " + parseInt(message.substr(9, 4), 16) + 
					" deviceNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16)
        }
    }
    encodeASOF2 = function(nodeNumber, deviceNumber, data1, data2) {
        return this.header({MinPri: 3}) + 'D9' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + ';';
    }


    // E1 PLOC
    // PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
    //
    decodePLOC = function(message) {
        var speedDir = parseInt(message.substr(15, 2), 16)
        var direction = (speedDir > 127) ? 'Forward' : 'Reverse';
        return {'encoded': message,
                'mnemonic': 'PLOC',
                'opCode': message.substr(7, 2),
                'session': parseInt(message.substr(9, 2), 16),
                'address': parseInt(message.substr(11, 4), 16),
                'speed': speedDir % 128,
                'direction': direction,
                'Fn1': parseInt(message.substr(17, 2), 16),
                'Fn2': parseInt(message.substr(19, 2), 16),
                'Fn3': parseInt(message.substr(21, 2), 16),
                'text': "PLOC (E1) Session " + parseInt(message.substr(9, 2), 16) + 
					" Address " + parseInt(message.substr(11, 4), 16) +
					" Speed/Dir " + speedDir % 128 +
					" Direction " + direction +
					" Fn1 " + parseInt(message.substr(17, 2), 16) +
					" Fn2 " + parseInt(message.substr(19, 2), 16) +
					" Fn3 " + parseInt(message.substr(21, 2), 16)
        }
    }
    encodePLOC = function(session, address, speed, direction, Fn1, Fn2, Fn3) {
        var speedDir = speed + parseInt((direction == 'Reverse') ? 0 : 128)
        return this.header({MinPri: 2}) + 'E1' + decToHex(session, 2) + decToHex(address, 4) + decToHex(speedDir, 2) + decToHex(Fn1, 2) + decToHex(Fn2, 2) + decToHex(Fn3, 2) + ';';
    }
    

    // F0 ACON3
	// ACON3 Format: [<MjPri><MinPri=3><CANID>]<F0><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
    //
    decodeACON3 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACON3',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                data3: parseInt(message.substr(21, 2), 16),
                                hex:message.substr(17, 6)},
                'text': "ACON3 (F0) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16) +
                    " data3 " + parseInt(message.substr(21, 2), 16)
        }
    }
    encodeACON3 = function(nodeNumber, eventNumber, data1, data2, data3) {
        return this.header({MinPri: 3}) + 'F0' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + decToHex(data3, 2) + ';';
    }


    // F1 ACOF3
	// ACOF3 Format: [<MjPri><MinPri=3><CANID>]<F1><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
    //
    decodeACOF3 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ACOF3',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'eventNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                data3: parseInt(message.substr(21, 2), 16),
                                hex:message.substr(17, 6)},
                'text': "ACOF3 (F1) Node " + parseInt(message.substr(9, 4), 16) + 
					" eventNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16) +
                    " data3 " + parseInt(message.substr(21, 2), 16)
        }
    }
    encodeACOF3 = function(nodeNumber, eventNumber, data1, data2, data3) {
        return this.header({MinPri: 3}) + 'F1' + decToHex(nodeNumber, 4) + decToHex(eventNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + decToHex(data3, 2) + ';';
    }


    // F2 ENRSP
    // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
    //
    decodeENRSP = function(message) {
        return {'encoded': message,
                'mnemonic': 'ENRSP',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16),
                'eventName': message.substr(13, 8),
                'eventIndex': parseInt(message.substr(21, 2), 16),
                'text': "ENRSP (F2) Node " + parseInt(message.substr(9, 4), 16) + 
					" EventName " + message.substr(13, 8) + 
					" Event Index " + parseInt(message.substr(21, 2), 16)
        }
    }
    encodeENRSP = function(nodeNumber, eventName, eventIndex) {
        return this.header({MinPri: 3}) + 'F2' + decToHex(nodeNumber, 4) + eventName + decToHex(eventIndex, 2) + ';';
    }


    // F8 ASON3
	// ASON3 Format: [<MjPri><MinPri=3><CANID>]<F8><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
    //
    decodeASON3 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASON3',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                data3: parseInt(message.substr(21, 2), 16),
                                hex:message.substr(17, 6)},
                'text': "ASON3 (F8) Node " + parseInt(message.substr(9, 4), 16) + 
					" deviceNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16) +
                    " data3 " + parseInt(message.substr(21, 2), 16)
        }
    }
    encodeASON3 = function(nodeNumber, deviceNumber, data1, data2, data3) {
        return this.header({MinPri: 3}) + 'F8' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + decToHex(data3, 2) + ';';
    }


    // F9 ASOF3
	// ASOF3 Format: [<MjPri><MinPri=3><CANID>]<F9><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
    //
    decodeASOF3 = function(message) {
		return {'encoded': message,
                'mnemonic': 'ASOF3',
                'opCode': message.substr(7, 2),
                'nodeNumber': parseInt(message.substr(9, 4), 16), 
                'deviceNumber': parseInt(message.substr(13, 4), 16),
                'eventData': {  data1: parseInt(message.substr(17, 2), 16), 
                                data2: parseInt(message.substr(19, 2), 16), 
                                data3: parseInt(message.substr(21, 2), 16),
                                hex:message.substr(17, 6)},
                'text': "ASOF3 (F9) Node " + parseInt(message.substr(9, 4), 16) + 
					" deviceNumber " + parseInt(message.substr(13, 4), 16) +
                    " data1 " + parseInt(message.substr(17, 2), 16) +
                    " data2 " + parseInt(message.substr(19, 2), 16) +
                    " data3 " + parseInt(message.substr(21, 2), 16)
        }
    }
    encodeASOF3 = function(nodeNumber, deviceNumber, data1, data2, data3) {
        return this.header({MinPri: 3}) + 'F9' + decToHex(nodeNumber, 4) + decToHex(deviceNumber, 4) +
            decToHex(data1, 2) + decToHex(data2, 2) + decToHex(data3, 2) + ';';
    }


}

module.exports = new cbusLibrary();




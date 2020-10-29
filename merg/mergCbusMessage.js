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
	
	translateMessage()
	{
		switch (this.opCode()) {
					case '00':
						// ACK Format: [<MjPri><MinPri=3><CANID>]<00>
						return "ACK";
						break;
					case '01':
						// NAK Format: [<MjPri><MinPri=3><CANID>]<01>
						return "NAK";
						break;
					case '02':
						// HLT Format: [<MjPri><MinPri=3><CANID>]<02>
						return "HLT";
						break;
					case '03':
						// BON Format: [<MjPri><MinPri=3><CANID>]<03>
						return "BON";
						break;
					case '04':
						// TOF Format: [<MjPri><MinPri=3><CANID>]<04>
						return "TOF";
						break;
					case '05':
						// TON Format: [<MjPri><MinPri=3><CANID>]<05>
						return "TON";
						break;
					case '06':
						// ESTOP Format: [<MjPri><MinPri=3><CANID>]<06>
						return "ESTOP";
						break;
					case '07':
						// ARST Format: [<MjPri><MinPri=3><CANID>]<07>
						return "ARST";
						break;
					case '08':
						// RTOF Format: [<MjPri><MinPri=3><CANID>]<08>
						return "RTOF";
						break;
					case '09':
						// RTON Format: [<MjPri><MinPri=3><CANID>]<09>
						return "RTON";
						break;
					case '0A':
						// RESTP Format: [<MjPri><MinPri=3><CANID>]<0A>
						return "RESTP";
						break;
					case '0C':
						// RSTAT Format: [<MjPri><MinPri=3><CANID>]<0C>
						return "RSTAT";
						break;
					case '0D':
						// QNN Format: [<MjPri><MinPri=3><CANID>]<0D>
						return "QNN";
						break;
					case '10':
						// RQNP Format: [<MjPri><MinPri=3><CANID>]<10>
						return "RQNP";
						break;
					case '11':
						// RQMN Format: [<MjPri><MinPri=3><CANID>]<11>
						return "RQMN";
						break;
					case '21':
						// KLOC Format: [<MjPri><MinPri=2><CANID>]<21><Session>
						return "KLOC Session " + parseInt(this.message.substr(9, 2), 16);
						break;
					case '22':
						// QLOC Format: [<MjPri><MinPri=2><CANID>]<22><Session>
						return "QLOC Session " + parseInt(this.message.substr(9, 2), 16);
						break;
					case '23':
						// DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
						return "DKEEP Session " + parseInt(this.message.substr(9, 2), 16);
						break;
					case '30':
						// DBG1 Format: [<MjPri><MinPri=2><CANID>]<30><Status>
						return "DBG1 Status " + parseInt(this.message.substr(9, 2), 16);
						break;
					case '3F':
						// EXTC Format: [<MjPri><MinPri=2><CANID>]<3F><Ext_OPC>
						return "EXTC Ext_OPC " + parseInt(this.message.substr(9, 2), 16);
						break;
					case '40':
						// RLOC Format: [<MjPri><MinPri=2><CANID>]<40><Dat1><Dat2 >
						return "RLOC Decoder " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '41':
						// QCON Format: [<MjPri><MinPri=2><CANID>]<41><ConID><Index>
						return "QCON ConId " + parseInt(this.message.substr(9, 2), 16) +
								" Index " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '42':
						// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
						return "SNN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '43':
						// ALOC Format: [<MjPri><MinPri=2><CANID>]<43><Session ID><Allocation code >
						return "ALOC Session " + parseInt(this.message.substr(9, 2), 16) +
								" Allocation code " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '44':
						// STMOD Format: [<MjPri><MinPri=2><CANID>]<44><Session><MMMMMMMM>
						return "STMOD Session " + parseInt(this.message.substr(9, 2), 16) +
								" Mode bits " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '45':
						// PCON Format: [<MjPri><MinPri=2><CANID>]<45><Session><Consist#>
						return "PCON Session " + parseInt(this.message.substr(9, 2), 16) +
								" Consist Address " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '46':
						// KCON) Format: [<MjPri><MinPri=2><CANID>]<46><Session><Consist#>
						return "KCON Session " + parseInt(this.message.substr(9, 2), 16) +
								" Consist Address " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '47':
						// DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
						return "DSPD Session " + parseInt(this.message.substr(9, 2), 16) +
								" Speed/Dir " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '48':
						// DFLG Format: [<MjPri><MinPri=2><CANID>]<48><Session><DDDDDDDD>
						return "DFLG Session " + parseInt(this.message.substr(9, 2), 16) +
								" Flags " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '49':
						// DFNON Format: [<MjPri><MinPri=2><CANID>]<49><Session><Fnum>
						return "DFNON Session " + parseInt(this.message.substr(9, 2), 16) +
								" Function number " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '4A':
						// DFNOF Format: [<MjPri><MinPri=2><CANID>]<4A><Session><Fnum>
						return "DFNOF Session " + parseInt(this.message.substr(9, 2), 16) +
								" Function number " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '4C':
						// SSTAT Format: [<MjPri><MinPri=3><CANID>]<4C><Session><Status>
						return "SSTAT Session " + parseInt(this.message.substr(9, 2), 16) +
								" Status " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '50':
						// RQNN Format: [<MjPri><MinPri=3><CANID>]<50><NN hi><NN lo>
						return "RQNN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '51':
						// NNREL Format: [<MjPri><MinPri=3><CANID>]<51><NN hi><NN lo>
						return "NNREL Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '52':
						// NNACK Format: [<MjPri><MinPri=3><CANID>]<52><NN hi><NN lo>
						return "NNACK Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '53':
						// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
						return "NNLRN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '54':
						// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
						return "NNULN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '55':
						// NNCLR Format: [<MjPri><MinPri=3><CANID>]<55><NN hi><NN lo>>
						return "NNCLR Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '56':
						// NNEVN Format: [<MjPri><MinPri=3><CANID>]<56><NN hi><NN lo>>
						return "NNEVN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '57':
						// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
						return "NERD Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '58':
						// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						return "RQEVN Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '59':
						// WRACK Format: [<MjPri><MinPri=3><CANID>]<59><NN hi><NN lo>
						return "WRACK Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '5A':
						// RQDAT Format: [<MjPri><MinPri=3><CANID>]<5A><NN hi><NN lo>
						return "RQDAT Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '5B':
						// RQDDS Format: [<MjPri><MinPri=3><CANID>]<5B><DN hi><DN lo>
						return "RQDDS Device " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '5C':
						// BOOTM Format: [<MjPri><MinPri=3><CANID>]<5C><NN hi><NN lo>
						return "BOOTM Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '5D':
						// ENUM Format: [<MjPri><MinPri=3><CANID>]<5D><NN hi><NN lo>
						return "ENUM Node " + parseInt(this.message.substr(9, 4), 16);
						break;
					case '5F':
						// EXTC1 Format: [[<MjPri><MinPri=3><CANID>]<5F><Ext_OPC><byte>
						return "EXTC1 Ext_OPC " + parseInt(this.message.substr(9, 2), 16) +
								" Data " + parseInt(this.message.substr(11, 2), 16);
						break;
					case '60':
						// DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
						return "DFUN Session " + parseInt(this.message.substr(9, 2), 16) +
								" Fn1 " + parseInt(this.message.substr(11, 2), 16) +
								" Fn2 " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '61':
						// GLOC Format: [<MjPri><MinPri=2><CANID>]<61><Dat1><Dat2><Flags>
						return "GLOC Decoder " + parseInt(this.message.substr(9, 4), 16) +
								" Flags " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '63':
						// ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
						return "ERR Data1 " + parseInt(this.message.substr(9, 2), 16) +
								" Data2 " + parseInt(this.message.substr(11, 2), 16) +
								" Data3 " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '6F':
						// CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
						return "CMDERR Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Error " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '70':
						// EVNLF Format: [<MjPri><MinPri=3><CANID>]<70><NN hi><NN lo><EVSPC>
						return "EVNLF Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Available Event space " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '71':
						// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
						return "NVRD Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Node Variable Index " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '72':
						// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
						return "NENRD Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event Index " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '73':
						// RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						return "NVRD Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Node Parameter Index " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '74':
						// NUMEV Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
						return "NUMEV Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Number of Events " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '75':
						// CANID Format: [<MjPri><MinPri=3><CANID>]<75><NN hi><NN lo><CAN_ID >
						return "CANID Node " + parseInt(this.message.substr(9, 4), 16) + 
								" CAN_ID " + parseInt(this.message.substr(13, 2), 16);
						break;
					case '7F':
						// EXTC2 Format: [<MjPri><MinPri=3><CANID>]<7F><Ext_OPC><byte1><byte2>
						return "EXTC2 Ext_OPC " + parseInt(this.message.substr(9, 2), 16) + 
								" Byte1 " + parseInt(this.message.substr(11, 2), 16) +
								" Byte2 " + parseInt(this.message.substr(13, 2), 16);
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
					case '97':
						// NVANS Format: [[<MjPri><MinPri=3><CANID>]<97><NN hi><NN lo><NV# ><NV val>
						return "NVANS NodeId " + parseInt(this.message.substr(9, 4), 16) + 
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
					case '9B':
						// PARAN Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
						return "PARAN Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Parameter Index " + parseInt(this.message.substr(13, 2), 16) + 
								" Parameter Value " + parseInt(this.message.substr(15, 2), 16);
						break;
					case '9C':
						// RETVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
						return "RETVAL Node " + parseInt(this.message.substr(9, 4), 16) + 
								" Event Index " + parseInt(this.message.substr(13, 2), 16) + 
								" Event Value Index " + parseInt(this.message.substr(15, 2), 16);
						break;
					case 'B5':
						// NEVAL Format: [<MjPri><MinPri=3><CANID>]<B5><NN hi><NN lo><EN#><EV#><EVval>
						return "NEVAL NodeId " + parseInt(this.message.substr(9, 4), 16) + 
								" Event Index " + parseInt(this.message.substr(13, 2), 16) + 
								" Event Value Index " + parseInt(this.message.substr(15, 2), 16) + 
								" Value " + parseInt(this.message.substr(17, 2), 16);
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
					case 'F2':
						// ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
						return "ENRSP Node " + parseInt(this.message.substr(9, 4), 16) + 
								" EN3 " + parseInt(this.message.substr(13, 2), 16) + 
								" EN2 " + parseInt(this.message.substr(15, 2), 16) + 
								" EN1 " + parseInt(this.message.substr(17, 2), 16) + 
								" EN0 " + parseInt(this.message.substr(19, 2), 16) + 
								" Event Index " + parseInt(this.message.substr(21, 2), 16);
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
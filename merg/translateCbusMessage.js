	'use strict';
	
	//
	//		translateCbusMessage()
	//
	//		expects the message in the 'Grid connect' CAN over serial message syntax
	//     : <S | X> <IDENTIFIER> <N> <DATA-0> <DATA-1> … <DATA-7> ;
	//
	exports.translateCbusMessage = function(message)
	{
		var opCode = message.substr(7, 2);
		switch (opCode) {
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
				// 0B reserved
					case '0C':
						// RSTAT Format: [<MjPri><MinPri=3><CANID>]<0C>
						return "RSTAT";
						break;
					case '0D':
						// QNN Format: [<MjPri><MinPri=3><CANID>]<0D>
						return "QNN";
						break;
				// 0E - 0F reserved
					case '10':
						// RQNP Format: [<MjPri><MinPri=3><CANID>]<10>
						return "RQNP";
						break;
					case '11':
						// RQMN Format: [<MjPri><MinPri=3><CANID>]<11>
						return "RQMN";
						break;
				// 12 - 20 reserved
					case '21':
						// KLOC Format: [<MjPri><MinPri=2><CANID>]<21><Session>
						return "KLOC Session " + parseInt(message.substr(9, 2), 16);
						break;
					case '22':
						// QLOC Format: [<MjPri><MinPri=2><CANID>]<22><Session>
						return "QLOC Session " + parseInt(message.substr(9, 2), 16);
						break;
					case '23':
						// DKEEP Format: [<MjPri><MinPri=2><CANID>]<23><Session>
						return "DKEEP Session " + parseInt(message.substr(9, 2), 16);
						break;
				// 24- 2F reserved
					case '30':
						// DBG1 Format: [<MjPri><MinPri=2><CANID>]<30><Status>
						return "DBG1 Status " + parseInt(message.substr(9, 2), 16);
						break;
				// 31 - 3E reserved
					case '3F':
						// EXTC Format: [<MjPri><MinPri=2><CANID>]<3F><Ext_OPC>
						return "EXTC Ext_OPC " + parseInt(message.substr(9, 2), 16);
						break;
					case '40':
						// RLOC Format: [<MjPri><MinPri=2><CANID>]<40><Dat1><Dat2 >
						return "RLOC Decoder " + parseInt(message.substr(9, 4), 16);
						break;
					case '41':
						// QCON Format: [<MjPri><MinPri=2><CANID>]<41><ConID><Index>
						return "QCON ConId " + parseInt(message.substr(9, 2), 16) +
								" Index " + parseInt(message.substr(11, 2), 16);
						break;
					case '42':
						// SNN Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
						return "SNN Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '43':
						// ALOC Format: [<MjPri><MinPri=2><CANID>]<43><Session ID><Allocation code >
						return "ALOC Session " + parseInt(message.substr(9, 2), 16) +
								" Allocation code " + parseInt(message.substr(11, 2), 16);
						break;
					case '44':
						// STMOD Format: [<MjPri><MinPri=2><CANID>]<44><Session><MMMMMMMM>
						return "STMOD Session " + parseInt(message.substr(9, 2), 16) +
								" Mode bits " + parseInt(message.substr(11, 2), 16);
						break;
					case '45':
						// PCON Format: [<MjPri><MinPri=2><CANID>]<45><Session><Consist#>
						return "PCON Session " + parseInt(message.substr(9, 2), 16) +
								" Consist Address " + parseInt(message.substr(11, 2), 16);
						break;
					case '46':
						// KCON) Format: [<MjPri><MinPri=2><CANID>]<46><Session><Consist#>
						return "KCON Session " + parseInt(message.substr(9, 2), 16) +
								" Consist Address " + parseInt(message.substr(11, 2), 16);
						break;
					case '47':
						// DSPD Format: [<MjPri><MinPri=2><CANID>]<47><Session><Speed/Dir>
						return "DSPD Session " + parseInt(message.substr(9, 2), 16) +
								" Speed/Dir " + parseInt(message.substr(11, 2), 16);
						break;
					case '48':
						// DFLG Format: [<MjPri><MinPri=2><CANID>]<48><Session><DDDDDDDD>
						return "DFLG Session " + parseInt(message.substr(9, 2), 16) +
								" Flags " + parseInt(message.substr(11, 2), 16);
						break;
					case '49':
						// DFNON Format: [<MjPri><MinPri=2><CANID>]<49><Session><Fnum>
						return "DFNON Session " + parseInt(message.substr(9, 2), 16) +
								" Function number " + parseInt(message.substr(11, 2), 16);
						break;
					case '4A':
						// DFNOF Format: [<MjPri><MinPri=2><CANID>]<4A><Session><Fnum>
						return "DFNOF Session " + parseInt(message.substr(9, 2), 16) +
								" Function number " + parseInt(message.substr(11, 2), 16);
						break;
				// 4B reserved
					case '4C':
						// SSTAT Format: [<MjPri><MinPri=3><CANID>]<4C><Session><Status>
						return "SSTAT Session " + parseInt(message.substr(9, 2), 16) +
								" Status " + parseInt(message.substr(11, 2), 16);
						break;
				// 4D - 4F reserved
					case '50':
						// RQNN Format: [<MjPri><MinPri=3><CANID>]<50><NN hi><NN lo>
						return "RQNN Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '51':
						// NNREL Format: [<MjPri><MinPri=3><CANID>]<51><NN hi><NN lo>
						return "NNREL Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '52':
						// NNACK Format: [<MjPri><MinPri=3><CANID>]<52><NN hi><NN lo>
						return "NNACK Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '53':
						// NNLRN Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
						return "NNLRN Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '54':
						// NNULN Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
						return "NNULN Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '55':
						// NNCLR Format: [<MjPri><MinPri=3><CANID>]<55><NN hi><NN lo>>
						return "NNCLR Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '56':
						// NNEVN Format: [<MjPri><MinPri=3><CANID>]<56><NN hi><NN lo>>
						return "NNEVN Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '57':
						// NERD Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
						return "NERD Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '58':
						// RQEVN Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						return "RQEVN Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '59':
						// WRACK Format: [<MjPri><MinPri=3><CANID>]<59><NN hi><NN lo>
						return "WRACK Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '5A':
						// RQDAT Format: [<MjPri><MinPri=3><CANID>]<5A><NN hi><NN lo>
						return "RQDAT Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '5B':
						// RQDDS Format: [<MjPri><MinPri=3><CANID>]<5B><DN hi><DN lo>
						return "RQDDS Device " + parseInt(message.substr(9, 4), 16);
						break;
					case '5C':
						// BOOTM Format: [<MjPri><MinPri=3><CANID>]<5C><NN hi><NN lo>
						return "BOOTM Node " + parseInt(message.substr(9, 4), 16);
						break;
					case '5D':
						// ENUM Format: [<MjPri><MinPri=3><CANID>]<5D><NN hi><NN lo>
						return "ENUM Node " + parseInt(message.substr(9, 4), 16);
						break;
				// 5E reserved
					case '5F':
						// EXTC1 Format: [[<MjPri><MinPri=3><CANID>]<5F><Ext_OPC><byte>
						return "EXTC1 Ext_OPC " + parseInt(message.substr(9, 2), 16) +
								" Data " + parseInt(message.substr(11, 2), 16);
						break;
					case '60':
						// DFUN Format: <MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
						return "DFUN Session " + parseInt(message.substr(9, 2), 16) +
								" Fn1 " + parseInt(message.substr(11, 2), 16) +
								" Fn2 " + parseInt(message.substr(13, 2), 16);
						break;
					case '61':
						// GLOC Format: [<MjPri><MinPri=2><CANID>]<61><Dat1><Dat2><Flags>
						return "GLOC Decoder " + parseInt(message.substr(9, 4), 16) +
								" Flags " + parseInt(message.substr(13, 2), 16);
						break;
					case '63':
						// ERR Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
						return "ERR Data1 " + parseInt(message.substr(9, 2), 16) +
								" Data2 " + parseInt(message.substr(11, 2), 16) +
								" Data3 " + parseInt(message.substr(13, 2), 16);
						break;
				// 64 - 6E reserved
					case '6F':
						// CMDERR Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
						return "CMDERR Node " + parseInt(message.substr(9, 4), 16) + 
								" Error " + parseInt(message.substr(13, 2), 16);
						break;
					case '70':
						// EVNLF Format: [<MjPri><MinPri=3><CANID>]<70><NN hi><NN lo><EVSPC>
						return "EVNLF Node " + parseInt(message.substr(9, 4), 16) + 
								" Available Event space " + parseInt(message.substr(13, 2), 16);
						break;
					case '71':
						// NVRD Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
						return "NVRD Node " + parseInt(message.substr(9, 4), 16) + 
								" Node Variable Index " + parseInt(message.substr(13, 2), 16);
						break;
					case '72':
						// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
						return "NENRD Node " + parseInt(message.substr(9, 4), 16) + 
								" Event Index " + parseInt(message.substr(13, 2), 16);
						break;
					case '73':
						// RQNPN Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						return "RQNPN Node " + parseInt(message.substr(9, 4), 16) + 
								" Node Parameter Index " + parseInt(message.substr(13, 2), 16);
						break;
					case '74':
						// NUMEV Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
						return "NUMEV Node " + parseInt(message.substr(9, 4), 16) + 
								" Number of Events " + parseInt(message.substr(13, 2), 16);
						break;
					case '75':
						// CANID Format: [<MjPri><MinPri=3><CANID>]<75><NN hi><NN lo><CAN_ID >
						return "CANID Node " + parseInt(message.substr(9, 4), 16) + 
								" CAN_ID " + parseInt(message.substr(13, 2), 16);
						break;
				// 76 - 7E reserved
					case '7F':
						// EXTC2 Format: [<MjPri><MinPri=3><CANID>]<7F><Ext_OPC><byte1><byte2>
						return "EXTC2 Ext_OPC " + parseInt(message.substr(9, 2), 16) + 
								" Byte1 " + parseInt(message.substr(11, 2), 16) +
								" Byte2 " + parseInt(message.substr(13, 2), 16);
						break;
					case '80':
						// RDCC3 Format: [[<MjPri><MinPri=2><CANID>]<80><REP><Byte0>..<Byte2>
						return "RDCC3 Repetitions " + parseInt(message.substr(9, 2), 16) + 
								" Byte0 " + parseInt(message.substr(11, 2), 16) +
								" Byte1 " + parseInt(message.substr(13, 2), 16) +
								" Byte2 " + parseInt(message.substr(15, 2), 16);
						break;
				// 81 reserved
					case '82':
						// WCVO Format: [<MjPri><MinPri=2><CANID>]<82><Session><High CV#><Low CV#><Val>
						return "WCVO Session " + parseInt(message.substr(9, 2), 16) + 
								" CV " + parseInt(message.substr(11, 4), 16) +
								" Value " + parseInt(message.substr(15, 2), 16);
						break;
					case '83':
						// WCVB Format: [<MjPri><MinPri=2><CANID>]<83><Session><High CV#><Low CV#><Val>
						return "WCVB Session " + parseInt(message.substr(9, 2), 16) + 
								" CV " + parseInt(message.substr(11, 4), 16) +
								" Value " + parseInt(message.substr(15, 2), 16);
						break;
					case '84':
						// QCVS Format: [<MjPri><MinPri=2><CANID>]<84><Session><High CV#><Low CV#><Mode>
						return "QCVS Session " + parseInt(message.substr(9, 2), 16) + 
								" CV " + parseInt(message.substr(11, 4), 16) +
								" Mode " + parseInt(message.substr(15, 2), 16);
						break;
					case '85':
						// PCVS Format: [<MjPri><MinPri=2><CANID>]<85><Session><High CV#><Low CV#><Val>
						return "PCVS Session " + parseInt(message.substr(9, 2), 16) + 
								" CV " + parseInt(message.substr(11, 4), 16) +
								" Value " + parseInt(message.substr(15, 2), 16);
						break;
				// 86 - 8F reserved
					case '90':
						// ACON Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
						return "ACON Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16);
						break;
					case '91':
						// ACOF Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
						return "ACOF Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16);
						break;
					case '92':
						// AREQ Format: [<MjPri><MinPri=3><CANID>]<92><NN hi><NN lo><EN hi><EN lo>
						return "AREQ Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16);
						break;
					case '93':
						// ARON Format: [<MjPri><MinPri=3><CANID>]<93><NN hi><NN lo><EN hi><EN lo>
						return "ARON Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16);
						break;
					case '94':
						// AROF Format: [<MjPri><MinPri=3><CANID>]<94><NN hi><NN lo><EN hi><EN lo>
						return "AROF Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16);
						break;
					case '95':
						// EVULN Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
						return "EVULN Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16);
						break;
					case '96':
						// NVSET Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
						return "NVSET Node " + parseInt(message.substr(9, 4), 16) + 
								" Node Variable Index " + parseInt(message.substr(13, 2), 16) +
								" Value " + parseInt(message.substr(15, 2), 16);
						break;
					case '97':
						// NVANS Format: [[<MjPri><MinPri=3><CANID>]<97><NN hi><NN lo><NV# ><NV val>
						return "NVANS NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Node Variable Index " + parseInt(message.substr(13, 2), 16) +
								" Value " + parseInt(message.substr(15, 2), 16);
						break;
					case '98':
						// ASON Format: <MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
						return "ASON Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16);
						break;
					case '99':
						// ASOF Format: <MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
						return "ASOF Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16);
						break;
					case '9A':
						// ASRQ Format: <MjPri><MinPri=3><CANID>]<9A><NN hi><NN lo><DN hi><DN lo>
						return "ASRQ Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16);
						break;
					case '9B':
						// PARAN Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
						return "PARAN Node " + parseInt(message.substr(9, 4), 16) + 
								" Parameter Index " + parseInt(message.substr(13, 2), 16) + 
								" Parameter Value " + parseInt(message.substr(15, 2), 16);
						break;
					case '9C':
						// REVAL Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
						return "REVAL Node " + parseInt(message.substr(9, 4), 16) + 
								" Event Index " + parseInt(message.substr(13, 2), 16) + 
								" Event Value Index " + parseInt(message.substr(15, 2), 16);
						break;
					case '9D':
						// ARSON Format: <MjPri><MinPri=3><CANID>]<9D><NN hi><NN lo><DN hi><DN lo>
						return "ARSON Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16);
						break;
					case '9E':
						// ARSOF Format: <MjPri><MinPri=3><CANID>]<9E><NN hi><NN lo><DN hi><DN lo>
						return "ARSOF Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16);
						break;
					case '9F':
						// EXTC3 Format: [<MjPri><MinPri=3><CANID>]<9F><Ext_OPC><byte1><byte2><byte3>
						return "EXTC3 Ext_OPC " + parseInt(message.substr(9, 2), 16) + 
								" Byte1 " + parseInt(message.substr(11, 2), 16) +
								" Byte2 " + parseInt(message.substr(13, 2), 16) +
								" Byte3 " + parseInt(message.substr(15, 2), 16);
						break;
					case 'A0':
						// RDCC4 Format: [[<MjPri><MinPri=2><CANID>]<A0><REP><Byte0>..<Byte3>
						return "RDCC4 Repetitions " + parseInt(message.substr(9, 2), 16) + 
								" Byte0 " + parseInt(message.substr(11, 2), 16) +
								" Byte1 " + parseInt(message.substr(13, 2), 16) +
								" Byte2 " + parseInt(message.substr(15, 2), 16) +
								" Byte3 " + parseInt(message.substr(17, 2), 16);
						break;
				// A1 reserved
					case 'A2':
						// WCVS Format: [<MjPri><MinPri=2><CANID>]<A2><Session><High CV#><LowCV#><Mode><CVval>
						return "WCVS Session " + parseInt(message.substr(9, 2), 16) + 
								" CV " + parseInt(message.substr(11, 4), 16) +
								" Mode " + parseInt(message.substr(15, 2), 16) +
								" Value " + parseInt(message.substr(17, 2), 16);
						break;
				// A2 - AF reserved
					case 'B0':
						// ACON1 Format: [<MjPri><MinPri=3><CANID>]<B0><NN hi><NN lo><EN hi><EN lo><data>
						return "ACON1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B1':
						// REQEV Format: [<MjPri><MinPri=3><CANID>]<B1><NN hi><NN lo><EN hi><EN lo><data>
						return "REQEV NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B2':
						// ACOF1 Format: [<MjPri><MinPri=3><CANID>]<B2><NN hi><NN lo><EN hi><EN lo><EV# >
						return "ACOF1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Event Index " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B3':
						// ARON1 Format: [<MjPri><MinPri=3><CANID>]<B3><NN hi><NN lo><EN hi><EN lo><data>
						return "ARON1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B4':
						// AROF1 Format: [<MjPri><MinPri=3><CANID>]<B4><NN hi><NN lo><EN hi><EN lo><data>
						return "AROF1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B5':
						// NEVAL Format: [<MjPri><MinPri=3><CANID>]<B5><NN hi><NN lo><EN#><EV#><EVval>
						return "NEVAL NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event Index " + parseInt(message.substr(13, 2), 16) + 
								" Event Value Index " + parseInt(message.substr(15, 2), 16) + 
								" Value " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B6':
						// PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
						return "PNN NodeId " + parseInt(message.substr(9, 4), 16) + 
								" ManufId " + parseInt(message.substr(13, 2), 16) + 
								" ModuleId " + parseInt(message.substr(15, 2), 16) + 
								" flags " + parseInt(message.substr(17, 2), 16);
						break;
				// B7 reserved
					case 'B8':
						// ASON1 Format: [<MjPri><MinPri=3><CANID>]<B8><NN hi><NN lo><DN hi><DN lo><data 1>
						return "ASON1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'B9':
						// ASOF1 Format: [<MjPri><MinPri=3><CANID>]<B9><NN hi><NN lo><DN hi><DN lo><data 1>
						return "ASOF1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
				// BA - BC reserved
					case 'BD':
						// ARSON1 Format: [<MjPri><MinPri=3><CANID>]<BD><NN hi><NN lo><DN hi><DN lo><data 1>
						return "ARSON1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'BE':
						// ARSOF1 Format: [<MjPri><MinPri=3><CANID>]<BE><NN hi><NN lo><DN hi><DN lo><data 1>
						return "ARSOF1 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) + 
								" Data " + parseInt(message.substr(17, 2), 16);
						break;
					case 'BF':
						// EXTC4 Format: [<MjPri><MinPri=3><CANID>]<BF><Ext-OPC><byte1><byte2><byte3><byte4>
						return "EXTC4 Ext_OPC " + parseInt(message.substr(9, 2), 16) + 
								" Byte1 " + parseInt(message.substr(11, 2), 16) +
								" Byte2 " + parseInt(message.substr(13, 2), 16) +
								" Byte3 " + parseInt(message.substr(15, 2), 16) +
								" Byte4 " + parseInt(message.substr(17, 2), 16);
						break;
					case 'C0':
						// RDCC5 Format: [[<MjPri><MinPri=2><CANID>]<C0><REP><Byte0>..<Byte4>
						return "RDCC5 Repetitions " + parseInt(message.substr(9, 2), 16) + 
								" Byte0 " + parseInt(message.substr(11, 2), 16) +
								" Byte1 " + parseInt(message.substr(13, 2), 16) +
								" Byte2 " + parseInt(message.substr(15, 2), 16) +
								" Byte3 " + parseInt(message.substr(17, 2), 16) +
								" Byte4 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'C1':
						// WCVOA Format: [<MjPri><MinPri=2><CANID>]<C1><AddrH><AddrL><High CV#><Low CV#><Mode><Val>
						return "WCVOA Address " + parseInt(message.substr(9, 4), 16) + 
								" CV " + parseInt(message.substr(13, 4), 16) +
								" Mode " + parseInt(message.substr(17, 2), 16) +
								" Value " + parseInt(message.substr(19, 2), 16);
						break;
				// C2 - CE reserved
					case 'CF':
						// FCLK Format: [<MjPri><MinPri=3><CANID>]<CF><mins><hrs><wdmon><div><mday><temp>
						return "FCLK Minutes " + parseInt(message.substr(9, 2), 16) + 
								" Hours " + parseInt(message.substr(11, 2), 16) +
								" WDMON " + parseInt(message.substr(13, 2), 16) +
								" DIV " + parseInt(message.substr(15, 2), 16) +
								" MDAY " + parseInt(message.substr(17, 2), 16) +
								" Temp " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D0':
						// ACON2 Format: [<MjPri><MinPri=3><CANID>]<D0><NN hi><NN lo><EN hi><EN lo><data1><data2>
						return "ACON2 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D1':
						// ACOF2 Format: [<MjPri><MinPri=3><CANID>]<D1><NN hi><NN lo><EN hi><EN lo><data1><data2>
						return "ACOF2 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D2':
						// EVLRN Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
						return "EVLRN Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) +
								" Event Value Index " + parseInt(message.substr(17, 2), 16) +
								" Event Value " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D3':
						// EVANS Format: [<MjPri><MinPri=3><CANID>]<D3><NN hi><NN lo><EN hi><EN lo><EV#><EV val>
						return "EVANS Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) +
								" Event Value Index " + parseInt(message.substr(17, 2), 16) +
								" Event Value " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D4':
						// ARON2 Format: [<MjPri><MinPri=3><CANID>]<D4><NN hi><NN lo><EN hi><EN lo><data1><data2>
						return "ARON2 Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) +
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D5':
						// AROF2 Format: [<MjPri><MinPri=3><CANID>]<D5><NN hi><NN lo><EN hi><EN lo><data1><data2>
						return "AROF2 Node " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) +
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
						break;
				// D6 - D7 reserved
					case 'D8':
						// ASON2 Format: [<MjPri><MinPri=3><CANID>]<D8><NN hi><NN lo><DN hi><DN lo><data1><data2>
						return "ASON2 Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) +
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'D9':
						// ASOF2 Format: [<MjPri><MinPri=3><CANID>]<D9><NN hi><NN lo><DN hi><DN lo><data1><data2>
						return "ASOF2 Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) +
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
				// DA - DC reserved
					case 'DD':
						// ARSON2 Format: [<MjPri><MinPri=3><CANID>]<DD><NN hi><NN lo><DN hi><DN lo><data1><data2>
						return "ASON2 Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) +
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'DE':
						// ARSOF2 Format: [<MjPri><MinPri=3><CANID>]<DE><NN hi><NN lo><DN hi><DN lo><data1><data2>
						return "ASOF2 Node " + parseInt(message.substr(9, 4), 16) + 
								" Device " + parseInt(message.substr(13, 4), 16) +
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16);
					case 'DF':
						// EXTC5 Format: [<MjPri><MinPri=3><CANID>]<DF><Ext-OPC><byte1><byte2><byte3><byte4><byte5>
						return "EXTC5 Ext_OPC " + parseInt(message.substr(9, 2), 16) + 
								" Byte1 " + parseInt(message.substr(11, 2), 16) +
								" Byte2 " + parseInt(message.substr(13, 2), 16) +
								" Byte3 " + parseInt(message.substr(15, 2), 16) +
								" Byte4 " + parseInt(message.substr(17, 2), 16) +
								" Byte5 " + parseInt(message.substr(19, 2), 16);
						break;
					case 'E0':
						// RDCC6 Format: [[<MjPri><MinPri=2><CANID>]<E0><REP><Byte0>..<Byte5>
						return "RDCC6 Repetitions " + parseInt(message.substr(9, 2), 16) + 
								" Byte0 " + parseInt(message.substr(11, 2), 16) +
								" Byte1 " + parseInt(message.substr(13, 2), 16) +
								" Byte2 " + parseInt(message.substr(15, 2), 16) +
								" Byte3 " + parseInt(message.substr(17, 2), 16) +
								" Byte4 " + parseInt(message.substr(19, 2), 16) +
								" Byte5 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'E1':
						// PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
						return "PLOC Session " + parseInt(message.substr(9, 2), 16) + 
								" Address " + parseInt(message.substr(11, 4), 16) +
								" Speed/Dir " + parseInt(message.substr(15, 2), 16) +
								" Fn1 " + parseInt(message.substr(17, 2), 16) +
								" Fn2 " + parseInt(message.substr(19, 2), 16) +
								" Fn3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'E2':
						// NAME Format: [[<MjPri><MinPri=3><CANID>]<E2><char1><char2><char3><char4><char5><char6><char7>
						return "NAME " + parseInt(message.substr(9, 14), 16);
						break;
					case 'E3':
						// STAT Format: [<MjPri><MinPri=2><CANID>]<E3><NN hi><NN lo><CS num><flags><Major rev><Minor rev><Build no.>
						return "STAT Node " + parseInt(message.substr(9, 4), 16) + 
								" CSnum " + parseInt(message.substr(13, 2), 16) +
								" Flags " + parseInt(message.substr(15, 2), 16) +
								" Major " + parseInt(message.substr(17, 2), 16) +
								" Minor " + parseInt(message.substr(19, 2), 16) +
								" Build " + parseInt(message.substr(21, 2), 16);
						break;
				// E4 - EE reserved
					case 'EF':
						// PARAMS Format: [<MjPri><MinPri=3><CANID>]<EF><PARA 1><PARA 2><PARA 3><PARA 4><PARA 5><PARA 6><PARA 7>
						return "PARAMS Param1 " + parseInt(message.substr(9, 2), 16) + 
								" Param2 " + parseInt(message.substr(11, 2), 16) +
								" Param3 " + parseInt(message.substr(13, 2), 16) +
								" Param4 " + parseInt(message.substr(15, 2), 16) +
								" Param5 " + parseInt(message.substr(17, 2), 16) +
								" Param6 " + parseInt(message.substr(19, 2), 16) +
								" Param7 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F0':
						// ACON3 Format: [<MjPri><MinPri=3><CANID>]<F0><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ACON3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F1':
						// ACOF3 Format: [<MjPri><MinPri=3><CANID>]<F1><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ACOF3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F2':
						// ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
						return "ENRSP Node " + parseInt(message.substr(9, 4), 16) + 
								" EN3 " + parseInt(message.substr(13, 2), 16) + 
								" EN2 " + parseInt(message.substr(15, 2), 16) + 
								" EN1 " + parseInt(message.substr(17, 2), 16) + 
								" EN0 " + parseInt(message.substr(19, 2), 16) + 
								" Event Index " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F3':
						// ARON3 Format: [<MjPri><MinPri=3><CANID>]<F3><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ARON3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F4':
						// AROF3 Format: [<MjPri><MinPri=3><CANID>]<F4><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "AROF3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F5':
						// EVLRNI Format: [<MjPri><MinPri=3><CANID>]<F5><NN hi><NN lo><EN hi><EN lo><EN#><EV#><EV val>
						return "EVLRNI NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Event Index " + parseInt(message.substr(17, 2), 16) +
								" Event Variable Index " + parseInt(message.substr(19, 2), 16) +
								" Value " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F6':
						// ACDAT Format: [<MjPri><MinPri=3><CANID>]<F6><NN hi><NNlo><data1><data2><data3><data4><data5>
						return "ACDAT NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Data1 " + parseInt(message.substr(13, 2), 16) +
								" Data2 " + parseInt(message.substr(15, 2), 16) +
								" Data3 " + parseInt(message.substr(17, 2), 16) +
								" Data4 " + parseInt(message.substr(19, 2), 16) +
								" Data5 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F7':
						// ARDAT Format: [<MjPri><MinPri=3><CANID>]<F7><NN hi><NNlo><data1><data2><data3><data4><data5>
						return "ARDAT NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Data1 " + parseInt(message.substr(13, 2), 16) +
								" Data2 " + parseInt(message.substr(15, 2), 16) +
								" Data3 " + parseInt(message.substr(17, 2), 16) +
								" Data4 " + parseInt(message.substr(19, 2), 16) +
								" Data5 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F8':
						// ASON3 Format: [<MjPri><MinPri=3><CANID>]<F8><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ASON3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'F9':
						// ASOF3 Format: [<MjPri><MinPri=3><CANID>]<F9><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ASOF3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'FA':
						// DDES Format: [<MjPri><MinPri=3><CANID>]<FA><DN hi><DN lo><data1><data2><data3><data4><data5>
						return "DDES Device " + parseInt(message.substr(9, 4), 16) + 
								" Data1 " + parseInt(message.substr(13, 2), 16) +
								" Data2 " + parseInt(message.substr(15, 2), 16) +
								" Data3 " + parseInt(message.substr(17, 2), 16) +
								" Data4 " + parseInt(message.substr(19, 2), 16) +
								" Data5 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'FB':
						// DDRS Format: [<MjPri><MinPri=3><CANID>]<FB><DN hi><DN lo><data1><data2><data3><data4><data5>
						return "DDRS Device " + parseInt(message.substr(9, 4), 16) + 
								" Data1 " + parseInt(message.substr(13, 2), 16) +
								" Data2 " + parseInt(message.substr(15, 2), 16) +
								" Data3 " + parseInt(message.substr(17, 2), 16) +
								" Data4 " + parseInt(message.substr(19, 2), 16) +
								" Data5 " + parseInt(message.substr(21, 2), 16);
						break;
				// FC reserved
					case 'FD':
						// ARSON3 Format: [<MjPri><MinPri=3><CANID>]<FD><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ARSON3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'FE':
						// ARSOF3 Format: [<MjPri><MinPri=3><CANID>]<FF><NN hi><NN lo><EN hi><EN lo><data1><data2><data3>
						return "ARSOF3 NodeId " + parseInt(message.substr(9, 4), 16) + 
								" Event " + parseInt(message.substr(13, 4), 16) + 
								" Data1 " + parseInt(message.substr(17, 2), 16) +
								" Data2 " + parseInt(message.substr(19, 2), 16) +
								" Data3 " + parseInt(message.substr(21, 2), 16);
						break;
					case 'FF':
						// EXTC6 Format: [<MjPri><MinPri=3><CANID>]<DF><Ext-OPC><byte1><byte2><byte3><byte4><byte5><byte6>
						return "EXTC6 Ext_OPC " + parseInt(message.substr(9, 2), 16) + 
								" Byte1 " + parseInt(message.substr(11, 2), 16) +
								" Byte2 " + parseInt(message.substr(13, 2), 16) +
								" Byte3 " + parseInt(message.substr(15, 2), 16) +
								" Byte4 " + parseInt(message.substr(17, 2), 16) +
								" Byte5 " + parseInt(message.substr(19, 2), 16) +
								" Byte6 " + parseInt(message.substr(21, 2), 16);
						break;
					default:
						return "No translation for Opcode";
						break;
					}
	}

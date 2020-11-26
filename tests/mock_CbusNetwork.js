'use strict';
var winston = require('winston');		// use config from root instance
const net = require('net');
const cbusMessage = require('./../merg/mergCbusMessage.js')

const cbusLib = require('./../merg/cbusLibrary.js')

//
//		Grid connect CAN over serial message syntax
//     : <S | X> <IDENTIFIER> <N> <DATA-0> <DATA-1> … <DATA-7> ;
//
//	

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


class mock_CbusNetwork {

    constructor(NET_PORT) {
		winston.info({message: 'Mock CBUS Network: Starting'});


		this.sendArray = [];
		this.socket;
		
		this.modules = 	[
						new CANACC8 (0),
						new CANSERVO8C (1),
						new CANMIO (65535)
						]

		this.server = net.createServer(function (socket) {
			this.socket=socket;
			socket.setKeepAlive(true,60000);
			socket.on('data', function (data) {
				winston.info({message: 'Mock CBUS Network: data received'});
				const msgArray = data.toString().split(";");
				for (var i = 0; i < msgArray.length - 1; i++) {
					msgArray[i] = msgArray[i].concat(";");				// add back the ';' terminator that was lost in the split
					this.sendArray.push(msgArray[i]);					// store the incoming messages so the test can inspect them
                    var cbusMsg = cbusLib.decode(msgArray[i]);
					let msg = new cbusMessage.cbusMessage(msgArray[i]);
					winston.info({message: 'Mock CBUS Network: [' + i + '] ' +  msgArray[i] + " " + cbusMsg.text});
					switch (msg.opCode()) {
					case '0D':
						// Format: <MjPri><MinPri=3><CANID>]<0D>
						winston.info({message: 'Mock CBUS Network: received QNN'});
						for (var i = 0; i < this.modules.length; i++) {
							this.outputPNN(this.modules[i].getNodeId());
						}
						break;
					case '22':  // QLOC
						break;
					case '42':
						// Format: [<MjPri><MinPri=3><CANID>]<42><NNHigh><NNLow>
						var nodeNumber = msg.nodeId();
						winston.info({message: 'Mock CBUS Network: received SNN : new Node Number ' + nodeNumber});
						// could renumber or create a new module, but not necessary at this time
						break;
					case '53':
						// Format: [<MjPri><MinPri=3><CANID>]<53><NN hi><NN lo>
						winston.info({message: 'Mock CBUS Network: received NNLRN'});
						break;
					case '54':
						// Format: [<MjPri><MinPri=3><CANID>]<54><NN hi><NN lo>>
						winston.info({message: 'Mock CBUS Network: received NNULN'});
						break;
					case '57':
						// Format: [<MjPri><MinPri=3><CANID>]<57><NN hi><NN lo>
						winston.info({message: 'Mock CBUS Network: received NERD'});
                		var nodeNumber = msg.nodeId()
                        if ( this.getModule(nodeNumber) != undefined) {
                            var events = this.getModule(nodeNumber).getStoredEvents();
                            //for (var i = 0; i < events.length; i++) {
                                //this.outputENRSP(nodeNumber, i);
                            //}
                        }

						break;
					case '58':
						// Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						winston.info({message: 'Mock CBUS Network: received RQEVN'});
                    	var storedEventsCount = this.getModule(nodeId).getStoredEventsCount();
						this.outputNUMEV(msg.nodeId(), storedEventsCount);
						break;
					case '71':
						// Format: [<MjPri><MinPri=3><CANID>]<71><NN hi><NN lo><NV#>
						winston.info({message: 'Mock CBUS Network: received NVRD'});
						break;
					case '73':
						// Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						winston.info({message: 'Mock CBUS Network: received RQNPN'});
                        var paramValue = this.getModule(msg.nodeId()).getParameter(msg.paramId());
						this.outputPARAN(msg.nodeId(), msg.paramId(), paramValue);
						break;
					case '90':
						// Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
						winston.info({message: 'Mock CBUS Network: received ACON'});
						break;
					case '91':
						// Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
						winston.info({message: 'Mock CBUS Network: received ACOF'});
						break;
					case '95':
						// Format: [<MjPri><MinPri=3><CANID>]<95><NN hi><NN lo><EN hi><EN lo>
						winston.info({message: 'Mock CBUS Network: received EVULN'});
						break;
					case '96':
						// Format: [<MjPri><MinPri=3><CANID>]<96><NN hi><NN lo><NV# ><NV val>
						winston.info({message: 'Mock CBUS Network: received NVSET'});
						break;
					case '9C':
						// Format: [<MjPri><MinPri=3><CANID>]<9C><NN hi><NN lo><EN#><EV#>
						winston.info({message: 'Mock CBUS Network: received REVAL'});
						break;
					case 'D2':
						// Format: [<MjPri><MinPri=3><CANID>]<D2><NN hi><NN lo><EN hi><EN lo>
						winston.info({message: 'Mock CBUS Network: received EVLRN'});
						break;
					default:
						winston.info({message: 'Mock CBUS Network: ********************** received unknown opcode ' + msg.opCode()});
						break;
					}
				}
			}.bind(this));

			socket.on('end', function () {
				winston.info({message: 'Mock CBUS Network: Client Disconnected'});
			}.bind(this));
			
			socket.on('error', function(err) {
				winston.info({message: 'Mock CBUS Network: Socket error ' + err});
			}.bind(this));
			
		}.bind(this));

		this.server.listen(NET_PORT);
		
		// emitted when new client connects
		this.server.on('connection',function(socket){
			var rport = socket.remotePort;
			winston.info({message: 'Mock CBUS Network: remote client at port : ' + rport});
		});
	}


	getSendArray() {
		return this.sendArray;
	}

	
	clearSendArray() {
		this.sendArray = [];
	}


	stopServer() {
		this.server.close();
		this.socket.end();
		winston.info({message: 'Mock CBUS Network: Server closed'});
	}


	getModule(nodeId) {
		for (var i = 0; i < this.modules.length; i++) {
			if (this.modules[i].getNodeId() == nodeId) return this.modules[i];
		}
	}


	// 00 ACK
	outputACK() {
		var msgData = cbusLib.encodeACK();
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 21 KLOC
	outputKLOC(session) {
		// Format: [<MjPri><MinPri=2><CANID>]<21><Session>
		var msgData = ':S' + 'B780' + 'N' + '21' + decToHex(session, 2) + ';';
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output KLOC : session [' + session + '] ' + msgData});
	}


	// 23 DKEEP
	outputDKEEP(session) {
		var msgData = cbusLib.encodeDKEEP(session);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 47 DSPD
	outputDSPD(session, speed, direction) {
		var msgData = cbusLib.encodeDSPD(session, speed, direction);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 50
	outputRQNN(nodeId) {
		//Format: [<MjPri><MinPri=3><CANID>]<50><NN hi><NN lo>
		var msgData = cbusLib.encodeRQNN(nodeNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}
	

	// 57
	outputNERD(nodeNumber) {
		//Format: [<MjPri><MinPri=3><CANID>]<57>NN hi><NN lo>
		var msgData = cbusLib.encodeNERD(nodeNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}
	

	// 60
	outputDFUN(session, fn1, fn2) {
		// Format: [<MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
		var msgData = ':S' + 'B780' + 'N' + '60' + decToHex(session, 2) + decToHex(fn1, 2) + decToHex(fn2, 2) + ';';
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output DFUN : session [' + session + '] ' + msgData});
	}


	// 63
	outputERR(data1, data2, errorNumber) {
		// Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
		var msgData = cbusLib.encodeERR(data1, data2, errorNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 6F
	outputCMDERR(nodeNumber, errorNumber) {
		// Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
		var msgData = cbusLib.encodeCMDERR(nodeNumber, errorNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 74
	outputNUMEV(nodeNumber, eventCount) {
		// Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
		var msgData = cbusLib.encodeNUMEV(nodeNumber, eventCount);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}

	// 90
	outputACON(nodeNumber, eventNumber) {
		// Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
		var msgData = cbusLib.encodeACON(nodeNumber, eventNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 91
	outputACOF(nodeNumber, eventNumber) {
		// Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
		var msgData = cbusLib.encodeACOF(nodeNumber, eventNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 97
	outputNVANS(nodeNumber, nodeVariableIndex, nodeVariableValue) {
		// Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
		var msgData = cbusLib.encodeNVANS(nodeNumber, nodeVariableIndex, nodeVariableValue);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 98
	outputASON(nodeNumber, deviceNumber) {
		// Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><EN hi><EN lo>
		var msgData = cbusLib.encodeASON(nodeNumber, deviceNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 99
	outputASOF(nodeNumber, deviceNumber) {
		// Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><EN hi><EN lo>
		var msgData = cbusLib.encodeASOF(nodeNumber, deviceNumber);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}


	// 9B
	outputPARAN(nodeNumber, parameterIndex, parameterValue) {
		// Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
		var msgData = cbusLib.encodePARAN(nodeNumber, parameterIndex, parameterValue);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}

	
	// B5
	outputNEVAL(nodeNumber, eventIndex, eventVariableIndex, eventVariableValue) {
		var msgData = cbusLib.encodeNEVAL(nodeNumber, eventIndex, eventVariableIndex, eventVariableValue);
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output ' + cbusLib.decode(msgData).text});
	}

	
	// B6
	outputPNN(nodeId) {
		// Format: <0xB6><<NN Hi><NN Lo><Manuf Id><Module Id><Flags>
		var nodeData = this.getModule(nodeId).getNodeIdHex()
			+ this.getModule(nodeId).getManufacturerIdHex() 
			+ this.getModule(nodeId).getModuleIdHex() 
			+ this.getModule(nodeId).getFlagsHex();
		var msgData = ':S' + 'B780' + 'N' + 'B6' + nodeData + ';'
		winston.info({message: 'Mock CBUS Network: Output PNN : nodeId [' + nodeId + '] ' + msgData});
		this.socket.write(msgData);
	}


	//F2
	outputENRSP(nodeNumber, eventIndex) {
		// ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
		var events = this.getModule(nodeNumber).getStoredEvents();
        var eventName = decToHex(events[eventIndex].eventName, 8)
        var msgData = cbusLib.encodeENRSP(nodeNumber, eventName, eventIndex)
        this.socket.write(msgData);
        winston.info({message: 'CBUS Network Sim:  OUT>>  ' + msgData + " " + cbusLib.decode(msgData).text});
	}


	// FC
	outputUNSUPOPCODE(nodeId) {
		// Ficticious opcode - 'FC' currently unused
		// Format: [<MjPri><MinPri=3><CANID>]<FC><NN hi><NN lo>
		var msgData = ':S' + 'B780' + 'N' + 'FC' + decToHex(nodeId, 4) + ';';
		this.socket.write(msgData);
		winston.info({message: 'Mock CBUS Network: Output UNSUPOPCODE : nodeId [' + nodeId + '] ' + msgData});
	}
}

class CbusModule {
	constructor(nodeId) {
     	this.events = []
		this.nodeId = nodeId;
		this.parameters = 	[ 	8,		// number of available parameters
								0,		// param 1 manufacturer Id
								0,		// param 2 Minor code version
								0,		// param 3 module Id
								0,		// param 4 number of supported events
								0,		// param 5 number of event variables
								0,		// param 6 number of supported node variables
								0,		// param 7 major version
								0,		// param 8 node flags
								// NODE flags
								// 	Bit 0	: Consumer
								//	Bit 1	: Producer
								//	Bit 2	: FLiM Mode
								//	Bit 3	: The module supports bootloading		
							]
	}

	getStoredEvents() { return this.events}
	getStoredEventsCount() { return this.events.length}
	
	getParameter(i) {return this.parameters[i]}
	
	getNodeId(){return this.nodeId}
	getNodeIdHex(){return decToHex(this.nodeId, 4)}
	setNodeId(newNodeId) { this.nodeId = newNodeId;}
	
	getModuleIdHex() {return decToHex(this.parameters[3], 2)}
	setModuleId(Id) {this.parameters[3] = Id}

	getManufacturerIdHex() {return decToHex(this.parameters[1], 2)}
	setManufacturerId(Id) {this.parameters[1] = Id}

	getFlagsHex() {return decToHex(this.parameters[8], 2)}
	setNodeFlags(flags) {this.parameters[8] = flags}
}

class CANACC8 extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(3);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANSERVO8C extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(19);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANMIO extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(32);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANCAB extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(9);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANPAN extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(29);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANCMD extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(10);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANACE8C extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(5);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}

class CANMIO_OUT extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.parameters[3] = 52;
		this.setManufacturerId(165);
		this.setNodeFlags(7);
        
   		this.events.push({'eventName': 0x012D0103, "variables":[ 0, 0, 0, 0 ]})
		this.events.push({'eventName': 0x012D0104, "variables":[ 0, 0, 0, 0 ]})
	}
}



module.exports = {
    mock_CbusNetwork: mock_CbusNetwork
}





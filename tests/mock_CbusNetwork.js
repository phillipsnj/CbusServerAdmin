'use strict';
const net = require('net');
const cbusMessage = require('./../merg/mergCbusMessage.js')

//
//		Grid connect CAN over serial message syntax
//     : <S | X> <IDENTIFIER> <N> <DATA-0> <DATA-1> … <DATA-7> ;
//
//	

let debug = 0;

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
		console.log("Mock CBUS Network: Starting");

		this.sendArray = [];
		this.socket;
		
		this.modules = 	[
						new CANACC8 (0),
						new CANSERVO8C (1),
						new CANMIO_OUT (2),
						new CANPAN (3),
						new CANACE8C (4),
						new CANMIO (65535)
						]

		this.server = net.createServer(function (socket) {
			this.socket=socket;
			socket.setKeepAlive(true,60000);
			socket.on('data', function (data) {
				if (debug) console.log('Mock CBUS Network: data received');
				const msgArray = data.toString().split(";");
				for (var i = 0; i < msgArray.length - 1; i++) {
					msgArray[i] = msgArray[i].concat(";");				// add back the ';' terminator that was lost in the split
					this.sendArray.push(msgArray[i]);					// store the incoming messages so the test can inspect them
					if (debug) console.log('Mock CBUS Network: [' + i + '] : ' +  msgArray[i] );
					
					let msg = new cbusMessage.cbusMessage(msgArray[i]);
					switch (msg.opCode()) {
					case '0D':
						// Format: <MjPri><MinPri=3><CANID>]<0D>
						if (debug) console.log('Mock CBUS Network: received QNN');
						for (var i = 0; i < this.modules.length; i++) {
							this.outputPNN(this.modules[i].getNodeId());
						}
						break;
					case '58':
						// Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						if (debug) console.log('Mock CBUS Network: received RQEVN');
						this.outputNUMEV(msg.nodeId());
						break;
					case '73':
						// Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						if (debug) console.log('Mock CBUS Network: received RQNPN');
						this.outputPARAN(msg.nodeId(), msg.paramId());
						break;
					default:
						break;
					}
				}
			}.bind(this));

			socket.on('end', function () {
				console.log('Mock CBUS Network: Client Disconnected');
			}.bind(this));
			
			socket.on('error', function(err) {
				console.log('Mock CBUS Network Error: ' + err)
			}.bind(this));
			
		}.bind(this));

		this.server.listen(NET_PORT);
		
		// emitted when new client connects
		this.server.on('connection',function(socket){
			var rport = socket.remotePort;
			console.log('Mock CBUS Network: remote client at port : ' + rport);
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
		console.log('Mock CBUS Network: Server closed')
	}


	getModule(nodeId) {
		for (var i = 0; i < this.modules.length; i++) {
			if (this.modules[i].getNodeId() == nodeId) return this.modules[i];
		}
	}
	
	
	outputPNN(nodeId) {
		// Format: <0xB6><<NN Hi><NN Lo><Manuf Id><Module Id><Flags>
		if (debug) console.log('Mock CBUS Network: Output PNN');
		var nodeData = this.getModule(nodeId).getNodeIdHex()
			+ this.getModule(nodeId).getManufacturerIdHex() 
			+ this.getModule(nodeId).getModuleIdHex() 
			+ this.getModule(nodeId).getFlagsHex();
		var msgData = ':S' + 'B780' + 'N' + 'B6' + nodeData + ';'
		if (debug) console.log('Mock CBUS Network: Output PNN : nodeId [' + nodeId + '] ' + msgData );
		this.socket.write(msgData);
	}


	outputNUMEV(nodeId) {
		// Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
		if (debug) console.log('Mock CBUS Network: Output NUMEV : Node [' + nodeId + ']');
		var storedEventsCount = this.getModule(nodeId).getStoredEventsCount();
		var msgData = ':S' + 'B780' + 'N' + '74' + decToHex(nodeId, 4) + decToHex(storedEventsCount, 2) + ';'
		if (debug) console.log('Mock CBUS Network: Output NUMEV : Node [' + nodeId + '] : ' + msgData);
		this.socket.write(msgData);
	}


	outputPARAN(nodeId, paramId) {
		// Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output PARAN');
		var paramValue = this.getModule(nodeId).getParameter(paramId);
		var msgData = ':S' + 'B780' + 'N' + '9B' + decToHex(nodeId, 4) + decToHex(paramId, 2) + decToHex(paramValue, 2) + ';'
		if (debug) console.log('Mock CBUS Network: Output PARAN : Node [' + nodeId + '] : '  + msgData);
		this.socket.write(msgData);
	}

	
	outputACON(nodeId, eventId) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output ACON');
		// Format: [<MjPri><MinPri=3><CANID>]<90><NN hi><NN lo><EN hi><EN lo>
		this.socket.write( ':S' + 'B780' + 'N' + '90' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';');
	}


	outputACOF(nodeId, eventId) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output ACOF');
		// Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
		this.socket.write( ':S' + 'B780' + 'N' + '91' + decToHex(nodeId, 4) + decToHex(eventId, 4) + ';');
	}


	outputDFUN(session, fn1, fn2) {
		if (debug) console.log('Mock CBUS Network: Output DFUN');
		// Format: [<MjPri><MinPri=2><CANID>]<60><Session><Fn1><Fn2>
		this.socket.write( ':S' + 'B780' + 'N' + '60' + decToHex(session, 2) + decToHex(fn1, 2) + decToHex(fn2, 2) + ';');
	}


	outputERR(data, errorNumber) {
		if (debug) console.log('Mock CBUS Network: Output ERR');
		// Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
		this.socket.write( ':S' + 'B780' + 'N' + '63' + decToHex(data, 4) + decToHex(errorNumber, 2) + ';');
	}


	outputCMDERR(nodeId, errorNumber) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output CMDERR');
		// Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
		this.socket.write( ':S' + 'B780' + 'N' + '6F' + decToHex(nodeId, 4) + decToHex(errorNumber, 2) + ';');
	}


	outputKLOC(session) {
		if (debug) console.log('Mock CBUS Network: Output KLOC');
		// Format: [<MjPri><MinPri=2><CANID>]<21><Session>
		this.socket.write( ':S' + 'B780' + 'N' + '21' + decToHex(session, 2) + ';');
	}


	outputUNSUPOPCODE(nodeId) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output CMDERR');
		// Ficticious opcode - 'FC' currently unused
		// Format: [<MjPri><MinPri=3><CANID>]<FC><NN hi><NN lo>
		this.socket.write( ':S' + 'B780' + 'N' + 'FC' + decToHex(nodeId, 4) + ';');
	}
}

class CbusModule {
	constructor(nodeId) {
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

	getStoredEventsCount() { return 3}
	
	getParameter(i) {return this.parameters[i]}
	
	getNodeId(){return this.nodeId}
	getNodeIdHex(){return decToHex(this.nodeId, 4)}
	
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
	}
}

class CANSERVO8C extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(19);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}

class CANMIO extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(32);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}

class CANCAB extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(9);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}

class CANPAN extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(29);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}

class CANCMD extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(10);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}

class CANACE8C extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.setModuleId(5);
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}

class CANMIO_OUT extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.parameters[3] = 52;
		this.setManufacturerId(165);
		this.setNodeFlags(7);
	}
}



module.exports = {
    mock_CbusNetwork: mock_CbusNetwork
}





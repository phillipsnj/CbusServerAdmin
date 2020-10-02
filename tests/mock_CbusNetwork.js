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
						this.outputPNN(socket);
						break;
					case '58':
						// Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						if (debug) console.log('Mock CBUS Network: received RQEVN');
						this.outputNUMEV(socket, msg.nodeId());
						this.outputACOF(socket, msg.nodeId());
						break;
					case '73':
						// Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						if (debug) console.log('Mock CBUS Network: received RQNPN');
						this.outputPARAN(socket, msg.nodeId(), msg.paramId());
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
	
	
	outputPNN(socket) {
		// Format: <0xB6><<NN Hi><NN Lo><Manuf Id><Module Id><Flags>
		if (debug) console.log('Mock CBUS Network: Output PNN');
		// generate response for every module instance
		for (var i = 0; i < this.modules.length; i++) {
			var msgData = this.modules[i].getNodeId() + this.modules[i].getManufacturerId() + this.modules[i].getModuleId() + this.modules[i].getFlags();
			if (debug) console.log('Mock CBUS Network: Output PNN : Data [' + i + '] ' + msgData );
			this.socket.write( ':S' + 'B780' + 'N' +  'B6' + msgData + ';');	// CANACC8
		}
	}


	outputNUMEV(socket, nodeId) {
		// Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output NUMEV');
		this.socket.write( ':S' + 'B780' + 'N' + '74' + decToHex(nodeId, 4) + '03' + ';');
	}


	outputPARAN(socket, nodeId, paramId) {
		// Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output PARAN');
		if (paramId == 0) {
			// number of node parameters
			this.socket.write( ':S' + 'B780' + 'N' + '9B' + decToHex(nodeId, 4) + decToHex(paramId, 2) + '08' + ';');
		}
		if (paramId == 6) {
			// number of node variables
			this.socket.write( ':S' + 'B780' + 'N' + '9B' + decToHex(nodeId, 4) + decToHex(paramId, 2) + '08' + ';');
		}
	}
	
	outputACOF(socket, nodeId) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output ACOF');
		// Format: [<MjPri><MinPri=3><CANID>]<91><NN hi><NN lo><EN hi><EN lo>
		this.socket.write( ':S' + 'B780' + 'N' + '91' + decToHex(nodeId, 4) + decToHex(0, 4) + ';');
		this.socket.write( ':S' + 'B780' + 'N' + '91' + decToHex(nodeId, 4) + decToHex(1, 4) + ';');
		this.socket.write( ':S' + 'B780' + 'N' + '91' + decToHex(nodeId, 4) + decToHex(65535, 4) + ';');
	}

	outputERR(errorNumber) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output ERR');
		// Format: [<MjPri><MinPri=2><CANID>]<63><Dat 1><Dat 2><Dat 3>
		this.socket.write( ':S' + 'B780' + 'N' + '63' + '12' + '34' + decToHex(errorNumber, 2) + ';');
	}

	outputCMDERR(nodeId, errorNumber) {
		if (debug) console.log('Mock CBUS Network: Node [' + nodeId + '] Output CMDERR');
		// Format: [<MjPri><MinPri=3><CANID>]<6F><NN hi><NN lo><Error number>
		this.socket.write( ':S' + 'B780' + 'N' + '6F' + decToHex(nodeId, 4) + decToHex(errorNumber, 2) + ';');
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
	}
	
	getNodeId(){
		return decToHex(this.nodeId, 4);
	}
	
	getModuleId() {
		return this.moduleId;
	}

	getManufacturerId() {
		return this.manufacturerId;
	}

	getFlags() {
		return this.flags;
	}
}

class CANACC8 extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.moduleId = '03';
		this.manufacturerId = 'A5';
		this.flags = '07';
	}
}

class CANSERVO8C extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.moduleId = '13';
		this.manufacturerId = 'A5';
		this.flags = '07';
	}
}

class CANMIO extends CbusModule{
	constructor(nodeId) {
		super(nodeId);
		this.moduleId = '20';
		this.manufacturerId = 'A5';
		this.flags = '07';
	}
}


module.exports = {
    mock_CbusNetwork: mock_CbusNetwork
}





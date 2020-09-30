'use strict';
const net = require('net');
const cbusMessage = require('./../merg/mergCbusMessage.js')

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
		console.log("Mock CBUS Network: Starting");

		this.sendArray = [];
		this.sockets = []

		this.server = net.createServer(function (socket) {
			socket.setKeepAlive(true,60000);
			this.sockets.push(socket);
			socket.on('data', function (data) {
//				console.log('Mock CBUS Network: data received');
				const msgArray = data.toString().split(";");
				for (var i = 0; i < msgArray.length - 1; i++) {
					msgArray[i] = msgArray[i].concat(";");				// add back the ';' terminator that was lost in the split
					this.sendArray.push(msgArray[i]);					// store the incoming messages so the test can inspect them
					console.log('Mock CBUS Network: [' + i + '] : ' +  msgArray[i] );
					
					let msg = new cbusMessage.cbusMessage(msgArray[i]);
					switch (msg.opCode()) {
					case '0D':
						// Format: <MjPri><MinPri=3><CANID>]<0D>
						console.log('Mock CBUS Network: received QNN');
						this.outputPNN(socket);
						break;
					case '58':
						// Format: [<MjPri><MinPri=3><CANID>]<58><NN hi><NN lo>
						console.log('Mock CBUS Network: received RQEVN');
						this.outputNUMEV(socket, msg.nodeId());
						break;
					case '73':
						// Format: [<MjPri><MinPri=3><CANID>]<73><NN hi><NN lo><Para#>
						console.log('Mock CBUS Network: received RQNPN');
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
		this.sockets.forEach( (s) => s.end() )
		console.log('Mock CBUS Network: Server closed')
	}
	
	
	outputPNN(socket) {
		// Format: <0xB6><<NN Hi><NN Lo><Manuf Id><Module Id><Flags>
		console.log('Mock CBUS Network: Output PNN');
		socket.write( ':S' + 'B780' + 'N' +  'B6'  + '00'  +'00'    + 'A5'     + '03' + '07' + ';');	// CANACC8
		socket.write( ':S' + 'B780' + 'N' +  'B6'  + '00'  +'01'    + 'A5'     + '13' + '07' + ';');	// CANSERVO8C
		socket.write( ':S' + 'B780' + 'N' +  'B6'  + 'FF'  +'FF'    + 'A5'     + '20' + '07' + ';');	//CANMIO
	}


	outputNUMEV(socket, nodeId) {
		// Format: [<MjPri><MinPri=3><CANID>]<74><NN hi><NN lo><No.of events>
		console.log('Mock CBUS Network: Output NUMEV');
		socket.write( ':S' + 'B780' + 'N' + '74' + decToHex(nodeId, 4) + '03' + ';');
	}


	outputPARAN(socket, nodeId, paramId) {
		// Format: [<MjPri><MinPri=3><CANID>]<9B><NN hi><NN lo><Para#><Para val>
		console.log('Mock CBUS Network: Output PARAN');
		if (paramId == 0) {
			// number of node parameters
			socket.write( ':S' + 'B780' + 'N' + '9B' + decToHex(nodeId, 4) + decToHex(paramId, 2) + '08' + ';');
		}
		if (paramId == 6) {
			// number of node variables
			socket.write( ':S' + 'B780' + 'N' + '9B' + decToHex(nodeId, 4) + decToHex(paramId, 2) + '08' + ';');
		}
	}
}


module.exports = {
    mock_CbusNetwork: mock_CbusNetwork
}





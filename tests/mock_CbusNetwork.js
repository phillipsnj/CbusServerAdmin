'use strict';
const net = require('net');
const cbusMessage = require('./../merg/mergCbusMessage.js')

//
//		Grid connect CAN over serial message syntax
//     : <S | X> <IDENTIFIER> <N> <DATA-0> <DATA-1> … <DATA-7> ;
//
//	


class mock_CbusNetwork {

    constructor(NET_PORT) {
		console.log("Mock CBUS Network: Starting");

		this.sendArray = [];

		var server = net.createServer(function (socket) {
			socket.setKeepAlive(true,60000);
			socket.on('data', function (data) {
				console.log('Mock CBUS Network: receive data : ' + data);
				
				this.sendArray.push(data);

				const msgArray = data.toString().split(";");
				for (var i = 0; i < msgArray.length - 1; i++) {
					let msg = new cbusMessage.cbusMessage(msgArray[i]);
					switch (msg.opCode()) {
					case '0D':
						console.log('Mock CBUS Network: received QNN');
						this.outputPNN(socket);
						break;
					default:
						break;
					}
					break;
				}
			}.bind(this));

			socket.on('end', function () {
				console.log('Mock CBUS Network: Client Disconnected');
			}.bind(this));
			
			socket.on('error', function(err) {
				console.log('Mock CBUS Network: ' + err)
			}.bind(this));
			
		}.bind(this));

		server.listen(NET_PORT);
		
		// emitted when new client connects
		server.on('connection',function(socket){
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

	
	outputPNN(socket) {
		// respond with PNN message
		// 									<0xB6><<NN Hi><NN Lo><Manuf Id><Module Id><Flags>
		console.log('Mock CBUS Network: Output PNN');
		socket.write( ':S' + 'B780' + 'N' +  'B6'  + '00'  +'01'    + '55'     + '55' + '00' + ';');
	}
}


module.exports = {
    mock_CbusNetwork: mock_CbusNetwork
}





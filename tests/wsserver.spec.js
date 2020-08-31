const expect = require('chai').expect;
const websocket_Server = require('./../wsserver');
const http = require('http');
const mock_CBUS_Interface = require('./mock_cbus_interface.js');
var itParam = require('mocha-param');
const io = require('socket.io-client');

function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    //return (num + Math.pow(16, len)).toString(16).slice(-len).toUpperCase()
    return padded.substr(-len)
}



describe('Websocket server tests', function(){
	let http_Server = undefined;
	let websocket_Client = undefined;
	let mock_CBUS = new mock_CBUS_Interface.cbusAdmin();

	before(function(done) {
		http_Server = http.createServer(() => console.log(" -/- "));
		http_Server.listen(7575, () => { console.log("server listening on 7575"); });
	
		websocket_Server(http_Server, mock_CBUS);

		websocket_Client = io.connect('http://localhost:7575/', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
		
        websocket_Client.on('connect', function() {
			console.log('Client connected...');
            done();
        });
		
        websocket_Client.on('disconnect', function() {
            console.log('Client disconnected...');
        });
	});

	after(function() {
		if (websocket_Client.connected)
		{
			console.log('Close WS Client');
			websocket_Client.close();
		}
		if(http_Server) {
			console.log('Close http server');
			http_Server.close(() => { console.log('CLOSING Server'); http_Server.unref(); done(); });
		}
	});
	
		var ACON_Data = [	{ node: 0, event: 0 },
						{ node: 0, event: 1 },
						{ node: 0, event: 65535 },
						{ node: 1, event: 0 },
						{ node: 1, event: 1 },
						{ node: 1, event: 65535 },
						{ node: 65535, event: 0 },
						{ node: 65535, event: 1 },
						{ node: 65535, event: 65535 }
						];
		
	    itParam("ACON test nodeId ${value.node} event ${value.event}", ACON_Data, function (done, value) {
			mock_CBUS.clearSendArray();
			websocket_Client.emit('ACON', {"nodeId": value.node, "eventId": value.event})
			setTimeout(function(){
				expected = ":SB780N90" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
				expect(mock_CBUS.getSendArray()[0]).to.equal(expected);
				done();
			}, 100);
		})
		

	it('RQNPN', function(done) {
		mock_CBUS.clearSendArray();
		console.log("Client: Request RQNPN");
		websocket_Client.emit('RQNPN', {"nodeId": 128, "parameter": 0})
		setTimeout(function(){
			expect(mock_CBUS.getSendArray()[0]).to.equal(":SB780N73008000;");
			done();
			}, 100);
	});

	it('QNN', function(done) {
		mock_CBUS.clearSendArray();
		console.log("Client: Request QNN");
		websocket_Client.emit('QNN', '');
		setTimeout(function(){
			expect(mock_CBUS.getSendArray()[0]).to.equal(":SB780N0D;");
			done();
			}, 100);
	});

})
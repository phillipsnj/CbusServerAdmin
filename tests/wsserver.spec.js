const expect = require('chai').expect;
const websocket_Server = require('./../wsserver');
const http = require('http');

const file = 'config/nodeConfig.json'
//const cbusAdmin_Interface = require('./mock_cbus_interface.js');
const cbusAdmin_Interface = require('./../merg/mergAdminNode.js')

const Mock_Cbus = require('./mock_CbusNetwork.js')

const NET_PORT = 5551;
const NET_ADDRESS = "127.0.0.1"


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

	let mock_Cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
	let cbusAdmin = new cbusAdmin_Interface.cbusAdmin(file, NET_ADDRESS,NET_PORT);

//	let mock_Cbus = cbusAdmin;

	let debug = 0;

	before(function(done) {
		http_Server = http.createServer(() => console.log(" -/- "));
		http_Server.listen(7575, () => { console.log("server listening on 7575"); });
	
		websocket_Server(http_Server, cbusAdmin);

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
		console.log('\n');  //newline for visual separation
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
	
		var TestCases_NodeEvent = 	[	{ node: 0, event: 0 },
										{ node: 0, event: 1 },
										{ node: 0, event: 65535 },
										{ node: 1, event: 0 },
										{ node: 1, event: 1 },
										{ node: 1, event: 65535 },
										{ node: 65535, event: 0 },
										{ node: 65535, event: 1 },
										{ node: 65535, event: 65535 }
										];

		var TestCases_NodeParameter = [	{ node: 0, param: 0 },
										{ node: 0, param: 1 },
										{ node: 0, param: 255 },
										{ node: 1, param: 0 },
										{ node: 1, param: 1 },
										{ node: 1, param: 255 },
										{ node: 65535, param: 0 },
										{ node: 65535, param: 1 },
										{ node: 65535, param: 255 }
										];

		var TestCases_NodeParamIDParamValue = 	[	{ node: 0, 		paramId: 0, 	paramVal: 0 },
													{ node: 0, 		paramId: 0, 	paramVal: 1  },
													{ node: 0, 		paramId: 0, 	paramVal: 255 },
													{ node: 0, 		paramId: 1, 	paramVal: 0 },
													{ node: 0, 		paramId: 1, 	paramVal: 1 },
													{ node: 0, 		paramId: 1, 	paramVal: 255 },
													{ node: 0, 		paramId: 255, 	paramVal: 0 },
													{ node: 0, 		paramId: 255, 	paramVal: 1 },
													{ node: 0, 		paramId: 255, 	paramVal: 255 },
													{ node: 1, 		paramId: 0, 	paramVal: 0  },
													{ node: 1, 		paramId: 0, 	paramVal: 1  },
													{ node: 1, 		paramId: 0, 	paramVal: 255 },
													{ node: 1, 		paramId: 1, 	paramVal: 0 },
													{ node: 1, 		paramId: 1, 	paramVal: 1 },
													{ node: 1, 		paramId: 1, 	paramVal: 255 },
													{ node: 1, 		paramId: 255, 	paramVal: 0 },
													{ node: 1, 		paramId: 255, 	paramVal: 1 },
													{ node: 1, 		paramId: 255, 	paramVal: 255 },
													{ node: 65535, 	paramId: 0, 	paramVal: 0  },
													{ node: 65535, 	paramId: 0, 	paramVal: 1  },
													{ node: 65535, 	paramId: 0, 	paramVal: 255 },
													{ node: 65535, 	paramId: 1, 	paramVal: 0 },
													{ node: 65535, 	paramId: 1, 	paramVal: 1 },
													{ node: 65535, 	paramId: 1, 	paramVal: 255 },
													{ node: 65535, 	paramId: 255, 	paramVal: 0 },
													{ node: 65535, 	paramId: 255, 	paramVal: 1 },
													{ node: 65535, 	paramId: 255, 	paramVal: 255 }
													];

		var TestCases_NodeId = 		[	{ node: 0 },
										{ node: 1 },
										{ node: 65535 },
										];

	function GetTestCase_EVLRN () {
		var testCases = [];
		var nodeId;
		var actionId;
		var eventName;
		var eventId;
		var eventVal;
		for (l1 = 1; l1 < 4; l1++) {
			if (l1 == 1) nodeId = 0;
			if (l1 == 2) nodeId = 1;
			if (l1 == 3) nodeId = 65535;
			
			for (l2 = 1; l2 < 4; l2++) {
				if (l2 == 1) actionId = 0;
				if (l2 == 2) actionId = 1;
				if (l2 == 3) actionId = 65535;
				
				for (l3 = 1; l3 < 4; l3++) {
					if (l3 == 1) eventName = '00000000';
					if (l3 == 2) eventName = '00000001';
					if (l3 == 3) eventName = 'FFFFFFFF';
					
					for (l4 = 1; l4 < 4; l4++) {
						if (l4 == 1) eventId = 0;
						if (l4 == 2) eventId = 1;
						if (l4 == 3) eventId = 255;
					
						for (l5 = 1; l5 < 4; l5++) {
							if (l5 == 1) eventVal = 0;
							if (l5 == 2) eventVal = 1;
							if (l5 == 3) eventVal = 255;
						
							testCases.push({'nodeId':nodeId,'actionId':actionId, 'eventName':eventName, 'eventId':eventId, 'eventVal':eventVal});
						}
					}
				}
			}
		}
		return testCases;
	}

	function GetTestCase_TEACH_EVENT () {
		var testCases = [];
		var nodeId;
		var actionId;
		var eventName;
		var eventId;
		var eventVal;
		for (l1 = 1; l1 < 4; l1++) {
			if (l1 == 1) nodeId = 0;
			if (l1 == 2) nodeId = 1;
			if (l1 == 3) nodeId = 65535;
			
			for (l3 = 1; l3 < 4; l3++) {
				if (l3 == 1) eventName = '00000000';
				if (l3 == 2) eventName = '00000001';
				if (l3 == 3) eventName = 'FFFFFFFF';
				
				for (l4 = 1; l4 < 4; l4++) {
					if (l4 == 1) eventId = 0;
					if (l4 == 2) eventId = 1;
					if (l4 == 3) eventId = 255;
				
					for (l5 = 1; l5 < 4; l5++) {
						if (l5 == 1) eventVal = 0;
						if (l5 == 2) eventVal = 1;
						if (l5 == 3) eventVal = 255;
					
						testCases.push({'nodeId':nodeId, 'eventName':eventName, 'eventId':eventId, 'eventVal':eventVal});
					}
				}
			}
		}
		return testCases;
	}

	///////////////////////////////////////////////
	//
	// Test WebSocket In Messages
	//
	///////////////////////////////////////////////

	it("Wait.....", function (done) {
		setTimeout(function(){
			done();
		}, 100);
	})



	itParam("ACOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		if (debug) console.log("\nTest Client: Request ACOF");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('ACOF', {"nodeId": value.node, "eventId": value.event})
		setTimeout(function(){
			expected = ":SB780N91" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 200);
	})

		
	itParam("ACON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		if (debug) console.log("\nTest Client: Request ACON");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('ACON', {"nodeId": value.node, "eventId": value.event})
		setTimeout(function(){
			expected = ":SB780N90" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})



	itParam("EVLRN test nodeId ${value.nodeId} actionId ${value.actionId} eventName ${value.eventName}, eventId ${value.eventId}, eventVal ${value.eventVal}",
		GetTestCase_EVLRN(), function (done, value) {
		if (debug) console.log("\nTest Client: Request EVLRN");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('EVLRN', {
                "nodeId": value.nodeId,
                "actionId": value.actionId,
                "eventName": value.eventName,
                "eventId": value.eventId,
                "eventVal": value.eventVal
            })
		setTimeout(function(){
			 expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			 expected1 = ":SB780ND2" + value.eventName + decToHex(value.eventId, 2) + decToHex(value.eventVal, 2) + ";";
			 expect(mock_Cbus.getSendArray()[1]).to.equal(expected1);
			 expected2 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[2]).to.equal(expected2);
			 expected3 = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.actionId, 2) + decToHex(value.eventId, 2) + ";";
			 expect(mock_Cbus.getSendArray()[3]).to.equal(expected3);
			 expected4 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[4]).to.equal(expected4);
			 expected5 = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[5]).to.equal(expected5);
			 expected6 = ":SB780N58" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[6]).to.equal(expected6);
			done();
		}, 100);
	})


	itParam("EVULN test nodeId ${value.nodeId} actionId ${value.actionId} eventName ${value.eventName}, eventId ${value.eventId}, eventVal ${value.eventVal}",
		GetTestCase_EVLRN(), function (done, value) {
		if (debug) console.log("\nTest Client: Request EVULN");
		mock_Cbus.clearSendArray();
		var TestCases_NodeId = 	[	{ eventName: 0 },
								{ eventId: 1 },
								{ eventVal: 65535 },
								];

		websocket_Client.emit('EVULN', {
                "nodeId": value.nodeId,
				"eventName": event
				})
		setTimeout(function(){
			 // expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
			 // expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			 // expected1 = ":SB780ND2" + value.eventName + decToHex(value.eventId, 2) + decToHex(value.eventVal, 2) + ";";
			 // expect(mock_Cbus.getSendArray()[1]).to.equal(expected1);
			 // expected2 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 // expect(mock_Cbus.getSendArray()[2]).to.equal(expected2);
			 // expected3 = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.actionId, 2) + decToHex(value.eventId, 2) + ";";
			 // expect(mock_Cbus.getSendArray()[3]).to.equal(expected3);
			 // expected4 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 // expect(mock_Cbus.getSendArray()[4]).to.equal(expected4);
			 // expected5 = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
			 // expect(mock_Cbus.getSendArray()[5]).to.equal(expected5);
			 // expected6 = ":SB780N58" + decToHex(value.nodeId, 4) + ";";
			 // expect(mock_Cbus.getSendArray()[6]).to.equal(expected6);
			done();
		}, 100);
	})



	itParam("NERD test nodeId ${value.node}", TestCases_NodeId, function (done, value) {
		if (debug) console.log("\nTest Client: Request NERD");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('NERD', {"nodeId": value.node})
		setTimeout(function(){
			expected = ":SB780N57" + decToHex(value.node, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})
		

	itParam("NVRD test nodeId ${value.node} variableId ${value.param}", TestCases_NodeParameter, function (done, value) {
		if (debug) console.log("\nTest Client: Request NVRD");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('NVRD', {"nodeId": value.node, "variableId": value.param})
		setTimeout(function(){
			expected = ":SB780N71" + decToHex(value.node, 4) + decToHex(value.param, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})
		

	itParam("NVSET test nodeId ${value.node} variableId ${value.paramId} value ${value.paramVal}", TestCases_NodeParamIDParamValue, function (done, value) {
		if (debug) console.log("\nTest Client: Request NVSET");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('NVSET', {"nodeId": value.node, "variableId": value.paramId, "variableValue": value.paramVal})
		setTimeout(function(){
			expected = ":SB780N96" + decToHex(value.node, 4) + decToHex(value.paramId, 2)+ decToHex(value.paramVal, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected2 = ":SB780N71" + decToHex(value.node, 4) + decToHex(value.paramId, 2) + ";";
			expect(mock_Cbus.getSendArray()[1]).to.equal(expected2);
			done();
		}, 100);
	})
		
		
	itParam("REVAL test nodeId ${value.node} variableId ${value.paramId} value ${value.paramVal}", TestCases_NodeParamIDParamValue, function (done, value) {
		if (debug) console.log("\nTest Client: Request REVAL");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REVAL', {"nodeId": value.node, "actionId": value.paramId, "valueId": value.paramVal})
		setTimeout(function(){
			expected = ":SB780N9C" + decToHex(value.node, 4) + decToHex(value.paramId, 2)+ decToHex(value.paramVal, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})
		

	itParam("RQNPN test nodeId ${value.node} param ${value.param}", TestCases_NodeParameter, function (done, value) {
		if (debug) console.log("\nTest Client: Request RQNPN");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('RQNPN', {"nodeId": value.node, "parameter": value.param})
		setTimeout(function(){
			expected = ":SB780N73" + decToHex(value.node, 4) + decToHex(value.param, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})
		

	it('QNN test', function(done) {
		if (debug) console.log("\nTest Client: Request QNN");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('QNN', '');
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(":SB780N0D;");
			done();
			}, 100);
	});

/*
	itParam("TEACH_EVENT test nodeId ${value.nodeId} eventName ${value.eventName}, eventId ${value.eventId}, eventVal ${value.eventVal}",
		GetTestCase_TEACH_EVENT(), function (done, value) {
		if (debug) console.log("\nTest Client: Request TEACH_EVENT");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('TEACH_EVENT', {
                "nodeId": value.nodeId,
                "eventName": value.eventName,
                "eventId": value.eventId,
                "eventVal": value.eventVal
            })
		setTimeout(function(){
			 expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			 expected1 = ":SB780ND2" + value.eventName + decToHex(value.eventId, 2) + decToHex(value.eventVal, 2) + ";";
			 expect(mock_Cbus.getSendArray()[1]).to.equal(expected1);
			 expected2 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[2]).to.equal(expected2);
			 expected3 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[3]).to.equal(expected3);
			 expected4 = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[4]).to.equal(expected4);
			 expected5 = ":SB780N58" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[5]).to.equal(expected5);
			done();
		}, 100);
	})
*/

/*
	itParam("CLEAR_NODE_EVENTS test nodeId ${value.node}", TestCases_NodeId, function (done, value) {
		if (debug) console.log("\nTest Client: CLEAR_NODE_EVENTS");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('CLEAR_NODE_EVENTS', {"nodeId": value.node})
		setTimeout(function(){
			expected = value.node;
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})
		
		
	it('REFRESH_EVENTS test', function(done) {
		if (debug) console.log("\nTest Client: REFRESH_EVENTS");
		mock_Cbus.clearSendArray();
		let testCase = "REFRESH_EVENTS";
		websocket_Client.emit('REFRESH_EVENTS')
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(testCase);
			done();
			}, 100);
	});


	it('CLEAR_CBUS_ERRORS test', function(done) {
		if (debug) console.log("\nTest Client: CLEAR_CBUS_ERRORS");
		mock_Cbus.clearSendArray();
		let testCase = "CLEAR_CBUS_ERRORS";
		websocket_Client.emit('CLEAR_CBUS_ERRORS')
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(testCase);
			done();
			}, 100);
	});
*/

	it('UPDATE_LAYOUT_DETAILS test', function(done) {
		if (debug) console.log("\nTest Client: UPDATE_LAYOUT_DETAILS");
		mock_Cbus.clearSendArray();
		let testCase = "UPDATE_LAYOUT_DETAILS";
		let capturedData= "";
		websocket_Client.on('layoutDetails', function (data) {capturedData = data;});	
		websocket_Client.emit('UPDATE_LAYOUT_DETAILS', testCase)
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});





/*
	///////////////////////////////////////////////
	//
	// Test WebSocket Out Messages
	//
	///////////////////////////////////////////////


	it('cbusError test', function(done) {
		if (debug) console.log("\nTest Client: Trigger cbusError");
		let testCase = "ABCDEF";
		let capturedData= "";
		websocket_Client.on('cbusError', function (data) {capturedData = data;});	
		mock_Cbus.Create_cbusError(testCase);
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});


	it('cbusNoSupport test', function(done) {
		if (debug) console.log("\nTest Client: Trigger cbusNoSupport");
		let testCase = "ABCDEF";
		let capturedData= "";
		websocket_Client.on('cbusNoSupport', function (data) {capturedData = data;});	
		mock_Cbus.Create_cbusNoSupport(testCase);
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});


	it('dccError test', function(done) {
		if (debug) console.log("\nTest Client: Trigger dccError");
		let testCase = "ABCDEF";
		let capturedData= "";
		websocket_Client.on('dccError', function (data) {capturedData = data;});	
		mock_Cbus.Create_dccError(testCase);
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});


	it('dccSessions test', function(done) {
		if (debug) console.log("\nTest Client: Trigger dccSessions");
		let testCase = "ABCDEF";
		let capturedData= "";
		websocket_Client.on('dccSessions', function (data) {capturedData = data;});	
		mock_Cbus.Create_dccSessions(testCase);
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});


	it('events test', function(done) {
		if (debug) console.log("\nTest Client: Trigger events");
		let testCase = "ABCDEF";
		let capturedData= "";
		websocket_Client.on('events', function (data) {capturedData = data;});	
		mock_Cbus.Create_Events(testCase);
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});


	it('node test', function(done) {
		if (debug) console.log("\nTest Client: Trigger nodes");
		let testCase = "ABCDEF";
		let capturedData= "";
		websocket_Client.on('nodes', function (data) {capturedData = data;});	
		mock_Cbus.Create_Nodes(testCase);
		setTimeout(function(){
			expect(capturedData).to.equal(testCase);
			done();
			}, 100);
	});
*/

})
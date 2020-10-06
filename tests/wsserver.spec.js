const expect = require('chai').expect;
const websocket_Server = require('./../wsserver');
const http = require('http');

const file = 'config/nodeConfig.json'
const cbusAdmin_Interface = require('./../merg/mergAdminNode.js')

const Mock_Cbus = require('./mock_CbusNetwork.js')

const NET_PORT = 5551;
const NET_ADDRESS = "127.0.0.1"


var itParam = require('mocha-param');
const io = require('socket.io-client');

function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    return padded.substr(-len)
}



describe('Websocket server tests', function(){
	let http_Server = undefined;
	let websocket_Client = undefined;

	let mock_Cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
	let cbusAdmin = new cbusAdmin_Interface.cbusAdmin(file, NET_ADDRESS,NET_PORT);

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

	function GetTestCase_EVULN () {
		var testCases = [];
		var nodeId;
		var eventName;
		for (l1 = 1; l1 < 4; l1++) {
			if (l1 == 1) nodeId = 0;
			if (l1 == 2) nodeId = 1;
			if (l1 == 3) nodeId = 65535;
			
			for (l3 = 1; l3 < 4; l3++) {
				if (l3 == 1) eventName = '00000000';
				if (l3 == 2) eventName = '00000001';
				if (l3 == 3) eventName = 'FFFFFFFF';
				
				testCases.push({'nodeId':nodeId, 'eventName':eventName});
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



	function GetTestCase_UPDATE_EVENT_VARIABLE () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (eventIndexCount = 1; eventIndexCount < 4; eventIndexCount++) {
				if (eventIndexCount == 1) eventIndex = 0;
				if (eventIndexCount == 2) eventIndex = 1;
				if (eventIndexCount == 3) eventIndex = 255;
				
				for (eventNameCount = 1; eventNameCount < 4; eventNameCount++) {
					if (eventNameCount == 1) eventName = '00000000';
					if (eventNameCount == 2) eventName = '00000001';
					if (eventNameCount == 3) eventName = 'FFFFFFFF';
					
					for (eventVariableIdCount = 1; eventVariableIdCount < 4; eventVariableIdCount++) {
						if (eventVariableIdCount == 1) eventVariableId = 0;
						if (eventVariableIdCount == 2) eventVariableId = 1;
						if (eventVariableIdCount == 3) eventVariableId = 255;
					
						for (eventVariableValueCount = 1; eventVariableValueCount < 4; eventVariableValueCount++) {
							if (eventVariableValueCount == 1) eventVariableValue = 0;
							if (eventVariableValueCount == 2) eventVariableValue = 1;
							if (eventVariableValueCount == 3) eventVariableValue = 255;
						
							testCases.push({'nodeId':nodeId,'eventIndex':eventIndex, 'eventName':eventName, 'eventVariableId':eventVariableId, 'eventVariableValue':eventVariableValue});
						}
					}
				}
			}
		}
		return testCases;
	}

	itParam("UPDATE_EVENT_VARIABLE test nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventName ${value.eventName}, eventVariableId ${value.eventVariableId}, eventVariableValue ${value.eventVariableValue}",
		GetTestCase_UPDATE_EVENT_VARIABLE(), function (done, value) {
		if (debug) console.log("\nTest Client: UPDATE_EVENT_VARIABLE test");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('UPDATE_EVENT_VARIABLE', {
                "nodeId": value.nodeId,
                "eventIndex": value.eventIndex,
                "eventName": value.eventName,
                "eventVariableId": value.eventVariableId,
                "eventVariableValue": value.eventVariableValue
            })
		setTimeout(function(){
			 expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			 expected1 = ":SB780ND2" + value.eventName + decToHex(value.eventVariableId, 2) + decToHex(value.eventVariableValue, 2) + ";";
			 expect(mock_Cbus.getSendArray()[1]).to.equal(expected1);
			 expected2 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			 expect(mock_Cbus.getSendArray()[2]).to.equal(expected2);
			 expected3 = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventVariableId, 2) + ";";
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


	itParam("EVULN test nodeId ${value.nodeId} eventName ${value.eventName}",
		GetTestCase_EVULN(), function (done, value) {
		if (debug) console.log("\nTest Client: Request EVULN");
		mock_Cbus.clearSendArray();
		
		var event = {'event':value.eventName};

		websocket_Client.emit('EVULN', {
                "nodeId": value.nodeId,
				"eventName": event
				})
		setTimeout(function(){
			expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";		// NNLRN
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected1 = ":SB780N95" + value.eventName + ";";				// EVULN
			expect(mock_Cbus.getSendArray()[1]).to.equal(expected1);
			expected2 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";		// NNULN
			expect(mock_Cbus.getSendArray()[2]).to.equal(expected2);
			expected3 = ":SB780N57" + decToHex(value.nodeId, 4) + ";";		// NERD
			expect(mock_Cbus.getSendArray()[3]).to.equal(expected3);
			expected4 = ":SB780N58" + decToHex(value.nodeId, 4) + ";";		// RQEVN
			expect(mock_Cbus.getSendArray()[4]).to.equal(expected4);
			done();
		}, 100);
	})


	itParam("REQUEST_ALL_NODE_EVENTS test nodeId ${value.node}", TestCases_NodeId, function (done, value) {
		if (debug) console.log("\nTest Client: Request REQUEST_ALL_NODE_EVENTS");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_NODE_EVENTS', {"nodeId": value.node})
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
		

	function GetTestCase_NVSET_learn () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (variableIdCount = 1; variableIdCount < 4; variableIdCount++) {
				if (variableIdCount == 1) variableId = 0;
				if (variableIdCount == 2) variableId = 1;
				if (variableIdCount == 3) variableId = 255;
				
				for (variableValueCount = 1; variableValueCount < 4; variableValueCount++) {
					if (variableValueCount == 1) variableValue = 0;
					if (variableValueCount == 2) variableValue = 1;
					if (variableValueCount == 3) variableValue = 255;
					
					testCases.push({'nodeId':nodeId,'variableId':variableId, 'variableValue':variableValue});
				}
			}
		}
		return testCases;
	}
	


	itParam("NVSET-learn test nodeId ${value.nodeId} variableId ${value.variableId} variableValue ${value.variableValue}", GetTestCase_NVSET_learn(), function (done, value) {
		if (debug) console.log("\nTest Client: Request NVSET-learn");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('NVSET-learn', {"nodeId": value.nodeId, "variableId": value.variableId, "variableValue": value.variableValue})
		setTimeout(function(){
			expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected1 = ":SB780N96" + decToHex(value.nodeId, 4) + decToHex(value.variableId, 2)+ decToHex(value.variableValue, 2) + ";";
			expect(mock_Cbus.getSendArray()[1]).to.equal(expected1);
			expected2 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			expect(mock_Cbus.getSendArray()[2]).to.equal(expected2);
			expected3 = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.variableId, 2) + ";";
			expect(mock_Cbus.getSendArray()[3]).to.equal(expected3);
			expected4 = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
			expect(mock_Cbus.getSendArray()[4]).to.equal(expected4);
			done();
		}, 100);
	})
		
	function GetTestCase_REQUEST_ALL_EVENT_VARIABLES () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (eventIndexCount = 1; eventIndexCount < 4; eventIndexCount++) {
				if (eventIndexCount == 1) eventIndex = 0;
				if (eventIndexCount == 2) eventIndex = 1;
				if (eventIndexCount == 3) eventIndex = 255;
				
				for (eventVariableCountCtr = 1; eventVariableCountCtr < 4; eventVariableCountCtr++) {
					if (eventVariableCountCtr == 1) eventVariableCount = 0;
					if (eventVariableCountCtr == 2) eventVariableCount = 1;
					if (eventVariableCountCtr == 3) {
						if (nodeId == 65535 && eventIndex == 255) eventVariableCount = 255
						else eventVariableCount = 2
					}
					
					testCases.push({'nodeId':nodeId,'eventIndex':eventIndex, 'eventName':eventName, 'eventVariableCount':eventVariableCount});
				}
			}
		}
		return testCases;
	}
	

	itParam("REQUEST_ALL_EVENT_VARIABLES test nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventVariableCount ${value.eventVariableCount}", GetTestCase_REQUEST_ALL_EVENT_VARIABLES(), function (done, value) {
		if (debug) console.log("\nTest Client: REQUEST_ALL_EVENT_VARIABLES test");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_EVENT_VARIABLES', {"nodeId": value.nodeId, "eventIndex": value.eventIndex, "variables": value.eventVariableCount})
		setTimeout(function(){
			expect(mock_Cbus.getSendArray().length).to.equal(value.eventVariableCount+1);
			expected = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2)+ decToHex(0, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected_n = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2)+ decToHex(value.eventVariableCount, 2) + ";";
			expect(mock_Cbus.getSendArray()[value.eventVariableCount]).to.equal(expected_n);
			done();
		}, value.eventVariableCount*100 + 200);
	})
		

	function GetTestCase_REQUEST_ALL_NODE_PARAMETERS () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (parameterCountCtr = 1; parameterCountCtr < 4; parameterCountCtr++) {
				if (parameterCountCtr == 1) parameterCount = 0;
				if (parameterCountCtr == 2) parameterCount = 1;
				if (parameterCountCtr == 3) {
					if (nodeId == 65535) parameterCount = 255
					else parameterCount = 2
				}
				
				testCases.push({'nodeId':nodeId, 'parameterCount':parameterCount});
			}
		}
		return testCases;
	}
	

	itParam("REQUEST_ALL_NODE_PARAMETERS test nodeId ${value.nodeId} parameterCount ${value.parameterCount}", GetTestCase_REQUEST_ALL_NODE_PARAMETERS(), function (done, value) {
		if (debug) console.log("\nTest Client: REQUEST_ALL_NODE_PARAMETERS test");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_NODE_PARAMETERS', {"nodeId": value.nodeId, "parameters": value.parameterCount})
		setTimeout(function(){
			expect(mock_Cbus.getSendArray().length).to.equal(value.parameterCount+1);
			expected = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(0, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected_n = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(value.parameterCount, 2) + ";";
			expect(mock_Cbus.getSendArray()[value.parameterCount]).to.equal(expected_n);
			done();
		}, value.parameterCount*100 + 200);
	})
		

	function GetTestCase_REQUEST_ALL_NODE_VARIABLES () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (VariableCountCtr = 1; VariableCountCtr < 4; VariableCountCtr++) {
				if (VariableCountCtr == 1) variableCount = 0;
				if (VariableCountCtr == 2) variableCount = 1;
				if (VariableCountCtr == 3) {
					if (nodeId == 65535) variableCount = 255
					else variableCount = 2
				}
				
				testCases.push({'nodeId':nodeId,'eventIndex':eventIndex, 'variableCount':variableCount});
			}
		}
		return testCases;
	}
	

	

	itParam("REQUEST_ALL_NODE_VARIABLES test nodeId ${value.nodeId} variableCount ${value.variableCount}", GetTestCase_REQUEST_ALL_NODE_VARIABLES(), function (done, value) {
		if (debug) console.log("\nTest Client: REQUEST_ALL_NODE_VARIABLES test");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_NODE_VARIABLES', {"nodeId": value.nodeId, "variables": value.variableCount})
		setTimeout(function(){
			expect(mock_Cbus.getSendArray().length).to.equal(value.variableCount+1);
			expected = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(0, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected_n = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.variableCount, 2) + ";";
			expect(mock_Cbus.getSendArray()[value.variableCount]).to.equal(expected_n);
			done();
		}, value.variableCount*100 + 200);
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
*/

/*
	//
	// works, but overwrites default file, so commented out until decision about how to deal with this
	//
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
*/





	///////////////////////////////////////////////
	//
	// Test WebSocket Out Messages
	//
	///////////////////////////////////////////////



	function cbusError_TestCase () {
		var testCases = [];
		var nodeId;
		var eventName;
		for (NICount = 1; NICount < 4; NICount++) {
			if (NICount == 1) nodeId = 0;
			if (NICount == 2) nodeId = 1;
			if (NICount == 3) nodeId = 65535;
			
			for (ErrCodeCount = 1; ErrCodeCount < 13; ErrCodeCount++) {
				if (ErrCodeCount == 1) {
					errorId = 1;
					message = "Command Not Supported";
				}
				if (ErrCodeCount == 2) {
					errorId = 2;
					message = "Not in Learn Mode";
				}
				if (ErrCodeCount == 3) {
					errorId = 3;
					message = "Not in Setup Mode";
				}
				if (ErrCodeCount == 4) {
					errorId = 4;
					message = "Too Many Events";
				}
				if (ErrCodeCount == 5) {
					errorId = 5;
					message = "No Event";
				}
				if (ErrCodeCount == 6) {
					errorId = 6;
					message = "Invalid Event variable index";
				}
				if (ErrCodeCount == 7) {
					errorId = 7;
					message = "Invalid Event";
				}
				if (ErrCodeCount == 8) {
					errorId = 8;
					message = "Reserved";
				}
				if (ErrCodeCount == 9) {
					errorId = 9;
					message = "Invalid Parameter Index";
				}
				if (ErrCodeCount == 10) {
					errorId = 10;
					message = "Invalid Node Variable Index";
				}
				if (ErrCodeCount == 11) {
					errorId = 11;
					message = "Invalid Event Variable Value";
				}
				if (ErrCodeCount == 12) {
					errorId = 12;
					message = "Invalid Node Variable Value";
				}
			
				testCases.push({'nodeId':nodeId, 'errorId':errorId, 'message':message});
			}
		}
		return testCases;
	}

	itParam("cbusError test nodeId ${value.nodeId} errorId ${value.errorId}, message ${value.message}",
		cbusError_TestCase(), function (done, value) {
		if (debug) console.log("\nTest Client: Trigger cbusError");
		
			var cbusErrors = {};
			nodeId=0;
			errorId=1;
			let ref = value.nodeId.toString() + '-' + value.errorId.toString()
			let output = {}
			output['id'] = value.nodeId.toString() + '-' + value.errorId.toString()
			output['type'] = 'CBUS'
			output['Error'] = value.errorId
			output['Message'] = value.message
			output['node'] = value.nodeId
			output['count'] = 1
			//this.cbusErrors.push(output)
			cbusErrors[ref] = output
              
		cbusAdmin.clearCbusErrors();
		websocket_Client.on('cbusError', function (data) {cbusErrorData = data;});	
		mock_Cbus.outputCMDERR(value.nodeId, value.errorId);
		setTimeout(function(){
			expect(JSON.stringify(cbusErrorData)).to.equal(JSON.stringify(cbusErrors));
			done();
			}, 100);
	});


	it('cbusNoSupport test', function(done) {
		if (debug) console.log("\nTest Client: Trigger cbusNoSupport");
		
			var cbusNoSupport = {}
			let ref = "FC"
			let output = {}
			output['opCode'] = "FC"
            output['msg'] = {"message":":SB780NFC0001"}
            output['count'] = 1
            cbusNoSupport[ref] = output
		
		websocket_Client.on('cbusNoSupport', function (data) {cbusNoSupportData = data;});	
		mock_Cbus.outputUNSUPOPCODE(1);
		setTimeout(function(){
		expect(JSON.stringify(cbusNoSupportData)).to.equal(JSON.stringify(cbusNoSupport));
			done();
			}, 100);
	});


	function dccError_TestCase () {
		var testCases = [];
		for (dataCount = 1; dataCount < 4; dataCount++) {
			if (dataCount == 1) data = 0;
			if (dataCount == 2) data = 1;
			if (dataCount == 3) data = 65535;
			for (ErrCodeCount = 1; ErrCodeCount < 9; ErrCodeCount++) {
				if (ErrCodeCount == 1) {
					errorId = 1;
					message = "Loco Stack Full";
				}
				if (ErrCodeCount == 2) {
					errorId = 2;
					message = "Loco Address Taken";
				}
				if (ErrCodeCount == 3) {
					errorId = 3;
					message = "Session not present";
				}
				if (ErrCodeCount == 4) {
					errorId = 4;
					message = "Consist Empty";
				}
				if (ErrCodeCount == 5) {
					errorId = 5;
					message = "Loco Not Found";
				}
				if (ErrCodeCount == 6) {
					errorId = 6;
					message = "Can Bus Error";
				}
				if (ErrCodeCount == 7) {
					errorId = 7;
					message = "Invalid Request";
				}
				if (ErrCodeCount == 8) {
					errorId = 8;
					message = "Session Cancelled";
				}
				testCases.push({'data':data, 'errorId':errorId, 'message':message});
			}
		}
		return testCases;
	}

	itParam('dccError test data ${value.data}, errorId ${value.errorId}, message ${value.message}',	dccError_TestCase(), function (done, value) {
		if (debug) console.log("\nTest Client: Trigger dccError");
		let testCase = {
			'type': "DCC",
			'Error': value.errorId,
			'Message': value.message,
			'data': decToHex(value.data,4)
			}
		websocket_Client.on('dccError', function (data) {dccErrorData = data;});	
		mock_Cbus.outputERR(value.data, value.errorId);
		setTimeout(function(){
			expect(JSON.stringify(dccErrorData)).to.equal(JSON.stringify(testCase));
			done();
			}, 100);
	});

	function dccSessions_TestCase () {
		var testCases = [];
		for (sessionCount = 1; sessionCount < 4; sessionCount++) {
			if (sessionCount == 1) session = 0;
			if (sessionCount == 2) session = 1;
			if (sessionCount == 3) session = 255;

			testCases.push({'session': session, 'fn1': 1, 'fn2': 1, 	'functionNumber': 1});
			testCases.push({'session': session, 'fn1': 1, 'fn2': 2, 	'functionNumber': 2});
			testCases.push({'session': session, 'fn1': 1, 'fn2': 4, 	'functionNumber': 3});
			testCases.push({'session': session, 'fn1': 1, 'fn2': 8, 	'functionNumber': 4});
			testCases.push({'session': session, 'fn1': 2, 'fn2': 1, 	'functionNumber': 5});
			testCases.push({'session': session, 'fn1': 2, 'fn2': 2, 	'functionNumber': 6});
			testCases.push({'session': session, 'fn1': 2, 'fn2': 4, 	'functionNumber': 7});
			testCases.push({'session': session, 'fn1': 2, 'fn2': 8, 	'functionNumber': 8});
			testCases.push({'session': session, 'fn1': 3, 'fn2': 1, 	'functionNumber': 9});
			testCases.push({'session': session, 'fn1': 3, 'fn2': 2, 	'functionNumber': 10});
			testCases.push({'session': session, 'fn1': 3, 'fn2': 4, 	'functionNumber': 11});
			testCases.push({'session': session, 'fn1': 3, 'fn2': 8, 	'functionNumber': 12});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 1, 	'functionNumber': 13});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 2, 	'functionNumber': 14});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 4, 	'functionNumber': 15});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 8, 	'functionNumber': 16});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 16, 	'functionNumber': 17});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 32, 	'functionNumber': 18});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 64, 	'functionNumber': 19});
			testCases.push({'session': session, 'fn1': 4, 'fn2': 128, 	'functionNumber': 20});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 1, 	'functionNumber': 21});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 2, 	'functionNumber': 22});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 4, 	'functionNumber': 23});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 8, 	'functionNumber': 24});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 16, 	'functionNumber': 25});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 32, 	'functionNumber': 26});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 64, 	'functionNumber': 27});
			testCases.push({'session': session, 'fn1': 5, 'fn2': 128, 	'functionNumber': 28});
		}
		return testCases;
	}


	itParam('dccSessions test session ${value.session} fn1 ${value.fn1} fn2 ${value.fn2}', dccSessions_TestCase(), function(done, value) {
		if (debug) console.log("\nTest Client: Trigger dccSessions");
/*
			let dccSessions = {}
			dccSessions[value.session] = {}
            dccSessions[value.session].count = 0
			let func = `F${value.fn1}`
			dccSessions[value.session][func] = value.fn2
            let functionArray = []
			functionArray.push(value.functionNumber)
			dccSessions[value.session].functions = functionArray
*/
		websocket_Client.on('dccSessions', function (data) {dccSessionsData = data;});	
		mock_Cbus.outputDFUN(value.session, value.fn1, value.fn2)
		setTimeout(function(){
			// check expected fn2
			expect(dccSessionsData[value.session]['F' + value.fn1]).to.equal(value.fn2);
			if (debug) console.log("\nTest Client: dcc sessions test message data : " + JSON.stringify(dccSessionsData));
			done();
			}, 100);
	});


	function events_TestCase () {
		var testCases = [];
		var nodeId;
		var eventName;
		for (NICount = 1; NICount < 4; NICount++) {
			if (NICount == 1) nodeId = 0;
			if (NICount == 2) nodeId = 1;
			if (NICount == 3) nodeId = 65535;
			
			for (EventIdCount = 1; EventIdCount < 4; EventIdCount++) {
			if (EventIdCount == 1) eventId = 0;
			if (EventIdCount == 2) eventId = 1;
			if (EventIdCount == 3) eventId = 65535;
			
			testCases.push({'nodeId':nodeId, 'eventId':eventId, 'status':'off'});
			testCases.push({'nodeId':nodeId, 'eventId':eventId, 'status':'on'});
			}
		}
		return testCases;
	}

	itParam('events test nodeId ${value.nodeId} eventId ${value.eventId} status ${value.status}', events_TestCase(), function(done, value) {
		if (debug) console.log("\nTest Client: Trigger events");
		websocket_Client.on('events', function (data) {eventData = data;});	
		if (value.status == 'on') mock_Cbus.outputACON(value.nodeId, value.eventId);
		if (value.status == 'off') mock_Cbus.outputACOF(value.nodeId, value.eventId);
		setTimeout(function(){
			if (debug) console.log("\nTest Client: event test message data : " + JSON.stringify(eventData));
			// check status for the specific nodeId & eventId exists and is correct status
			let status = "";
			eventData.forEach(function(item, index) {
				if (item.nodeId == value.nodeId && item.eventId == value.eventId) {status = item.status;}
			})
			expect(status).to.equal(value.status);
			done();
			}, 100);
	});


	it('node test', function(done) {
		if (debug) console.log("\nTest Client: Trigger nodes");
		nodeData = ""
		data = ""
		websocket_Client.on('nodes', function (data) {
			nodeData = data;
			if (debug) console.log("\nTest Client: node test message data : " + JSON.stringify(nodeData));
			});	
		mock_Cbus.outputPNN(0);
		setTimeout(function(){
			expect(nodeData[0].module).to.equal("CANACC8");
			done();
			}, 100);
	});


})
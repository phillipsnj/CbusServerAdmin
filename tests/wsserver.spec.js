const expect = require('chai').expect;
var winston = require('./config/winston_test.js');
const fs = require('fs');
const jsonfile = require('jsonfile')


const websocket_Server = require('./../wsserver');
const http = require('http');

const file = 'config/nodeConfig.json'

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

function createConfigs(layoutName) {
            var directory = "./config/" + layoutName
            
            // check if directory exists
            if (fs.existsSync(directory)) {
                winston.debug({message: `CHANGE_LAYOUT: Directory exists`});
            } else {
                winston.debug({message: `CHANGE_LAYOUT: Directory not found - creating new one`});
                fs.mkdir(directory, function(err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log("New directory successfully created.")
                  }
                })            
            }
            const emptyNodeConfig = {"nodes": {}, "events": {}}
            jsonfile.writeFileSync(directory + "/nodeConfig.json", emptyNodeConfig, {spaces: 2, EOL: '\r\n'})
            const emptyLayoutDetails = {"layoutDetails": { "title": "Test", "subTitle": "test", "nextNodeId": 800}, 
                                          "nodeDetails": {}, "eventDetails": {}}
            jsonfile.writeFileSync(directory + "/layoutDetails.json", emptyLayoutDetails, {spaces: 2, EOL: '\r\n'})
            return directory
}


describe('Websocket server tests', function(){
	let http_Server = undefined;
	let websocket_Client = undefined;

	let mock_Cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
    var layoutName = 'testLayout'
    createConfigs(layoutName)
	
    
	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '----------------------------- wsserver tests -------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});

		http_Server = http.createServer(() => console.log(" -/- "));
		http_Server.listen(7575, () => { winston.info({message: "wsserver listening on 7575"}); });
	
		websocket_Server(layoutName, http_Server, NET_ADDRESS, NET_PORT);

		websocket_Client = io.connect('http://localhost:7575/', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
		
        websocket_Client.on('connect', function() {
			winston.info({message: 'wwserver client connected...'});
            done();
        });
		
        websocket_Client.on('disconnect', function() {
			winston.info({message: 'wwserver client disconnected...'});
        });
		

	});

    
    beforeEach(function() {
   		winston.info({message: ' '});   // blank line to separate tests
        mock_Cbus.clearSendArray()
    })
    

	after(function() {
		if (websocket_Client.connected)
		{
			winston.info({message: 'Close wwserver test Client'});
			websocket_Client.close();
		}
		if(http_Server) {
			winston.info({message: 'Close http server'});
			http_Server.close(() => { console.log('CLOSING WSServer'); http_Server.unref(); done(); });
		}
		
	});


		var TestCases_NodeId = 		[	{ node: 0 },
										{ node: 1 },
										{ node: 65535 },
										];


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

	function GetTestCase_ACCESSORY_LONG () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (eventIdCount = 1; eventIdCount < 4; eventIdCount++) {
				if (eventIdCount == 1) eventId = 0;
				if (eventIdCount == 2) eventId = 1;
				if (eventIdCount == 3) eventId = 65535;
				
				testCases.push({'nodeId':nodeId, 'eventId':eventId});
			}
		}
		return testCases;
	}


	itParam("ACCESSORY_LONG_OFF test nodeId ${value.nodeId} event ${value.eventId}", GetTestCase_ACCESSORY_LONG(), function (done, value) {
		winston.info({message: 'wsserver Test: START ACCESSORY_LONG_OFF test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('ACCESSORY_LONG_OFF', {"nodeId": value.nodeId, "eventId": value.eventId})
		setTimeout(function(){
			expected = ":SB780N91" + decToHex(value.nodeId, 4) + decToHex(value.eventId, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 20);
	})

		
	itParam("ACCESSORY_LONG_ON test nodeId ${value.nodeId} event ${value.eventId}", GetTestCase_ACCESSORY_LONG(), function (done, value) {
		winston.info({message: 'wsserver Test: START ACCESSORY_LONG_ON test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('ACCESSORY_LONG_ON', {"nodeId": value.nodeId, "eventId": value.eventId})
		setTimeout(function(){
			expected = ":SB780N90" + decToHex(value.nodeId, 4) + decToHex(value.eventId, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 20);
	})


	function GetTestCase_ACCESSORY_SHORT () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (deviceNumberCount = 1; deviceNumberCount < 4; deviceNumberCount++) {
				if (deviceNumberCount == 1) deviceNumber = 0;
				if (deviceNumberCount == 2) deviceNumber = 1;
				if (deviceNumberCount == 3) deviceNumber = 65535;
				
				testCases.push({'nodeId':nodeId, 'deviceNumber':deviceNumber});
			}
		}
		return testCases;
	}


	itParam("ACCESSORY_SHORT_OFF test nodeId ${value.nodeId} deviceNumber ${value.deviceNumber}", GetTestCase_ACCESSORY_SHORT(), function (done, value) {
		winston.info({message: 'wsserver Test: START ACCESSORY_SHORT_OFF test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('ACCESSORY_SHORT_OFF', {"nodeId": value.nodeId, "deviceNumber": value.deviceNumber})
		setTimeout(function(){
			expected = ":SB780N99" + decToHex(value.nodeId, 4) + decToHex(value.deviceNumber, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 20);
	})


	itParam("ACCESSORY_SHORT_ON test nodeId ${value.nodeId} deviceNumber ${value.deviceNumber}", GetTestCase_ACCESSORY_SHORT(), function (done, value) {
		winston.info({message: 'wsserver Test: START ACCESSORY_SHORT_ON test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('ACCESSORY_SHORT_ON', {"nodeId": value.nodeId, "deviceNumber": value.deviceNumber})
		setTimeout(function(){
			expected = ":SB780N98" + decToHex(value.nodeId, 4) + decToHex(value.deviceNumber, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 20);
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
		winston.info({message: 'wsserver Test: START UPDATE_EVENT_VARIABLE test: ' + JSON.stringify(value)});
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
		}, 50);
	})


	function GetTestCase_REMOVE_EVENT () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (eventNameCount = 1; eventNameCount < 4; eventNameCount++) {
				if (eventNameCount == 1) eventName = '00000000';
				if (eventNameCount == 2) eventName = '00000001';
				if (eventNameCount == 3) eventName = 'FFFFFFFF';
				
				testCases.push({'nodeId':nodeId, 'eventName':eventName});
			}
		}
		return testCases;
	}

	itParam("REMOVE_EVENT test nodeId ${value.nodeId} eventName ${value.eventName}",
		GetTestCase_REMOVE_EVENT(), function (done, value) {
		winston.info({message: 'wsserver Test: START REMOVE_EVENT test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		
		websocket_Client.emit('REMOVE_EVENT', {
                "nodeId": value.nodeId,
				"eventName": value.eventName
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
		}, 20);
	})


	itParam("REQUEST_ALL_NODE_EVENTS test nodeId ${value.node}", TestCases_NodeId, function (done, value) {
		winston.info({message: 'wsserver Test: REQUEST_ALL_NODE_EVENTS test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_NODE_EVENTS', {"nodeId": value.node})
		setTimeout(function(){
			expected = ":SB780N57" + decToHex(value.node, 4) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 10);
	})
		

	function GetTestCase_REQUEST_NODE_VARIABLE () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (variableIdCount = 1; variableIdCount < 4; variableIdCount++) {
				if (variableIdCount == 1) variableId = 0;
				if (variableIdCount == 2) variableId = 1;
				if (variableIdCount == 3) variableId = 255;
				
				testCases.push({'nodeId':nodeId,'variableId':variableId});
			}
		}
		return testCases;
	}
	

	itParam("REQUEST_NODE_VARIABLE test nodeId ${value.node} variableId ${value.variableId}", GetTestCase_REQUEST_NODE_VARIABLE(), function (done, value) {
		winston.info({message: 'wsserver Test: START REQUEST_NODE_VARIABLE test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_NODE_VARIABLE', {"nodeId": value.node, "variableId": value.variableId});
		setTimeout(function(){
			expected = ":SB780N71" + decToHex(value.node, 4) + decToHex(value.variableId, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 10);
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
	


	itParam("UPDATE_NODE_VARIABLE_IN_LEARN_MODE test nodeId ${value.nodeId} variableId ${value.variableId} variableValue ${value.variableValue}", GetTestCase_NVSET_learn(), function (done, value) {
		winston.info({message: 'wsserver Test: START UPDATE_NODE_VARIABLE_IN_LEARN_MODE test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('UPDATE_NODE_VARIABLE_IN_LEARN_MODE', {"nodeId": value.nodeId, "variableId": value.variableId, "variableValue": value.variableValue})
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
		}, 50);
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
					
					testCases.push({'nodeId':nodeId,'eventIndex':eventIndex, 'eventVariableCount':eventVariableCount});
				}
			}
		}
		return testCases;
	}
	

	itParam("REQUEST_ALL_EVENT_VARIABLES test nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventVariableCount ${value.eventVariableCount}", GetTestCase_REQUEST_ALL_EVENT_VARIABLES(), function (done, value) {
		winston.info({message: 'wsserver Test: START REQUEST_ALL_EVENT_VARIABLES test: ' + JSON.stringify(value)});
		let timeoutDelay = 1;
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_EVENT_VARIABLES', {
				"nodeId": value.nodeId, 
				"eventIndex": value.eventIndex, 
				"variables": value.eventVariableCount, 
				"delay": timeoutDelay})
		setTimeout(function(){
			expect(mock_Cbus.getSendArray().length).to.equal(value.eventVariableCount+1);
			expected = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2)+ decToHex(0, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected_n = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2)+ decToHex(value.eventVariableCount, 2) + ";";
			expect(mock_Cbus.getSendArray()[value.eventVariableCount]).to.equal(expected_n);
			done();
		}, value.eventVariableCount*timeoutDelay + 50);
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
		winston.info({message: 'wsserver Test: START REQUEST_ALL_NODE_PARAMETERS test: ' + JSON.stringify(value)});
		let timeoutDelay = 5;
		mock_Cbus.clearSendArray();
		websocket_Client.emit('REQUEST_ALL_NODE_PARAMETERS', {
				"nodeId": value.nodeId, 
				"parameters": value.parameterCount, 
				"delay": timeoutDelay})
		setTimeout(function(){
			expect(mock_Cbus.getSendArray().length).to.equal(value.parameterCount+1);
			expected = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(0, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected_n = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(value.parameterCount, 2) + ";";
			expect(mock_Cbus.getSendArray()[value.parameterCount]).to.equal(expected_n);
			done();
		}, value.parameterCount*timeoutDelay + 50);
	})
		

	function GetTestCase_REQUEST_ALL_NODE_VARIABLES () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (VariableCountCtr = 1; VariableCountCtr < 3; VariableCountCtr++) {
				if (VariableCountCtr == 1) variableCount = 1;
				if (VariableCountCtr == 2) {
					if (nodeId == 65535) variableCount = 255
					else variableCount = 2
				}
				
				testCases.push({'nodeId':nodeId,'eventIndex':eventIndex, 'variableCount':variableCount});
			}
		}
		return testCases;
	}
	

	

	itParam("REQUEST_ALL_NODE_VARIABLES test nodeId ${value.nodeId} variableCount ${value.variableCount}", GetTestCase_REQUEST_ALL_NODE_VARIABLES(), function (done, value) {
		winston.info({message: 'wsserver Test: START REQUEST_ALL_NODE_VARIABLES test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		var timeoutDelay = 1;
		websocket_Client.emit('REQUEST_ALL_NODE_VARIABLES', {"nodeId": value.nodeId, "variables": value.variableCount, "delay": timeoutDelay})
		setTimeout(function(){
			expect(mock_Cbus.getSendArray().length).to.equal(value.variableCount);
			expected = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(1, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			expected_n = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.variableCount, 2) + ";";
			expect(mock_Cbus.getSendArray()[value.variableCount-1]).to.equal(expected_n);
			done();
		}, value.variableCount*timeoutDelay + 50);
	})
		

	function GetTestCase_RQNPN () {
		var testCases = [];
		for (nodeIdCount = 1; nodeIdCount < 4; nodeIdCount++) {
			if (nodeIdCount == 1) nodeId = 0;
			if (nodeIdCount == 2) nodeId = 1;
			if (nodeIdCount == 3) nodeId = 65535;
			
			for (parameterIdCount = 1; parameterIdCount < 4; parameterIdCount++) {
				if (parameterIdCount == 1) parameterId = 0;
				if (parameterIdCount == 2) parameterId = 1;
				if (parameterIdCount == 3) parameterId = 255;
				
				testCases.push({'nodeId':nodeId, 'parameterId':parameterId});
			}
		}
		return testCases;
	}
	

	itParam("RQNPN test nodeId ${value.nodeId} param ${value.parameterId}", GetTestCase_RQNPN(), function (done, value) {
		winston.info({message: 'wsserver Test: RQNPN test: ' + JSON.stringify(value)});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('RQNPN', {"nodeId": value.nodeId, "parameter": value.parameterId})
		setTimeout(function(){
			expected = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(value.parameterId, 2) + ";";
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 10);
	})
		

	it('QUERY_ALL_NODES test', function(done) {
		winston.info({message: 'wsserver Test: QUERY_ALL_NODES test'});
		mock_Cbus.clearSendArray();
		websocket_Client.emit('QUERY_ALL_NODES', '');
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(":SB780N0D;");
			done();
			}, 10);
	});


	function GetTestCase_TEACH_EVENT () {
		var testCases = [];
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


	itParam("TEACH_EVENT test nodeId ${value.nodeId} eventName ${value.eventName}, eventId ${value.eventId}, eventVal ${value.eventVal}",
		GetTestCase_TEACH_EVENT(), function (done, value) {
		winston.info({message: 'wsserver Test: START TEACH_EVENT test:' + JSON.stringify(value)});
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
		}, 20);
	})


/*
	itParam("CLEAR_NODE_EVENTS test nodeId ${value.node}", TestCases_NodeId, function (done, value) {
		if (debug) console.log("\nTest Client: START CLEAR_NODE_EVENTS");
		mock_Cbus.clearSendArray();
		websocket_Client.emit('CLEAR_NODE_EVENTS', {"nodeId": value.node})
		setTimeout(function(){
			expected = value.node;
			expect(mock_Cbus.getSendArray()[0]).to.equal(expected);
			done();
		}, 100);
	})
		
		
	it('REFRESH_EVENTS test', function(done) {
		if (debug) console.log("\nTest Client: START REFRESH_EVENTS");
		mock_Cbus.clearSendArray();
		let testCase = "REFRESH_EVENTS";
		websocket_Client.emit('REFRESH_EVENTS')
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(testCase);
			done();
			}, 100);
	});
*/


	it('REQUEST_VERSION test', function(done) {
		winston.info({message: 'wsserver Test: START REQUEST_VERSION test'});
		mock_Cbus.clearSendArray();
			let testCase = {
				'major': '1',
				'minor': '0',
				'patch': '14',
				}
		websocket_Client.on('VERSION', function (data) {
			versionData = data;
			winston.info({message: 'wsserver Test: REQUEST_VERSION test : ' + JSON.stringify(versionData)});
			});	
		websocket_Client.emit('REQUEST_VERSION')
		setTimeout(function(){
			expect(JSON.stringify(versionData)).to.equal(JSON.stringify(testCase));
			websocket_Client.off('VERSION');
			done();
			}, 10);
	});


	it('PROGRAM_NODE test', function(done) {
		winston.info({message: 'wsserver Test: START PROGRAM_NODE test'});
        downloadDataArray = []
		websocket_Client.on('PROGRAM_NODE', function (data) {
			downloadDataArray.push(data);
			winston.warn({message: 'wsserver Test: PROGRAM_NODE ' + JSON.stringify(data)});
			});	
            
            // create base64 encoded version of intel hex file
            let intelHexString = fs.readFileSync('./tests/test_firmware/shortFile.HEX');
            var encoded = intelHexString.toString('base64')
            
		websocket_Client.emit('PROGRAM_NODE', {
                "nodeNumber": 300,
                "cpuType": 1,
                "flags": 3,
                "encodedIntelHex": encoded
            })
		setTimeout(function(){
            expect(downloadDataArray[downloadDataArray.length-1].status).to.equal('Success', 'program event status');
            expect(downloadDataArray[downloadDataArray.length-1].text).to.equal('Success: programing completed', 'program event text');
            websocket_Client.removeAllListeners()
            done();
			}, 2000);
	});


	it('PROGRAM_BOOT_MODE test', function(done) {
		winston.info({message: 'wsserver Test: START PROGRAM_BOOT_MODE test'});
        downloadDataArray = []
		websocket_Client.on('PROGRAM_NODE', function (data) {
			downloadDataArray.push(data);
			winston.warn({message: 'wsserver Test: PROGRAM_BOOT_MODE ' + JSON.stringify(data)});
			});	
            
            // create base64 encoded version of intel hex file
            let intelHexString = fs.readFileSync('./tests/test_firmware/shortFile.HEX');
            var encoded = intelHexString.toString('base64')
            
		websocket_Client.emit('PROGRAM_BOOT_MODE', {
                "cpuType": 1,
                "flags": 3,
                "encodedIntelHex": encoded
            })
		setTimeout(function(){
            expect(downloadDataArray[downloadDataArray.length-1].status).to.equal('Success', 'program event status');
            expect(downloadDataArray[downloadDataArray.length-1].text).to.equal('Success: programing completed', 'program event');
            websocket_Client.removeAllListeners()
			done();
			}, 2000);
	});


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
		winston.info({message: 'wsserver Test: START cbusError test: ' + JSON.stringify(value)});
		
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
			cbusErrors[ref] = output
              
		websocket_Client.emit('CLEAR_CBUS_ERRORS')
		websocket_Client.on('cbusError', function (data) {
			cbusErrorData = data;
			winston.info({message: 'wsserver Test: cbusError test - data : ' + JSON.stringify(cbusErrorData)});
			});	
		mock_Cbus.outputCMDERR(value.nodeId, value.errorId);
		setTimeout(function(){
			expect(JSON.stringify(cbusErrorData)).to.equal(JSON.stringify(cbusErrors));
			websocket_Client.off('cbusError');
			done();
			}, 10);
	});


	it('cbusNoSupport test', function(done) {
		winston.info({message: 'wsserver Test: START cbusNoSupport test:'});
		
			let expected = {}
			expected['opCode'] = "FC"
            expected['msg'] = {"message":":SB780NFC0001;"}
            expected['count'] = 1
		
		websocket_Client.once('cbusNoSupport', function (data) {
			cbusNoSupportData = data;
			winston.info({message: 'wsserver Test: cbusNoSupport test - data : ' + JSON.stringify(cbusNoSupportData)});
			});	
		mock_Cbus.outputUNSUPOPCODE(1);
		setTimeout(function(){
			expect(JSON.stringify(cbusNoSupportData['FC'])).to.equal(JSON.stringify(expected));
			done();
			}, 10);
	});


	function dccError_TestCase () {
		var testCases = [];
		for (D1Count = 1; D1Count < 4; D1Count++) {
			if (D1Count == 1) data1 = 0;
			if (D1Count == 2) data1 = 1;
			if (D1Count == 3) data1 = 255;
            for (D2Count = 1; D2Count < 4; D2Count++) {
                if (D2Count == 1) data2 = 0;
                if (D2Count == 2) data2 = 1;
                if (D2Count == 3) data2 = 255;
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
                    testCases.push({'data1':data1, 'data2':data2, 'errorId':errorId, 'message':message});
                }
            }
		}
		return testCases;
	}

	itParam('dccError test data1 ${value.data1}, data2 ${value.data2}, errorId ${value.errorId}, message ${value.message}',	dccError_TestCase(), function (done, value) {
		winston.info({message: 'wsserver Test: START dccError test ' + JSON.stringify(value)});
		let testCase = {
			'type': "DCC",
			'Error': value.errorId,
			'Message': value.message,
			'data': decToHex(value.data1,2) + decToHex(value.data2,2)
			}
		websocket_Client.on('dccError', function (data) {
			dccErrorData = data;
			winston.info({message: 'wsserver Test: dccError test - data : ' + JSON.stringify(dccErrorData)});
			});	
		mock_Cbus.outputERR(value.data1, value.data2, value.errorId);
		setTimeout(function(){
			expect(JSON.stringify(dccErrorData)).to.equal(JSON.stringify(testCase));
			websocket_Client.off('dccError');
			done();
			}, 10);
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
		winston.info({message: 'wsserver Test: START dccSessions test ' + JSON.stringify(value)});
		websocket_Client.on('dccSessions', function (data) {
			dccSessionsData = data;
			winston.info({message: 'wsserver Test: dccSessions test - message data : ' + JSON.stringify(dccSessionsData)});
			});	
		mock_Cbus.outputDFUN(value.session, value.fn1, value.fn2)
		setTimeout(function(){
			// check expected fn2
			expect(dccSessionsData[value.session]['F' + value.fn1]).to.equal(value.fn2);
			websocket_Client.off('dccSessions');
			done();
			}, 10);
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
		winston.info({message: 'wsserver Test: START events test  ' + JSON.stringify(value)});
		websocket_Client.emit('CLEAR_NODE_EVENTS', {"nodeId": value.nodeId});
		websocket_Client.on('events', function (data) {
			eventData = data;
			winston.info({message: 'wsserver Test: events test - message data : ' + JSON.stringify(eventData)});
			});	
		if (value.status == 'on') mock_Cbus.outputACON(value.nodeId, value.eventId);
		if (value.status == 'off') mock_Cbus.outputACOF(value.nodeId, value.eventId);
		setTimeout(function(){
			// check status for the specific nodeId & eventId exists and is correct status
			let status = "";
			eventData.forEach(function(item, index) {
				if (item.nodeId == value.nodeId && item.eventId == value.eventId) {status = item.status;}
			})
			expect(status).to.equal(value.status);
			websocket_Client.off('events');
			done();
			}, 20);
	});


	it('node test', function(done) {
		winston.info({message: 'wsserver: node test'});
		websocket_Client.on('nodes', function (data) {
			nodeData = data;
			winston.info({message: 'wsserver: START node test - message data : ' + JSON.stringify(nodeData)});
			});	
		mock_Cbus.outputPNN(0);
		setTimeout(function(){
			expect(nodeData[0].module).to.equal("CANACC8");
			websocket_Client.off('nodes');
			done();
			}, 10);
	});


	it('requestNodeNumber test', function(done) {
		winston.info({message: 'wsserver: requestNodeNumber test'});
		mock_Cbus.clearSendArray();
		websocket_Client.on('layoutDetails', function (data) {
			nodeData = data;
			winston.info({message: 'wsserver: START requestNodeNumber test - message data : ' + JSON.stringify(nodeData)});
			});	
		mock_Cbus.outputRQNN(0);
		setTimeout(function(){
			// check that nextNodeId is +1 from the new nodeId transmitted as a result of the request
			var newNodeId = parseInt(mock_Cbus.getSendArray()[0].substr(9, 4), 16);
			expect(nodeData.layoutDetails.nextNodeId).to.equal(newNodeId + 1);
			websocket_Client.off('nodes');
			done();
			}, 50);
	});


})
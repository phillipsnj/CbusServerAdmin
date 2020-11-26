const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');

const cbusLib = require('./../merg/cbusLibrary.js')

const NET_PORT = 5550;
const NET_ADDRESS = "127.0.0.1"
const admin = require('./../merg/mergAdminNode.js')
const file = 'config/nodeConfig.json'
const Mock_Cbus = require('./mock_CbusNetwork.js')

function decToHex(num, len) {return parseInt(num).toString(16).toUpperCase().padStart(len, '0');}

describe('mergAdminNode tests', function(){
	let mock_Cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
	let node = new admin.cbusAdmin(file, NET_ADDRESS,NET_PORT);

	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '------------------------ mergAdminNode tests -------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});

        // request nodes & then allow some time to process them
        winston.info({message: '..................................................'});
        winston.info({message: 'Start by querying all nodes to populate structures'});
        winston.info({message: '..................................................'});
        node.cbusSend(node.QNN())
		setTimeout(function(){
            winston.info({message: '............................'});
            winston.info({message: 'Query completed.............'});
            winston.info({message: '............................'});
			done();
		}, 20);
	});
    
    beforeEach(function() {
        mock_Cbus.clearSendArray()
    })

	after(function() {
		mock_Cbus.stopServer();
		winston.info({message: 'Close mergAdminNode test Client'});

	});																										
	
	//
    // Start of actual tests................
    // arranged in opCode order
    //

    // 00 ACK
    //
	it('ACK test', function(done) {
		winston.info({message: 'mergAdminNode Test: ACK test'});
		mock_Cbus.outputACK();
        done();
	});


    // 0D QNN encoding test
    //
	it('QNN encoding test', function() {
		winston.info({message: 'mergAdminNode test: BEGIN QNN test '});
		expect(node.QNN()).to.equal(":SB780N0D;");

	});


    // 10 RQNP encoding test
    //
	it("RQNP encoding test", function () {
		winston.info({message: 'mergAdminNode test: BEGIN RQNP test '});
		expected = ":SB780N10" + ";";
		expect(node.RQNP()).to.equal(expected);
	})


    // 21 KLOC test cases
    //
	function GetTestCase_KLOC () {
		var testCases = [];
		for (S = 1; S < 4; S++) {
			if (S == 1) session = 0;
			if (S == 2) session = 1;
			if (S == 3) session = 255;
			testCases.push({'session':session});
		}
		return testCases;
	}
    
    // 21 KLOC
    //
	itParam("KLOC test session ${value.session}", GetTestCase_KLOC(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN KLOC test ' + JSON.stringify(value)});
        node.dccSessions = []   // clear any pre existing session from previous tests
        node.on('dccSessions', function tmp(data) {
			dccSessionsData = data;
			winston.info({message: 'mergAdminNode Test: KLOC test - message data : ' + JSON.stringify(dccSessionsData)});
            node.removeListener('dccSessions', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputKLOC(value.session);
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(cbusLib.encodeQLOC(value.session));
            expect(dccSessionsData[value.session].status).to.equal('In Active');
			done();
		}, 10);
	})


    // 22 QLOC test cases
    //
	function GetTestCase_QLOC () {
		var testCases = [];
		for (S = 1; S < 4; S++) {
			if (S == 1) session = 0;
			if (S == 2) session = 1;
			if (S == 3) session = 255;
			testCases.push({'session':session});
		}
		return testCases;
	}
    
    // 22 QLOC encoding
    //
	itParam("QLOC encoding test session ${value.session}", GetTestCase_QLOC(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN QLOC test ' + JSON.stringify(value)});
		expected = ":SB780N22" + decToHex(value.session, 2) + ";";
		expect(node.QLOC(value.session)).to.equal(expected);
	})

    // 23 DKEEP test cases
    //
	function GetTestCase_DKEEP () {
		var testCases = [];
		for (S = 1; S < 4; S++) {
			if (S == 1) session = 0;
			if (S == 2) session = 1;
			if (S == 3) session = 255;
			testCases.push({'session':session});
		}
		return testCases;
	}
    
    // 23 DKEEP
    //
	itParam("DKEEP test session ${value.session}", GetTestCase_DKEEP(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN DKEEP test ' + JSON.stringify(value)});
        node.dccSessions = []   // clear any pre existing session from previous tests
        node.on('dccSessions', function tmp(data) {
			dccSessionsData = data;
			winston.info({message: 'mergAdminNode Test: KLOC test - message data : ' + JSON.stringify(dccSessionsData)});
            node.removeListener('dccSessions', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputDKEEP(value.session);
		setTimeout(function(){
			expect(mock_Cbus.getSendArray()[0]).to.equal(cbusLib.encodeQLOC(value.session));
            expect(dccSessionsData[value.session].status).to.equal('Active');
			done();
		}, 10);
	})


    // 47 DSPD test cases
    //
	function GetTestCase_DSPD () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (speedIndex = 1; speedIndex < 4; speedIndex++) {
				if (speedIndex == 1) speed = 0;
				if (speedIndex == 2) speed = 1;
				if (speedIndex == 3) speed = 127;
				for (directionIndex = 1; directionIndex < 3; directionIndex++) {
					if (directionIndex == 1) direction = 'Forward';
					if (directionIndex == 2) direction = 'Reverse';
					testCases.push({'session':session, 'speed':speed, 'direction':direction});
				}
			}
		}
		return testCases;
	}
    
    // 47 DSPD
    //
	itParam("DSPD test session ${value.session} speed ${value.speed} direction ${value.direction}", GetTestCase_DSPD(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN DSPD test ' + JSON.stringify(value)});
        node.on('dccSessions', function tmp(data) {
			dccSessionsData = data;
			winston.info({message: 'mergAdminNode Test: DSPD test - message data : ' + JSON.stringify(dccSessionsData)});
            node.removeListener('dccSessions', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputDSPD(value.session, value.speed, value.direction);
		setTimeout(function(){
            expect(dccSessionsData[value.session].speed).to.equal(value.speed);
            expect(dccSessionsData[value.session].direction).to.equal(value.direction);
			done();
		}, 10);
	})


    // 50 RQNN test cases
    //
	function GetTestCase_RQNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			testCases.push({'nodeNumber':nodeNumber});
		}
		return testCases;
	}
    
    // 50 RQNN
    //
	itParam("RQNN test nodeNumber ${value.nodeNumber}", GetTestCase_RQNN(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN RQNN test ' + JSON.stringify(value)});
        var eventReceived = false;
        node.on('requestNodeNumber', function tmp(data) {
            eventReceived = true
			winston.info({message: 'mergAdminNode Test: RQNN test - event received : ' + eventReceived});
            node.removeListener('requestNodeNumber', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputRQNN(value.nodeNumber);
		setTimeout(function(){
            expect(eventReceived).to.be.true
			done();
		}, 10);
	})

    // 52 NNACK
    
    // 53 NNLRN test cases
    //
	function GetTestCase_NNLRN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}
    
    // 53 NNLRN encoding
    //
	itParam("NNLRN encoding test nodeId ${value.nodeId}", GetTestCase_NNLRN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NNLRN test ' + JSON.stringify(value)});
		expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
		expect(node.NNLRN(value.nodeId)).to.equal(expected);
	})

    // 53 NNLRN invalid test cases
    //
	function GetTestCase_NNLRN_invalid () {
		var testCases = [];
		for (NN = 0; NN < 4; NN++) {
			if (NN == 0) nodeId = -Number.MAX_VALUE;
			if (NN == 1) nodeId = -1;
			if (NN == 2) nodeId = 65536;
			if (NN == 3) nodeId = Number.MAX_VALUE;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}

    // 53 NNLRN invalid tests
    //
	itParam("NNLRN test invalid nodeId ${value.nodeId}", GetTestCase_NNLRN_invalid(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NNLRN invalid test ' + JSON.stringify(value)});
		var expected;	// leave undefined
		expect(node.NNLRN(value.nodeId)).to.equal(expected);
	})


    // 54 NNULN test cases
    //
	function GetTestCase_NNULN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}

    // 54 NNULN encoding
    //
	itParam("NNULN encoding test: nodeId ${value.nodeId}", GetTestCase_NNULN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NNULN test ' + JSON.stringify(value)});
		expected = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
		expect(node.NNULN(value.nodeId)).to.equal(expected);
	})


    // 57 NERD test cases
    //
	function GetTestCase_NERD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}
    
    // 57 NERD encoding
    //
	itParam("NERD encoding test: nodeId ${value.nodeId}", GetTestCase_NERD(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NERD test ' + JSON.stringify(value)});
		expected = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
		expect(node.NERD(value.nodeId)).to.equal(expected);
	})


    // 58 RQEVN test cases
    //
	function GetTestCase_RQEVN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}

    // 58 RQEVN encoding test
    //
	itParam("RQEVN encoding test: nodeId ${value.nodeId}", GetTestCase_RQEVN(),  function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN RQEVN test ' + JSON.stringify(value)});
		expected = ":SB780N58" + decToHex(value.nodeId, 4) + ";";
		expect(node.RQEVN(value.nodeId)).to.equal(expected);
	})


    // 59 WRACK



    // 60 DFUN test cases
    //
	function GetTestCase_DFUN () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (Fn1Index = 1; Fn1Index < 4; Fn1Index++) {
				if (Fn1Index == 1) Fn1 = 0;
				if (Fn1Index == 2) Fn1 = 1;
				if (Fn1Index == 3) Fn1 = 255;
				for (Fn2Index = 1; Fn2Index < 4; Fn2Index++) {
					if (Fn2Index == 1) Fn2 = 0;
					if (Fn2Index == 2) Fn2 = 1;
					if (Fn2Index == 3) Fn2 = 255;
					testCases.push({'session':session, 'Fn1':Fn1, 'Fn2':Fn2});
				}
			}
		}
		return testCases;
	}
    
    // 60 DFUN
    //
	itParam("DFUN test: session ${value.session} Fn1 ${value.Fn1} Fn2 ${value.Fn2}", GetTestCase_DFUN(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN DFUN test ' + JSON.stringify(value)});
        node.on('dccSessions', function tmp(data) {
			dccSessionsData = data;
			winston.info({message: 'mergAdminNode Test: DFUN test - message data : ' + JSON.stringify(dccSessionsData)});
            node.removeListener('dccSessions', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputDFUN(value.session, value.speed, value.direction);
		setTimeout(function(){
//            expect(dccSessionsData[value.session].speed).to.equal(value.speed);
//            expect(dccSessionsData[value.session].direction).to.equal(value.direction);
			done();
		}, 10);
	})


    // 63 ERR test cases
    //
	function GetTestCase_ERR () {
		var testCases = [];
		for (D1 = 1; D1 < 4; D1++) {
			if (D1 == 1) data1 = 0;
			if (D1 == 2) data1 = 1;
			if (D1 == 3) data1 = 255;
            for (D2 = 1; D2 < 4; D2++) {
                if (D2 == 1) data2 = 0;
                if (D2 == 2) data2 = 1;
                if (D2 == 3) data2 = 255;
                for (errorIndex = 1; errorIndex < 4; errorIndex++) {
                    if (errorIndex == 1) errorNumber = 0;
                    if (errorIndex == 2) errorNumber = 1;
                    if (errorIndex == 3) errorNumber = 255;
                    testCases.push({'data1':data1, 'data2':data2, 'errorNumber':errorNumber});
                }
            }
		}
		return testCases;
	}
    
    // 63 ERR
    //
	itParam("ERR test: data1 ${value.data1} data2 ${value.data2} errorNumber ${value.errorNumber}", GetTestCase_ERR(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ERR test ' + JSON.stringify(value)});
        node.on('dccError', function tmp(data) {
			errorData = data;
			winston.info({message: 'mergAdminNode Test: ERR test - message data : ' + JSON.stringify(errorData)});
            node.removeListener('dccError', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputERR(value.data1, value.data2, value.errorNumber);
		setTimeout(function(){
            expect(errorData.type).to.equal('DCC');
            expect(errorData.data).to.equal(decToHex(value.data1, 2) + decToHex(value.data2, 2));
            expect(errorData.Error).to.equal(value.errorNumber);
			done();
		}, 10);
	})


    // 6F CMDERR test cases
    //
	function GetTestCase_CMDERR () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (errorIndex = 1; errorIndex < 4; errorIndex++) {
				if (errorIndex == 1) errorNumber = 0;
				if (errorIndex == 2) errorNumber = 1;
				if (errorIndex == 3) errorNumber = 255;
				testCases.push({'nodeNumber':nodeNumber, 'errorNumber':errorNumber});
			}
		}
		return testCases;
	}
    
    // 6F CMDERR
    //
	itParam("CMDERR test: nodeNumber ${value.nodeNumber} errorNumber ${value.errorNumber}", GetTestCase_CMDERR(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN CMDERR test ' + JSON.stringify(value)});
        node.on('cbusError', function tmp(data) {
			errorData = data;
			winston.info({message: 'mergAdminNode Test: ERR test - message data : ' + JSON.stringify(errorData)});
            node.removeListener('cbusError', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputCMDERR(value.nodeNumber, value.errorNumber);
		setTimeout(function(){
            var ref = value.nodeNumber.toString() + '-' + value.errorNumber.toString()
            expect(errorData[ref].type).to.equal('CBUS');
            expect(errorData[ref].node).to.equal(value.nodeNumber);
            expect(errorData[ref].Error).to.equal(value.errorNumber);
			done();
		}, 10);
	})


    // 71 NVRD test cases
    //
	function GetTestCase_NVRD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				testCases.push({'nodeId':nodeId, 'nvIndex':nvIndex});
			}
		}
		return testCases;
	}

    // 71 NVRD encoding
    //
	itParam("NVRD encoding test: nodeId ${value.nodeId} nvIndex ${value.nvIndex}", GetTestCase_NVRD(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NVRD test ' + JSON.stringify(value)});
		expected = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + ";";
		expect(node.NVRD(value.nodeId, value.nvIndex)).to.equal(expected);
	})


    // 72 NENRD test cases
    //
	function GetTestCase_NENRD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (Eindex = 1; Eindex < 4; Eindex++) {
				if (Eindex == 1) eventIndex = 0;
				if (Eindex == 2) eventIndex = 1;
				if (Eindex == 3) eventIndex = 255;
				testCases.push({'nodeNumber':nodeNumber, 'eventIndex':eventIndex});
			}
		}
		return testCases;
	}


    // 72 NENRD encoding test
    //
	itParam("NENRD encoding test nodeNumber ${value.nodeNumber} eventIndex ${value.eventIndex}", GetTestCase_NENRD(), function (value) {
		// NENRD Format: [<MjPri><MinPri=3><CANID>]<72><NN hi><NN lo><EN#>
		winston.info({message: 'cbusMessage test: BEGIN NENRD test ' + JSON.stringify(value)});
		expected = ":SB780N72" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + ";";
		expect(node.NENRD(value.nodeId, value.eventIndex)).to.equal(expected);
    })


    // 73 RQNPN test cases
    //
	function GetTestCase_RQNPN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (Pindex = 1; Pindex < 4; Pindex++) {
				if (Pindex == 1) paramIndex = 0;
				if (Pindex == 2) paramIndex = 1;
				if (Pindex == 3) paramIndex = 255;
				testCases.push({'nodeId':nodeId, 'paramIndex':paramIndex});
			}
		}
		return testCases;
	}


    // 73 RQNPN encoding test
    //
	itParam("RQNPN encoding test: nodeId ${value.nodeId} paramIndex ${value.paramIndex}", GetTestCase_RQNPN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN RQNPN test ' + JSON.stringify(value)});
		expected = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(value.paramIndex, 2) + ";";
		expect(node.RQNPN(value.nodeId, value.paramIndex)).to.equal(expected);
	})


    // 74 NUMEV test cases
    //
	function GetTestCase_NUMEV () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (Pindex = 1; Pindex < 4; Pindex++) {
				if (Pindex == 1) eventCount = 0;
				if (Pindex == 2) eventCount = 1;
				if (Pindex == 3) eventCount = 255;
				testCases.push({'nodeNumber':nodeNumber, 'eventCount':eventCount});
			}
		}
		return testCases;
	}
    
    // 74 NUMEV
    //
	itParam("NUMEV test: nodeNumber ${value.nodeNumber} eventCount ${value.eventCount}", GetTestCase_NUMEV(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN NUMEV test ' + JSON.stringify(value)});
        mock_Cbus.outputNUMEV(value.nodeNumber, value.eventCount);
		setTimeout(function(){
            expect(node.config.nodes[value.nodeNumber].EvCount).to.equal(value.eventCount);
            done()
		}, 10);
	})


    // 78 QLOC test cases
    //
	function GetTestCase_QLOC () {
		var testCases = [];
		for (S = 1; S < 4; S++) {
			if (S == 1) session = 0;
			if (S == 2) session = 1;
			if (S == 3) session = 255;
			testCases.push({'session':session});
		}
		return testCases;
	}

    // 78 QLOC encoding test
    //
	itParam("QLOC encoding test: session ${value.session}", GetTestCase_QLOC(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN QLOC test ' + JSON.stringify(value)});
		expected = ":SB780N22" + decToHex(value.session, 2) + ";";
		expect(node.QLOC(value.session)).to.equal(expected);
	})


    // 90 & 91 - ACON & ACOF test cases
    //
	function GetTestCase_ACONF () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (EN = 1; EN < 4; EN++) {
				if (EN == 1) eventNumber = 0;
				if (EN == 2) eventNumber = 1;
				if (EN == 3) eventNumber = 65535;
				testCases.push({'nodeNumber':nodeNumber, 'eventNumber':eventNumber});
			}
		}
		return testCases;
	}

	// 90 ACON encoding
    //
	itParam("ACON encoding test: nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber}", GetTestCase_ACONF(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ACON outgoing test ' + JSON.stringify(value)});
		expected = ":SB780N90" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + ";";
		expect(node.ACON(value.nodeNumber, value.eventNumber)).to.equal(expected);
		done();
	})

    // 90 ACON Incoming
    //
	itParam("ACON incoming test: nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber}", GetTestCase_ACONF(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ACON incoming test ' + JSON.stringify(value)});
        node.config.events = []         // clear events
        node.on('events', function tmp(data) {
			eventData = data;
			winston.info({message: 'mergAdminNode Test: ACON incoming test - message data : ' + JSON.stringify(eventData)});
            node.removeListener('events', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputACON(value.nodeNumber, value.eventNumber);
		setTimeout(function(){
            var ref = decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) 
            expect(eventData[0].id).to.equal(ref);
            expect(eventData[0].nodeId).to.equal(value.nodeNumber);
            expect(eventData[0].eventId).to.equal(value.eventNumber);
            expect(eventData[0].status).to.equal('on');
			done();
		}, 10);
	})

	// 91 ACOF encoding
    //
	itParam("ACOF encoding test: nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber}", GetTestCase_ACONF(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ACOF test ' + JSON.stringify(value)});
		expected = ":SB780N91" + decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) + ";";
		expect(node.ACOF(value.nodeNumber, value.eventNumber)).to.equal(expected);
		done();
	})

    // 91 ACOF Incoming
    //
	itParam("ACOF incoming test: nodeNumber ${value.nodeNumber} eventNumber ${value.eventNumber}", GetTestCase_ACONF(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ACOF incoming test ' + JSON.stringify(value)});
        node.config.events = []         // clear events
        node.on('events', function tmp(data) {
			eventData = data;
			winston.info({message: 'mergAdminNode Test: ACOF incoming test - message data : ' + JSON.stringify(eventData)});
            node.removeListener('events', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputACOF(value.nodeNumber, value.eventNumber);
		setTimeout(function(){
            var ref = decToHex(value.nodeNumber, 4) + decToHex(value.eventNumber, 4) 
            expect(eventData[0].id).to.equal(ref);
            expect(eventData[0].nodeId).to.equal(value.nodeNumber);
            expect(eventData[0].eventId).to.equal(value.eventNumber);
            expect(eventData[0].status).to.equal('off');
			done();
		}, 10);
	})


    // 95 EVULN test cases
    //
	function GetTestCase_EVULN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) event = '00000000';
			if (EV == 2) event = '00000001';
			if (EV == 3) event = 'FFFFFFFF';
			testCases.push({'event':event});
		}
		return testCases;
	}
    
    // 95 EVULN encoding
    //
	itParam("EVULN encoding test: event ${value.event}", GetTestCase_EVULN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN EVULN test ' + JSON.stringify(value)});
		expected = ":SB780N95" + value.event + ";";
		expect(node.EVULN(value.event)).to.equal(expected);
	})


    // 96 NVSET test cases
    //
	function GetTestCase_NVSET () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				for (NVvalue = 1; NVvalue < 4; NVvalue++) {
					if (NVvalue == 1) nvValue = 0;
					if (NVvalue == 2) nvValue = 1;
					if (NVvalue == 3) nvValue = 255;
					testCases.push({'nodeId':nodeId, 'nvIndex':nvIndex, 'nvValue':nvValue});
				}
			}
		}
		return testCases;
	}

    // 96 NVSET encoding
    //
	itParam("NVSET encoding test: nodeId ${value.nodeId} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVSET(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NVSET test ' + JSON.stringify(value)});
		expected = ":SB780N96" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
		expect(node.NVSET(value.nodeId, value.nvIndex, value.nvValue)).to.equal(expected);
	})


    // 97 NVANS test cases
    //
	function GetTestCase_NVANS () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (NVindex = 1; NVindex < 4; NVindex++) {
				if (NVindex == 1) nvIndex = 0;
				if (NVindex == 2) nvIndex = 1;
				if (NVindex == 3) nvIndex = 255;
				for (NVvalue = 1; NVvalue < 4; NVvalue++) {
					if (NVvalue == 1) nvValue = 0;
					if (NVvalue == 2) nvValue = 1;
					if (NVvalue == 3) nvValue = 255;
					testCases.push({'nodeNumber':nodeNumber, 'nvIndex':nvIndex, 'nvValue':nvValue});
				}
			}
		}
		return testCases;
	}
    //
	itParam("NVANS test: nodeNumber ${value.nodeNumber} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVANS(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN NVANS test ' + JSON.stringify(value)});
        mock_Cbus.outputNVANS(value.nodeNumber, value.nvIndex, value.nvValue);
		setTimeout(function(){
            expect(node.config.nodes[value.nodeNumber].variables[value.nvIndex]).to.equal(value.nvValue)
            done()
		}, 10);
	})


    // 98/99 ASON & ASOF test cases
    //
	function GetTestCase_ACCESSORY_SHORT () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (DN = 1; DN < 4; DN++) {
				if (DN == 1) deviceNum = 0;
				if (DN == 2) deviceNum = 1;
				if (DN == 3) deviceNum = 65535;
				testCases.push({'nodeNumber':nodeNumber, 'deviceNum':deviceNum});
			}
		}
		return testCases;
	}

    // 98 ASON encoding
    //
	itParam("ASON encoding test: nodeNumber ${value.nodeNumber} deviceNum ${value.deviceNum}", GetTestCase_ACCESSORY_SHORT(), function (value) {
		// Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
		winston.info({message: 'mergAdminNode test: BEGIN ASON test ' + JSON.stringify(value)});
		expected = ":SB780N98" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNum, 4) + ";";
		expect(node.ASON(value.nodeNumber, value.deviceNum)).to.equal(expected);
	})

    // 98 ASON Incoming
    //
	itParam("ASON incoming test: nodeNumber ${value.nodeNumber} deviceNum ${value.deviceNum}", GetTestCase_ACCESSORY_SHORT(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ASON incoming test ' + JSON.stringify(value)});
        node.config.events = []         // clear events
        node.on('events', function tmp(data) {
			eventData = data;
			winston.info({message: 'mergAdminNode Test: ASON incoming test - message data : ' + JSON.stringify(eventData)});
            node.removeListener('events', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputASON(value.nodeNumber, value.deviceNum);
		setTimeout(function(){
            var ref = decToHex(value.deviceNum, 8) 
            expect(eventData[0].id).to.equal(ref);
            expect(eventData[0].nodeId).to.equal(value.nodeNumber);
            expect(eventData[0].eventId).to.equal(value.deviceNum);
            expect(eventData[0].status).to.equal('on');
			done();
		}, 10);
	})


    // 99 ASOF encoding
    //
	itParam("ASOF encoding test: nodeNumber ${value.nodeNumber} deviceNum ${value.deviceNum}", GetTestCase_ACCESSORY_SHORT(), function (value) {
		// Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
		winston.info({message: 'mergAdminNode test: BEGIN ASOF test ' + JSON.stringify(value)});
		expected = ":SB780N99" + decToHex(value.nodeNumber, 4) + decToHex(value.deviceNum, 4) + ";";
		expect(node.ASOF(value.nodeNumber, value.deviceNum)).to.equal(expected);
	})

    // 99 ASOF Incoming
    //
	itParam("ASOF incoming test: nodeNumber ${value.nodeNumber} deviceNum ${value.deviceNum}", GetTestCase_ACCESSORY_SHORT(), function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ASOF incoming test ' + JSON.stringify(value)});
        node.config.events = []         // clear events
        node.on('events', function tmp(data) {
			eventData = data;
			winston.info({message: 'mergAdminNode Test: ASOF incoming test - message data : ' + JSON.stringify(eventData)});
            node.removeListener('events', tmp);    // remove event listener after first event
        })
		mock_Cbus.outputASOF(value.nodeNumber, value.deviceNum);
		setTimeout(function(){
            var ref = decToHex(value.deviceNum, 8) 
            expect(eventData[0].id).to.equal(ref);
            expect(eventData[0].nodeId).to.equal(value.nodeNumber);
            expect(eventData[0].eventId).to.equal(value.deviceNum);
            expect(eventData[0].status).to.equal('off');
			done();
		}, 10);
	})


    // 9B PARAN test cases
    //
	function GetTestCase_PARAN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (PI = 1; PI < 4; PI++) {
				if (PI == 1) parameterIndex = 0;
				if (PI == 2) parameterIndex = 1;
				if (PI == 3) parameterIndex = 255;
				for (PV = 1; PV < 4; PV++) {
					if (PV == 1) parameterValue = 0;
					if (PV == 2) parameterValue = 1;
					if (PV == 3) parameterValue = 255;
					testCases.push({'nodeNumber':nodeNumber, 'parameterIndex':parameterIndex, 'parameterValue':parameterValue});
				}
			}
		}
		return testCases;
	}

    // 9B PARAN
    //
	itParam("PARAN test: nodeNumber ${value.nodeNumber} parameterIndex ${value.parameterIndex} parameterValue ${value.parameterValue}", GetTestCase_PARAN(), function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN PARAN test ' + JSON.stringify(value)});
        mock_Cbus.outputPARAN(value.nodeNumber, value.parameterIndex, value.parameterValue);
		setTimeout(function(){
            expect(node.config.nodes[value.nodeNumber].parameters[value.parameterIndex]).to.equal(value.parameterValue)
            done()
		}, 10);
	})


    // 9C REVAL test cases
    //
	function GetTestCase_REVAL () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (EVindex = 1; EVindex < 4; EVindex++) {
				if (EVindex == 1) eventIndex = 0;
				if (EVindex == 2) eventIndex = 1;
				if (EVindex == 3) eventIndex = 255;
				for (EVvalue = 1; EVvalue < 4; EVvalue++) {
					if (EVvalue == 1) eventValue = 0;
					if (EVvalue == 2) eventValue = 1;
					if (EVvalue == 3) eventValue = 255;
					testCases.push({'nodeId':nodeId, 'eventIndex':eventIndex, 'eventValue':eventValue});
				}
			}
		}
		return testCases;
	}

    // 9C REVAL encoding
    //
	itParam("REVAL encoding test: nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventValue ${value.eventValue}", GetTestCase_REVAL(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN REVAL test ' + JSON.stringify(value)});
		expected = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventValue, 2) + ";";
		expect(node.REVAL(value.nodeId, value.eventIndex, value.eventValue)).to.equal(expected);
	})


    // B5 NEVAL test cases
    //
	function GetTestCase_NEVAL () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (ENindex = 1; ENindex < 4; ENindex++) {
				if (ENindex == 1) eventIndex = 0;
				if (ENindex == 2) eventIndex = 1;
				if (ENindex == 3) eventIndex = 255;
                for (EVindex = 1; EVindex < 4; EVindex++) {
                    if (EVindex == 1) eventVariableIndex = 0;
                    if (EVindex == 2) eventVariableIndex = 1;
                    if (EVindex == 3) eventVariableIndex = 255;
                    for (EVvalue = 1; EVvalue < 4; EVvalue++) {
                        if (EVvalue == 1) eventVariableValue = 0;
                        if (EVvalue == 2) eventVariableValue = 1;
                        if (EVvalue == 3) eventVariableValue = 255;
                        testCases.push({'nodeNumber':nodeNumber, 'eventIndex':eventIndex, 'eventVariableIndex':eventVariableIndex, 'eventVariableValue':eventVariableValue});
                    }
                }
			}
		}
		return testCases;
	}
    
    // B5 NEVAL
    //
	itParam("NEVAL test: nodeNumber ${value.nodeNumber} eventIndex ${value.eventIndex} eventVariableIndex ${value.eventVariableIndex} eventVariableValue ${value.eventVariableValue}", 
        GetTestCase_NEVAL(), function (done, value) {
            winston.info({message: 'cbusMessage test: BEGIN NEVAL test ' + JSON.stringify(value)});
        node.cbusSend(node.NERD(value.nodeNumber))  // need to update events in system before proceeding
		setTimeout(function(){
            mock_Cbus.outputNEVAL(value.nodeNumber, value.eventIndex, value.eventVariableIndex, value.eventVariableValue);
            done()
		}, 10);
	})


    // B6 PNN test cases
    //
	function GetTestCase_PNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
			for (MAN = 1; MAN < 4; MAN++) {
				if (MAN == 1) manufacturerId = 0;
				if (MAN == 2) manufacturerId = 1;
				if (MAN == 3) manufacturerId = 255;
                for (MOD = 1; MOD < 4; MOD++) {
                    if (MOD == 1) moduleId = 0;
                    if (MOD == 2) moduleId = 1;
                    if (MOD == 3) moduleId = 255;
                    for (FL = 1; FL < 4; FL++) {
                        if (FL == 1) flags = 0;
                        if (FL == 2) flags = 1;
                        if (FL == 3) flags = 255;
                        testCases.push({'nodeNumber':nodeNumber, 'manufacturerId':manufacturerId, 'moduleId':moduleId, 'flags':flags});
                    }
                }
			}
		}
		return testCases;
	}
    
    // B6 PNN
    //
    // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
	itParam("PNN test: nodeNumber ${value.nodeNumber} manufacturerId ${value.manufacturerId} moduleId ${value.moduleId} flags ${value.flags}", 
        GetTestCase_PNN(), function (done, value) {
            winston.info({message: 'cbusMessage test: BEGIN PNN test ' + JSON.stringify(value)});
            mock_Cbus.outputPNN(value.nodeNumber, value.manufacturerId, value.moduleId, value.flags);
            setTimeout(function(){
                expect(node.config.nodes[value.nodeNumber].flags).to.equal(value.flags)
                done()
            }, 10);
	})


    // D2 EVLRN test cases
    //
	function GetTestCase_EVLRN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) event = '00000000';
			if (EV == 2) event = '00000001';
			if (EV == 3) event = 'FFFFFFFF';
			for (EVindex = 1; EVindex < 4; EVindex++) {
				if (EVindex == 1) eventIndex = 0;
				if (EVindex == 2) eventIndex = 1;
				if (EVindex == 3) eventIndex = 255;
				for (EVvalue = 1; EVvalue < 4; EVvalue++) {
					if (EVvalue == 1) eventValue = 0;
					if (EVvalue == 2) eventValue = 1;
					if (EVvalue == 3) eventValue = 255;
					testCases.push({'event':event, 'eventIndex':eventIndex, 'eventValue':eventValue});
				}
			}
		}
		return testCases;
	}

    // D2 EVLRN encoding
    //
	itParam("EVLRN encoding test: event ${value.event} eventIndex ${value.eventIndex} eventValue ${value.eventValue}", GetTestCase_EVLRN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN EVLRN test ' + JSON.stringify(value)});
		expected = ":SB780ND2" + value.event + decToHex(value.eventIndex, 2) + decToHex(value.eventValue, 2) + ";";
		expect(node.EVLRN(value.event, value.eventIndex, value.eventValue)).to.equal(expected);
	})


    // E1 PLOC test cases
    //
	function GetTestCase_PLOC () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;
			for (AD = 1; AD < 4; AD++) {
				if (AD == 1) address = 0;
				if (AD == 2) address = 1;
				if (AD == 3) address = 65535;
                for (SP = 1; SP < 4; SP++) {
                    if (SP == 1) speed = 0;
                    if (SP == 2) speed = 1;
                    if (SP == 3) speed = 127;
                    for (DIR = 1; DIR < 3; DIR++) {
                        if (DIR == 1) direction = 'Reverse';
                        if (DIR == 2) direction = 'Forward';
                        for (Fn1Index = 1; Fn1Index < 4; Fn1Index++) {
                            if (Fn1Index == 1) Fn1 = 0;
                            if (Fn1Index == 2) Fn1 = 1;
                            if (Fn1Index == 3) Fn1 = 255;
                            for (Fn2Index = 1; Fn2Index < 4; Fn2Index++) {
                                if (Fn2Index == 1) Fn2 = 0;
                                if (Fn2Index == 2) Fn2 = 1;
                                if (Fn2Index == 3) Fn2 = 255;
                                for (Fn3Index = 1; Fn3Index < 4; Fn3Index++) {
                                    if (Fn3Index == 1) Fn3 = 0;
                                    if (Fn3Index == 2) Fn3 = 1;
                                    if (Fn3Index == 3) Fn3 = 255;
                                    testCases.push({'session':session, 
                                        'address':address,
                                        'speed': speed,
                                        'direction': direction,
                                        'Fn1':Fn1, 
                                        'Fn2':Fn2,
                                        'Fn3':Fn3});
                                }
                            }
                        }
                    }
                }
            }
		}
		return testCases;
	}
    
    // E1 PLOC
    //
	itParam("PLOC test: session ${value.session} address ${value.address} speed ${value.speed} direction ${value.direction} Fn1 ${value.Fn1} Fn2 ${value.Fn2} Fn3 ${value.Fn3}",
        GetTestCase_PLOC(), function (done, value) {
            winston.info({message: 'cbusMessage test: BEGIN PLOC test ' + JSON.stringify(value)});
            node.on('dccSessions', function tmp(data) {
                dccSessionsData = data;
                winston.info({message: 'mergAdminNode Test: PLOC test - message data : ' + JSON.stringify(dccSessionsData)});
                node.removeListener('dccSessions', tmp);    // remove event listener after first event
            })
            mock_Cbus.outputPLOC(value.session, value.address, value.speed, value.direction, value.Fn1, value.Fn2, value.Fn3)
            setTimeout(function(){
                expect(dccSessionsData[value.session].loco).to.equal(value.address);
                expect(dccSessionsData[value.session].speed).to.equal(value.speed);
                expect(dccSessionsData[value.session].direction).to.equal(value.direction);
                expect(dccSessionsData[value.session].F1).to.equal(value.Fn1);
                expect(dccSessionsData[value.session].F2).to.equal(value.Fn2);
                expect(dccSessionsData[value.session].F3).to.equal(value.Fn3);
                done();
            }, 10);
	})


    // EF PARAMS
    
    
    // F2 ENRSP test cases
    //
	function GetTestCase_ENRSP () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeNumber = 0;
			if (NN == 2) nodeNumber = 1;
			if (NN == 3) nodeNumber = 65535;
            for (EV = 1; EV < 4; EV++) {
                if (EV == 1) eventName = '00000000';
                if (EV == 2) eventName = '00000001';
                if (EV == 3) eventName = 'FFFFFFFF';
                for (EVindex = 1; EVindex < 4; EVindex++) {
                    if (EVindex == 1) eventIndex = 0;
                    if (EVindex == 2) eventIndex = 1;
                    if (EVindex == 3) eventIndex = 255;
					testCases.push({'nodeNumber':nodeNumber, 'eventName':eventName, 'eventIndex':eventIndex});
				}
			}
		}
		return testCases;
	}

    // F2 ENRSP
    //
	itParam("ENRSP test: nodeNumber ${value.nodeNumber} eventName ${value.eventName} eventIndex ${value.eventIndex}",
        GetTestCase_ENRSP(), function (done, value) {
            winston.info({message: 'cbusMessage test: BEGIN ENRSP test ' + JSON.stringify(value)});
            // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
            node.config.nodes[value.nodeNumber].actions=[]  // clear events
            node.on('nodes', function tmp(data) {
                nodeData = data;
                winston.info({message: 'mergAdminNode Test: ENRSP test - message data : ' + JSON.stringify(nodeData)});
                node.removeListener('nodes', tmp);    // remove event listener after first event
            })
            mock_Cbus.outputENRSP(value.nodeNumber, value.eventName, value.eventIndex)
            setTimeout(function(){
                expect(nodeData[value.nodeNumber].actions[value.eventIndex].event).to.equal(value.eventName);
                done();
            }, 10);
    })


	it('cbusTraffic test', function(done) {
		winston.info({message: 'mergAdminNode Test: cbusTraffic test'});
        node.on('cbusTraffic', function tmp(data) {
            trafficData = data
            winston.info({message: 'mergAdminNode Test: cbusTraffic test - message data : ' + JSON.stringify(trafficData)});
            node.removeListener('cbusTraffic', tmp);    // remove event listener after first event
        })
        var message = cbusLib.encodeACK()
        node.cbusSend(message)  // need to update events in system before proceeding
        setTimeout(function(){
            expect(trafficData.raw).to.equal(message);
            expect(trafficData.direction).to.equal('Out');
            done();
        }, 10);
	});



})
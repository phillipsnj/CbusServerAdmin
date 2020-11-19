const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');

const cbusMsg = require('./../merg/cbusMessage.js')

function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    return padded.substr(-len)
}

describe('cbusMessage tests', function(){



	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '------------------------ cbusMessage tests -------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});

		done();
	});

	after(function() {

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

	
    // 10 RQNP
    //
	it("RQNP test", function () {
		winston.info({message: 'cbusMessage test: BEGIN RQNP test '});
		expected = ":SB780N10" + ";";
        var encode = cbusMsg.encodeRQNP();
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: RQNP encode ' + encode});
		winston.info({message: 'cbusMessage test: RQNP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
		expect(decode.mnemonic).to.equal('RQNP', 'mnemonic');
		expect(decode.opCode).to.equal('10', 'opCode');
	})


    // 21 KLOC
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

	itParam("KLOC test session ${value.session}", GetTestCase_KLOC(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN KLOC test ' + JSON.stringify(value)});
		expected = ":SB780N21" + decToHex(value.session, 2) + ";";
        var encode = cbusMsg.encodeKLOC(value.session);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: KLOC encode ' + encode});
		winston.info({message: 'cbusMessage test: KLOC decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
		expect(decode.mnemonic).to.equal('KLOC', 'mnemonic');
		expect(decode.opCode).to.equal('21', 'opCode');
	})


    // 22 QLOC
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

	itParam("QLOC test session ${value.session}", GetTestCase_QLOC(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN QLOC test ' + JSON.stringify(value)});
		expected = ":SB780N22" + decToHex(value.session, 2) + ";";
        var encode = cbusMsg.encodeQLOC(value.session);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: QLOC encode ' + encode});
		winston.info({message: 'cbusMessage test: QLOC decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
		expect(decode.mnemonic).to.equal('QLOC', 'mnemonic');
		expect(decode.opCode).to.equal('22', 'opCode');
	})


    // 23 DKEEP
    //
	function GetTestCase_DKEEP () {
		var testCases = [];
		for (sessionIndex = 1; sessionIndex < 4; sessionIndex++) {
			if (sessionIndex == 1) session = 0;
			if (sessionIndex == 2) session = 1;
			if (sessionIndex == 3) session = 255;

			testCases.push({'session':session});
		}
		return testCases;
	}

	itParam("DKEEP test session ${value.session}", GetTestCase_DKEEP(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN DKEEP test ' + JSON.stringify(value)});
		expected = ":SB780N23" + decToHex(value.session, 2) + ";";
        var encode = cbusMsg.encodeDKEEP(value.session);
        var decode = cbusMsg.decodeDKEEP(encode);
		winston.info({message: 'cbusMessage test: DKEEP encode ' + encode});
		winston.info({message: 'cbusMessage test: DKEEP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
		expect(decode.mnemonic).to.equal('DKEEP', 'mnemonic');
		expect(decode.opCode).to.equal('23', 'opCode');
	})


    // 27 DSPD
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

	itParam("DSPD test session ${value.session} speed ${value.speed} direction ${value.direction}", GetTestCase_DSPD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN DSPD test ' + JSON.stringify(value)});
        var speedDir = value.speed + parseInt((value.direction == 'Reverse') ? 0 : 128)
		expected = ":SB780N27" + decToHex(value.session, 2) + decToHex(speedDir, 2) + ";";
        var encode = cbusMsg.encodeDSPD(value.session, value.speed, value.direction);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: DSPD encode ' + encode});
		winston.info({message: 'cbusMessage test: DSPD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
        expect(decode.speed).to.equal(value.speed, 'speed');
        expect(decode.direction).to.equal(value.direction, 'direction');
		expect(decode.mnemonic).to.equal('DSPD', 'mnemonic');
		expect(decode.opCode).to.equal('27', 'opCode');
	})


    // 42 SNN
    //
	function GetTestCase_SNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			testCases.push({'nodeId':nodeId});
		}
		return testCases;
	}

	itParam("SNN test nodeId ${value.nodeId}", GetTestCase_SNN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN SNN test ' + JSON.stringify(value)});
		expected = ":SB780N42" + decToHex(value.nodeId, 4) + ";";
        var encode = cbusMsg.encodeSNN(value.nodeId);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: SNN encode ' + encode});
		winston.info({message: 'cbusMessage test: SNN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeId).to.equal(value.nodeId, 'nodeId');
		expect(decode.mnemonic).to.equal('SNN', 'mnemonic');
		expect(decode.opCode).to.equal('42', 'opCode');
	})


    // 53 NNLRN
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

	itParam("NNLRN test nodeId ${value.nodeId}", GetTestCase_NNLRN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NNLRN test ' + JSON.stringify(value)});
		expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
        var encode = cbusMsg.encodeNNLRN(value.nodeId);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: NNLRN encode ' + encode});
		winston.info({message: 'cbusMessage test: NNLRN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeId).to.equal(value.nodeId, 'nodeId');
		expect(decode.mnemonic).to.equal('NNLRN', 'mnemonic');
		expect(decode.opCode).to.equal('53', 'opCode');
	})


    // 54 NNULN
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


	itParam("NNULN test nodeId ${value.nodeId}", GetTestCase_NNULN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NNULN test ' + JSON.stringify(value)});
		expected = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
        var encode = cbusMsg.encodeNNULN(value.nodeId);
        var decode = cbusMsg.decodeNNULN(encode);
		winston.info({message: 'cbusMessage test: NNULN encode ' + encode});
		winston.info({message: 'cbusMessage test: NNULN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeId).to.equal(value.nodeId, 'nodeId');
		expect(decode.mnemonic).to.equal('NNULN', 'mnemonic');
		expect(decode.opCode).to.equal('54', 'opCode');
	})


    // 57 NERD
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

	itParam("NERD test nodeId ${value.nodeId}", GetTestCase_NERD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NERD test ' + JSON.stringify(value)});
		expected = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
        var encode = cbusMsg.encodeNERD(value.nodeId);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: NERD encode ' + encode});
		winston.info({message: 'cbusMessage test: NERD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeId).to.equal(value.nodeId, 'nodeId');
		expect(decode.mnemonic).to.equal('NERD', 'mnemonic');
		expect(decode.opCode).to.equal('57', 'opCode');
	})


    // 58 RQEVN
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

	itParam("RQEVN test nodeId ${value.nodeId}", GetTestCase_RQEVN(),  function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQEVN test ' + JSON.stringify(value)});
		expected = ":SB780N58" + decToHex(value.nodeId, 4) + ";";
        var encode = cbusMsg.encodeRQEVN(value.nodeId);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: RQEVN encode ' + encode});
		winston.info({message: 'cbusMessage test: RQEVN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeId).to.equal(value.nodeId, 'nodeId');
		expect(decode.mnemonic).to.equal('RQEVN', 'mnemonic');
		expect(decode.opCode).to.equal('58', 'opCode');
	})


    // 60 DFUN
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

	itParam("DFUN test session ${value.session} Fn1 ${value.Fn1} Fn2 ${value.Fn2}", GetTestCase_DFUN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN DFUN test ' + JSON.stringify(value)});
		expected = ":SB780N60" + decToHex(value.session, 2) + decToHex(value.Fn1, 2) + decToHex(value.Fn2, 2) + ";";
        var encode = cbusMsg.encodeDFUN(value.session, value.Fn1, value.Fn2);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: DFUN encode ' + encode});
		winston.info({message: 'cbusMessage test: DFUN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.session).to.equal(value.session, 'session');
        expect(decode.Fn1).to.equal(value.Fn1, 'Fn1');
        expect(decode.Fn2).to.equal(value.Fn2, 'Fn2');
		expect(decode.mnemonic).to.equal('DFUN', 'mnemonic');
		expect(decode.opCode).to.equal('60', 'opCode');
	})


    // 6F CMDERR
    //
	function GetTestCase_CMDERR () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (errorIndex = 1; errorIndex < 4; errorIndex++) {
				if (errorIndex == 1) error = 0;
				if (errorIndex == 2) error = 1;
				if (errorIndex == 3) error = 255;
				testCases.push({'nodeId':nodeId, 'error':error});
			}
		}
		return testCases;
	}

	itParam("CMDERR test nodeId ${value.nodeId} error ${value.error}", GetTestCase_CMDERR(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN CMDERR test ' + JSON.stringify(value)});
		expected = ":SB780N6F" + decToHex(value.nodeId, 4) + decToHex(value.error, 2) + ";";
        var encode = cbusMsg.encodeCMDERR(value.nodeId, value.error);
        var decode = cbusMsg.decode(encode);
		winston.info({message: 'cbusMessage test: CMDERR encode ' + encode});
		winston.info({message: 'cbusMessage test: CMDERR decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected, 'encode');
        expect(decode.nodeId).to.equal(value.nodeId, 'nodeId');
        expect(decode.error).to.equal(value.error, 'error');
		expect(decode.mnemonic).to.equal('CMDERR', 'mnemonic');
		expect(decode.opCode).to.equal('6F', 'opCode');

	})


    // 71 NVRD
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


	itParam("NVRD test nodeId ${value.nodeId} nvIndex ${value.nvIndex}", GetTestCase_NVRD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NVRD test ' + JSON.stringify(value)});
		expected = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + ";";
        var encode = cbusMsg.encodeNVRD(value.nodeId, value.nvIndex);
        var decode = cbusMsg.decodeNVRD(encode);
		winston.info({message: 'cbusMessage test: NVRD encode ' + encode});
		winston.info({message: 'cbusMessage test: NVRD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId == value.nodeId);
        expect(decode.nodeVariableIndex == value.nvIndex);
        expect(decode.mnemonic == 'NVRD');
        expect(decode.opCode == '71');
	})


    // 72 NENRD
    //
	function GetTestCase_NENRD () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (Eindex = 1; Eindex < 4; Eindex++) {
				if (Eindex == 1) eventIndex = 0;
				if (Eindex == 2) eventIndex = 1;
				if (Eindex == 3) eventIndex = 255;
				testCases.push({'nodeId':nodeId, 'eventIndex':eventIndex});
			}
		}
		return testCases;
	}

	itParam("NENRD test nodeId ${value.nodeId} eventIndex ${value.eventIndex}", GetTestCase_NENRD(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NENRD test ' + JSON.stringify(value)});
		expected = ":SB780N72" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + ";";
        var encode = cbusMsg.encodeNENRD(value.nodeId, value.eventIndex);
        var decode = cbusMsg.decodeNENRD(encode);
		winston.info({message: 'cbusMessage test: NENRD encode ' + encode});
		winston.info({message: 'cbusMessage test: NENRD decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId == value.nodeId);
        expect(decode.eventIndex == value.eventIndex);
        expect(decode.mnemonic == 'NENRD');
        expect(decode.opCode == '72');
	})


    // 73 RQNPN
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


	itParam("RQNPN test nodeId ${value.nodeId} paramIndex ${value.paramIndex}", GetTestCase_RQNPN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQNPN test ' + JSON.stringify(value)});
		expected = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(value.paramIndex, 2) + ";";
        var encode = cbusMsg.encodeRQNPN(value.nodeId, value.paramIndex);
        var decode = cbusMsg.decodeRQNPN(encode);
		winston.info({message: 'cbusMessage test: RQNPN encode ' + encode});
		winston.info({message: 'cbusMessage test: RQNPN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId == value.nodeId);
        expect(decode.ParameterIndex == value.paramIndex);
        expect(decode.mnemonic == 'RQNPN');
        expect(decode.opCode == '73');
	})


    // 74 NUMEV
    //
	function GetTestCase_NUMEV () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (Pindex = 1; Pindex < 4; Pindex++) {
				if (Pindex == 1) eventCount = 0;
				if (Pindex == 2) eventCount = 1;
				if (Pindex == 3) eventCount = 255;
				testCases.push({'nodeId':nodeId, 'eventCount':eventCount});
			}
		}
		return testCases;
	}


	itParam("NUMEV test nodeId ${value.nodeId} eventCount ${value.eventCount}", GetTestCase_NUMEV(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN RQNNUMEVPN test ' + JSON.stringify(value)});
		expected = ":SB780N74" + decToHex(value.nodeId, 4) + decToHex(value.eventCount, 2) + ";";
        var encode = cbusMsg.encodeNUMEV(value.nodeId, value.eventCount);
        var decode = cbusMsg.decodeNUMEV(encode);
		winston.info({message: 'cbusMessage test: NUMEV encode ' + encode});
		winston.info({message: 'cbusMessage test: NUMEV decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId == value.nodeId);
        expect(decode.eventCount == value.eventCount);
        expect(decode.mnemonic == 'NUMEV');
        expect(decode.opCode == '74');
	})


    // 90 ACON
    //
	itParam("ACON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ACON test ' + JSON.stringify(value)});
		expected = ":SB780N90" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeACON(value.node, value.event);
        var decode = cbusMsg.decodeACON(encode);
		winston.info({message: 'cbusMessage test: ACON encode ' + encode});
		winston.info({message: 'cbusMessage test: ACON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
        expect(decode.mnemonic = 'ACON');
        expect(decode.opCode = '90');
	})


    // 91 ACOF
    //
	itParam("ACOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ACOF test ' + JSON.stringify(value)});
		expected = ":SB780N91" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeACOF(value.node, value.event);
        var decode = cbusMsg.decodeACOF(encode);
		winston.info({message: 'cbusMessage test: ACOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ACOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
        expect(decode.mnemonic = 'ACOF');
        expect(decode.opCode = '91');
	})


    // 95 EVULN
    //
	function GetTestCase_EVULN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) eventName = '00000000';
			if (EV == 2) eventName = '00000001';
			if (EV == 3) eventName = 'FFFFFFFF';
			testCases.push({'event':eventName});
		}
		return testCases;
	}

	itParam("EVULN test eventName ${value.eventName}", GetTestCase_EVULN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN EVULN test ' + JSON.stringify(value)});
		expected = ":SB780N95" + value.eventName + ";";
        var encode = cbusMsg.encodeEVULN(value.eventName);
        var decode = cbusMsg.decodeEVULN(encode);
		winston.info({message: 'cbusMessage test: EVULN encode ' + encode});
		winston.info({message: 'cbusMessage test: EVULN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.eventName = value.eventName);
        expect(decode.mnemonic = 'EVULN');
        expect(decode.opCode = '95');
	})


    // 96 NVSET
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

	itParam("NVSET test nodeId ${value.nodeId} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVSET(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NVSET test ' + JSON.stringify(value)});
		expected = ":SB780N96" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
        var encode = cbusMsg.encodeNVSET(value.nodeId, value.nvIndex, value.nvValue);
        var decode = cbusMsg.decodeNVSET(encode);
		winston.info({message: 'cbusMessage test: NVSET encode ' + encode});
		winston.info({message: 'cbusMessage test: NVSET decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.nodeId);
        expect(decode.nodeVariableIndex = value.nvIndex);
        expect(decode.nodeVariableValue = value.nvValue);
        expect(decode.mnemonic = 'NVSET');
        expect(decode.opCode = '96');
	})


    // 97 NVANS
    //
	function GetTestCase_NVANS () {
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

	itParam("NVANS test nodeId ${value.nodeId} nvIndex ${value.nvIndex} nvValue ${value.nvValue}", GetTestCase_NVANS(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN NVANS test ' + JSON.stringify(value)});
		expected = ":SB780N97" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
        var encode = cbusMsg.encodeNVANS(value.nodeId, value.nvIndex, value.nvValue);
        var decode = cbusMsg.decodeNVANS(encode);
		winston.info({message: 'cbusMessage test: NVANS encode ' + encode});
		winston.info({message: 'cbusMessage test: NVANS decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.nodeId);
        expect(decode.nodeVariableIndex = value.nvIndex);
        expect(decode.nodeVariableValue = value.nvValue);
        expect(decode.mnemonic = 'NVANS');
        expect(decode.opCode = '97');
	})


    // 98 ASON
    //
	itParam("ASON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ASON test ' + JSON.stringify(value)});
		expected = ":SB780N98" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeASON(value.node, value.event);
        var decode = cbusMsg.decodeASON(encode);
		winston.info({message: 'cbusMessage test: ASON encode ' + encode});
		winston.info({message: 'cbusMessage test: ASON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
        expect(decode.mnemonic = 'ASON');		
	})


    // 99 ASOF
    //
	itParam("ASOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ASOF test ' + JSON.stringify(value)});
		expected = ":SB780N99" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeASOF(value.node, value.event);
        var decode = cbusMsg.decodeASOF(encode);
		winston.info({message: 'cbusMessage test: ASOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ASOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
        expect(decode.mnemonic = 'ASOF');
        expect(decode.opCode = '99');
	})


    // 9B PARAN
    //
	function GetTestCase_PARAN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (PI = 1; PI < 4; PI++) {
				if (PI == 1) parameterIndex = 0;
				if (PI == 2) parameterIndex = 1;
				if (PI == 3) parameterIndex = 255;
				for (PV = 1; PV < 4; PV++) {
					if (PV == 1) parameterValue = 0;
					if (PV == 2) parameterValue = 1;
					if (PV == 3) parameterValue = 255;
					testCases.push({'nodeId':nodeId, 'parameterIndex':parameterIndex, 'parameterValue':parameterValue});
				}
			}
		}
		return testCases;
	}

	itParam("PARAN test nodeId ${value.nodeId} parameterIndex ${value.parameterIndex} parameterValue ${value.parameterValue}", GetTestCase_PARAN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN PARAN test ' + JSON.stringify(value)});
		expected = ":SB780N9B" + decToHex(value.nodeId, 4) + decToHex(value.parameterIndex, 2) + decToHex(value.parameterValue, 2) + ";";
        var encode = cbusMsg.encodePARAN(value.nodeId, value.parameterIndex, value.eventVariableIndex);
        var decode = cbusMsg.decodePARAN(encode);
		winston.info({message: 'cbusMessage test: PARAN encode ' + encode});
		winston.info({message: 'cbusMessage test: PARAN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.nodeId);
        expect(decode.parameterIndex = value.parameterIndex);
        expect(decode.parameterValue = value.parameterValue);
        expect(decode.mnemonic = 'PARAN');
        expect(decode.opCode = '9B');
	})


    // 9C REVAL
    //
	function GetTestCase_REVAL () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (ENindex = 1; ENindex < 4; ENindex++) {
				if (ENindex == 1) eventIndex = 0;
				if (ENindex == 2) eventIndex = 1;
				if (ENindex == 3) eventIndex = 255;
				for (EVindex = 1; EVindex < 4; EVindex++) {
					if (EVindex == 1) eventVariableIndex = 0;
					if (EVindex == 2) eventVariableIndex = 1;
					if (EVindex == 3) eventVariableIndex = 255;
					testCases.push({'nodeId':nodeId, 'eventIndex':eventIndex, 'eventVariableIndex':eventVariableIndex});
				}
			}
		}
		return testCases;
	}

	itParam("REVAL test nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventVariableIndex ${value.eventVariableIndex}", GetTestCase_REVAL(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN REVAL test ' + JSON.stringify(value)});
		expected = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventVariableIndex, 2) + ";";
        var encode = cbusMsg.encodeREVAL(value.nodeId, value.eventIndex, value.eventVariableIndex);
        var decode = cbusMsg.decodeREVAL(encode);
		winston.info({message: 'cbusMessage test: REVAL encode ' + encode});
		winston.info({message: 'cbusMessage test: REVAL decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.nodeId);
        expect(decode.eventIndex = value.eventIndex);
        expect(decode.eventVariableIndex = value.eventVariableIndex);
        expect(decode.mnemonic = 'REVAL');
        expect(decode.opCode = '9C');
	})


    // B5 NEVAL
    //
	function GetTestCase_NEVAL () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
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
                        testCases.push({'nodeId':nodeId, 'eventIndex':eventIndex, 'eventVariableIndex':eventVariableIndex, 'eventVariableValue':eventVariableValue});
                    }
                }
			}
		}
		return testCases;
	}

	itParam("NEVAL test nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventVariableIndex ${value.eventVariableIndex} eventVariableValue ${value.eventVariableValue}", 
        GetTestCase_NEVAL(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN NEVAL test ' + JSON.stringify(value)});
            expected = ":SB780NB5" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventVariableIndex, 2) + decToHex(value.eventVariableValue, 2) + ";";
            var encode = cbusMsg.encodeNEVAL(value.nodeId, value.eventIndex, value.eventVariableIndex, value.eventVariableValue);
            var decode = cbusMsg.decodeNEVAL(encode);
            winston.info({message: 'cbusMessage test: NEVAL encode ' + encode});
            winston.info({message: 'cbusMessage test: NEVAL decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected);
            expect(decode.nodeId = value.nodeId);
            expect(decode.eventIndex = value.eventIndex);
            expect(decode.eventVariableIndex = value.eventVariableIndex);
            expect(decode.eventVariableValue = value.eventVariableValue);
            expect(decode.mnemonic = 'NEVAL');
            expect(decode.opCode = 'B5');
	})


    // B6 PNN
    //
	function GetTestCase_PNN () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
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
                        testCases.push({'nodeId':nodeId, 'manufacturerId':manufacturerId, 'moduleId':moduleId, 'flags':flags});
                    }
                }
			}
		}
		return testCases;
	}
    // PNN Format: [<MjPri><MinPri=3><CANID>]<B6><NN Hi><NN Lo><Manuf Id><Module Id><Flags>
	itParam("PNN test nodeId ${value.nodeId} manufacturerId ${value.manufacturerId} moduleId ${value.moduleId} flags ${value.flags}", 
        GetTestCase_PNN(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN NEVAL test ' + JSON.stringify(value)});
            expected = ":SB780NB6" + decToHex(value.nodeId, 4) + decToHex(value.manufacturerId, 2) + decToHex(value.moduleId, 2) + decToHex(value.flags, 2) + ";";
            var encode = cbusMsg.encodePNN(value.nodeId, value.manufacturerId, value.moduleId, value.flags);
            var decode = cbusMsg.decodePNN(encode);
            winston.info({message: 'cbusMessage test: PNN encode ' + encode});
            winston.info({message: 'cbusMessage test: PNN decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected);
            expect(decode.nodeId = value.nodeId);
            expect(decode.manufacturerId = value.manufacturerId);
            expect(decode.moduleId = value.moduleId);
            expect(decode.flags = value.flags);
            expect(decode.mnemonic = 'PNN');
            expect(decode.opCode = 'B6');
	})


    // D2 EVLRN
    //
	function GetTestCase_EVLRN () {
		var testCases = [];
		for (EV = 1; EV < 4; EV++) {
			if (EV == 1) eventName = '00000000';
			if (EV == 2) eventName = '00000001';
			if (EV == 3) eventName = 'FFFFFFFF';
			for (EVindex = 1; EVindex < 4; EVindex++) {
				if (EVindex == 1) eventVariableIndex = 0;
				if (EVindex == 2) eventVariableIndex = 1;
				if (EVindex == 3) eventVariableIndex = 255;
				for (EVvalue = 1; EVvalue < 4; EVvalue++) {
					if (EVvalue == 1) eventVariableValue = 0;
					if (EVvalue == 2) eventVariableValue = 1;
					if (EVvalue == 3) eventVariableValue = 255;
					testCases.push({'eventName':eventName, 'eventVariableIndex':eventVariableIndex, 'eventVariableValue':eventVariableValue});
				}
			}
		}
		return testCases;
	}

	itParam("EVLRN test eventName ${value.eventName} eventVariableIndex ${value.eventVariableIndex} eventVariableValue ${value.eventVariableValue}", GetTestCase_EVLRN(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN EVLRN test ' + JSON.stringify(value)});
		expected = ":SB780ND2" + value.eventName + decToHex(value.eventVariableIndex, 2) + decToHex(value.eventVariableValue, 2) + ";";
        var encode = cbusMsg.encodeEVLRN(value.eventName, value.eventVariableIndex, value.eventVariableValue);
        var decode = cbusMsg.decodeEVLRN(encode);
		winston.info({message: 'cbusMessage test: EVLRN encode ' + encode});
		winston.info({message: 'cbusMessage test: EVLRN decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.eventName = value.eventName);
        expect(decode.eventVariableIndex = value.eventVariableIndex);
        expect(decode.eventVariableValue = value.eventVariableValue);
        expect(decode.mnemonic = 'EVLRN');
        expect(decode.opCode = 'D2');
	})


    // E1 PLOC
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

	itParam("PLOC test session ${value.session} address ${value.address} speed ${value.speed} direction ${value.direction} Fn1 ${value.Fn1} Fn2 ${value.Fn2} Fn3 ${value.Fn3}",
        GetTestCase_PLOC(), function (value) {
            winston.info({message: 'cbusMessage test: BEGIN PLOC test ' + JSON.stringify(value)});
            // PLOC Format: [<MjPri><MinPri=2><CANID>]<E1><Session><AddrH><AddrL><Speed/Dir><Fn1><Fn2><Fn3>
            var speedDir = value.speed + parseInt((value.direction == 'Reverse') ? 0 : 128)
            expected = ":SB780NE1" + decToHex(value.session, 2) + decToHex(value.address, 4) + decToHex(speedDir, 2) +
                decToHex(value.Fn1, 2) + decToHex(value.Fn2, 2) + decToHex(value.Fn3, 2) + ";";
            var encode = cbusMsg.encodePLOC(value.session, value.address, value.speed, value.direction, value.Fn1, value.Fn2, value.Fn3);
            var decode = cbusMsg.decodePLOC(encode);
            winston.info({message: 'cbusMessage test: PLOC encode ' + encode});
            winston.info({message: 'cbusMessage test: PLOC decode ' + JSON.stringify(decode)});
            expect(encode).to.equal(expected);
            expect(decode.nodeId = value.nodeId);
            expect(decode.session = value.session);
            expect(decode.address = value.address);
            expect(decode.speed = value.speed);
            expect(decode.direction = value.direction);
            expect(decode.Fn1 = value.Fn1);
            expect(decode.Fn2 = value.Fn2);
            expect(decode.Fn3 = value.Fn3);            
            expect(decode.mnemonic = 'PLOC');
            expect(decode.opCode = 'E1');
	})


    // F2 ENRSP
    //
	function GetTestCase_ENRSP () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
            for (EV = 1; EV < 4; EV++) {
                if (EV == 1) event = '00000000';
                if (EV == 2) event = '00000001';
                if (EV == 3) event = 'FFFFFFFF';
                for (EVindex = 1; EVindex < 4; EVindex++) {
                    if (EVindex == 1) eventIndex = 0;
                    if (EVindex == 2) eventIndex = 1;
                    if (EVindex == 3) eventIndex = 255;
					testCases.push({'nodeId':nodeId, 'event':event, 'eventIndex':eventIndex});
				}
			}
		}
		return testCases;
	}

	itParam("ENRSP test nodeId ${value.nodeId} event ${value.event} eventIndex ${value.eventIndex}", GetTestCase_ENRSP(), function (value) {
		winston.info({message: 'cbusMessage test: BEGIN ENRSP test ' + JSON.stringify(value)});
        // ENRSP Format: [<MjPri><MinPri=3><CANID>]<F2><NN hi><NN lo><EN3><EN2><EN1><EN0><EN#>
		expected = ":SB780NF2" + decToHex(value.nodeId, 4) + value.event + decToHex(value.eventIndex, 2) + ";";
        var encode = cbusMsg.encodeENRSP(value.nodeId, value.event, value.eventIndex);
        var decode = cbusMsg.decodeENRSP(encode);
		winston.info({message: 'cbusMessage test: ENRSP encode ' + encode});
		winston.info({message: 'cbusMessage test: ENRSP decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.nodeId);
        expect(decode.event = value.event);
        expect(decode.eventIndex = value.eventIndex);
        expect(decode.mnemonic = 'ENRSP');
        expect(decode.opCode = 'F2');
	})






})
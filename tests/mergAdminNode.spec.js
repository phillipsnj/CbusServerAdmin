const expect = require('chai').expect;
var itParam = require('mocha-param');
var winston = require('./config/winston_test.js');


const NET_PORT = 5550;
const NET_ADDRESS = "127.0.0.1"
const admin = require('./../merg/mergAdminNode.js')
const file = 'config/nodeConfig.json'
const Mock_Cbus = require('./mock_CbusNetwork.js')



function decToHex(num, len) {
    let output = Number(num).toString(16).toUpperCase()
    var padded = "00000000" + output
    return padded.substr(-len)
}


describe('mergAdminNode tests', function(){
	let cbus = new Mock_Cbus.mock_CbusNetwork(NET_PORT);
	let node = new admin.cbusAdmin(file, NET_ADDRESS,NET_PORT);

	before(function(done) {
		winston.info({message: ' '});
		winston.info({message: '======================================================================'});
		winston.info({message: '------------------------ mergAdminNode tests -------------------------'});
		winston.info({message: '======================================================================'});
		winston.info({message: ' '});

        node.cbusSend(node.QNN())
		done();
	});

	after(function() {
		cbus.stopServer();
		winston.info({message: 'Close mergAdminNode test Client'});

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

	it("Wait.....", function (done) {
		setTimeout(function(){
			done();
		}, 1000);
	})


	
	itParam("ACOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ACOF test ' + JSON.stringify(value)});
		expected = ":SB780N91" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
		expect(node.ACOF(value.node, value.event)).to.equal(expected);
		done();
	})

	itParam("ACON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'mergAdminNode test: BEGIN ACON test ' + JSON.stringify(value)});
		expected = ":SB780N90" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
		expect(node.ACON(value.node, value.event)).to.equal(expected);
		done();
	})

	function GetTestCase_ACCESSORY_SHORT () {
		var testCases = [];
		for (NN = 1; NN < 4; NN++) {
			if (NN == 1) nodeId = 0;
			if (NN == 2) nodeId = 1;
			if (NN == 3) nodeId = 65535;
			for (DN = 1; DN < 4; DN++) {
				if (DN == 1) deviceNum = 0;
				if (DN == 2) deviceNum = 1;
				if (DN == 3) deviceNum = 65535;
				testCases.push({'nodeId':nodeId, 'deviceNum':deviceNum});
			}
		}
		return testCases;
	}


	itParam("ASOF test nodeId ${value.nodeId} deviceNum ${value.deviceNum}", GetTestCase_ACCESSORY_SHORT(), function (value) {
		// Format: [<MjPri><MinPri=3><CANID>]<99><NN hi><NN lo><DN hi><DN lo>
		winston.info({message: 'mergAdminNode test: BEGIN ASOF test ' + JSON.stringify(value)});
		expected = ":SB780N99" + decToHex(value.nodeId, 4) + decToHex(value.deviceNum, 4) + ";";
		expect(node.ASOF(value.nodeId, value.deviceNum)).to.equal(expected);
	})


	itParam("ASON test nodeId ${value.nodeId} deviceNum ${value.deviceNum}", GetTestCase_ACCESSORY_SHORT(), function (value) {
		// Format: [<MjPri><MinPri=3><CANID>]<98><NN hi><NN lo><DN hi><DN lo>
		winston.info({message: 'mergAdminNode test: BEGIN ASON test ' + JSON.stringify(value)});
		expected = ":SB780N98" + decToHex(value.nodeId, 4) + decToHex(value.deviceNum, 4) + ";";
		expect(node.ASON(value.nodeId, value.deviceNum)).to.equal(expected);
	})


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


	itParam("EVLRN test event ${value.event} eventIndex ${value.eventIndex} eventValue ${value.eventValue}", GetTestCase_EVLRN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN EVLRN test ' + JSON.stringify(value)});
		expected = ":SB780ND2" + value.event + decToHex(value.eventIndex, 2) + decToHex(value.eventValue, 2) + ";";
		expect(node.EVLRN(value.event, value.eventIndex, value.eventValue)).to.equal(expected);
	})


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


	itParam("EVULN test event ${value.event}", GetTestCase_EVULN(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN EVULN test ' + JSON.stringify(value)});
		expected = ":SB780N95" + value.event + ";";
		expect(node.EVULN(value.event)).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN NERD test ' + JSON.stringify(value)});
		expected = ":SB780N57" + decToHex(value.nodeId, 4) + ";";
		expect(node.NERD(value.nodeId)).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN NNLRN test ' + JSON.stringify(value)});
		expected = ":SB780N53" + decToHex(value.nodeId, 4) + ";";
		expect(node.NNLRN(value.nodeId)).to.equal(expected);
	})


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


	itParam("NNLRN test invalid nodeId ${value.nodeId}", GetTestCase_NNLRN_invalid(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN NNLRN invalid test ' + JSON.stringify(value)});
		var expected;	// leave undefined
		expect(node.NNLRN(value.nodeId)).to.equal(expected);
	})




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
		winston.info({message: 'mergAdminNode test: BEGIN NNULN test ' + JSON.stringify(value)});
		expected = ":SB780N54" + decToHex(value.nodeId, 4) + ";";
		expect(node.NNULN(value.nodeId)).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN NVRD test ' + JSON.stringify(value)});
		expected = ":SB780N71" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + ";";
		expect(node.NVRD(value.nodeId, value.nvIndex)).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN NVSET test ' + JSON.stringify(value)});
		expected = ":SB780N96" + decToHex(value.nodeId, 4) + decToHex(value.nvIndex, 2) + decToHex(value.nvValue, 2) + ";";
		expect(node.NVSET(value.nodeId, value.nvIndex, value.nvValue)).to.equal(expected);
	})


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


	itParam("REVAL test nodeId ${value.nodeId} eventIndex ${value.eventIndex} eventValue ${value.eventValue}", GetTestCase_REVAL(), function (value) {
		winston.info({message: 'mergAdminNode test: BEGIN REVAL test ' + JSON.stringify(value)});
		expected = ":SB780N9C" + decToHex(value.nodeId, 4) + decToHex(value.eventIndex, 2) + decToHex(value.eventValue, 2) + ";";
		expect(node.REVAL(value.nodeId, value.eventIndex, value.eventValue)).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN RQEVN test ' + JSON.stringify(value)});
		expected = ":SB780N58" + decToHex(value.nodeId, 4) + ";";
		expect(node.RQEVN(value.nodeId)).to.equal(expected);
	})


	it("RQNP test", function () {
		winston.info({message: 'mergAdminNode test: BEGIN RQNP test '});
		expected = ":SB780N10" + ";";
		expect(node.RQNP()).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN RQNPN test ' + JSON.stringify(value)});
		expected = ":SB780N73" + decToHex(value.nodeId, 4) + decToHex(value.paramIndex, 2) + ";";
		expect(node.RQNPN(value.nodeId, value.paramIndex)).to.equal(expected);
	})


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
		winston.info({message: 'mergAdminNode test: BEGIN QLOC test ' + JSON.stringify(value)});
		expected = ":SB780N22" + decToHex(value.session, 2) + ";";
		expect(node.QLOC(value.session)).to.equal(expected);
	})


	it('QNN test', function() {
		winston.info({message: 'mergAdminNode test: BEGIN QNN test '});
		expect(node.QNN()).to.equal(":SB780N0D;");

	});

})
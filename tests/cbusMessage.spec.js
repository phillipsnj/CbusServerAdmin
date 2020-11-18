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

	it("Wait.....", function (done) {
		setTimeout(function(){
			done();
		}, 1000);
	})


	
	itParam("ACOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ACOF test ' + JSON.stringify(value)});
		expected = ":SB780N91" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeACOF(value.node, value.event);
        var decode = cbusMsg.decodeACOF(encode);
		winston.info({message: 'cbusMessage test: ACOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ACOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	itParam("ACON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ACON test ' + JSON.stringify(value)});
		expected = ":SB780N90" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeACON(value.node, value.event);
        var decode = cbusMsg.decodeACON(encode);
		winston.info({message: 'cbusMessage test: ACON encode ' + encode});
		winston.info({message: 'cbusMessage test: ACON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	itParam("ASOF test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ASOF test ' + JSON.stringify(value)});
		expected = ":SB780N99" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeASOF(value.node, value.event);
        var decode = cbusMsg.decodeASOF(encode);
		winston.info({message: 'cbusMessage test: ASOF encode ' + encode});
		winston.info({message: 'cbusMessage test: ASOF decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


	itParam("ASON test nodeId ${value.node} event ${value.event}", TestCases_NodeEvent, function (done, value) {
		winston.info({message: 'cbusMessage test: BEGIN ASON test ' + JSON.stringify(value)});
		expected = ":SB780N98" + decToHex(value.node, 4) + decToHex(value.event, 4) + ";";
        var encode = cbusMsg.encodeASON(value.node, value.event);
        var decode = cbusMsg.decodeASON(encode);
		winston.info({message: 'cbusMessage test: ASON encode ' + encode});
		winston.info({message: 'cbusMessage test: ASON decode ' + JSON.stringify(decode)});
		expect(encode).to.equal(expected);
        expect(decode.nodeId = value.node);
        expect(decode.eventNumber = value.event);
		done();ent
	})


})
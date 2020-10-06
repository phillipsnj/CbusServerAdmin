'use strict';
const socketIO = require('socket.io');

const jsonfile = require('jsonfile')
let layoutDetails = jsonfile.readFileSync('./config/layoutDetails.json')


function wsserver(httpserver, node) {
    const io = socketIO(httpserver);

    io.on('connection', function(socket){
        console.log('an user connected')
        node.cbusSend(node.QNN())
        io.emit('layoutDetails', layoutDetails)
        socket.on('QUERY_ALL_NODES', function(){
            console.log('QUERY_ALL_NODES');
            node.cbusSend(node.QNN())
        })
        socket.on('REQUEST_ALL_NODE_PARAMETERS', function(data){ //Request Node Parameter
            console.log(`REQUEST_ALL_NODE_PARAMETERS ${JSON.stringify(data)}`);
            for (let i = 0; i <= data.parameters; i++) {
                let time = i*100
                setTimeout(function() {node.cbusSend(node.RQNPN(data.nodeId, i))},time)
            }
            //node.cbusSend(node.RQNPN(data.nodeId, data.parameter))
        })
        socket.on('RQNPN', function(data){ //Request Node Parameter
            console.log(`RQNPN ${JSON.stringify(data)}`);
            node.cbusSend(node.RQNPN(data.nodeId, data.parameter))
        })
        socket.on('REQUEST_ALL_NODE_VARIABLES', function(data){
            console.log(`REQUEST_ALL_NODE_VARIABLES ${JSON.stringify(data)}`);
            if (data.start === undefined) {
                data.start = 1
            }
            if (data.delay === undefined) {
                data.delay = 100
            }
            for (let i = data.start; i <= data.variables; i++) {
                let time = i*data.delay
                setTimeout(function() {node.cbusSend(node.NVRD(data.nodeId, i))},time)
            }
        })
        socket.on('REQUEST_NODE_VARIABLE', function(data){
            console.log(`REQUEST_NODE_VARIABLE ${JSON.stringify(data)}`);
            node.cbusSend(node.NVRD(data.nodeId, data.variableId))
        })
        socket.on('UPDATE_NODE_VARIABLE', function(data){
            node.cbusSend(node.NVSET(data.nodeId, data.variableId, data.variableValue))
            console.log(`UPDATE_NODE_VARIABLE ${JSON.stringify(data)}`);
            setTimeout(function() {node.cbusSend(node.NVRD(data.nodeId, data.variableId))},100)
        })
        socket.on('UPDATE_NODE_VARIABLE_IN_LEARN_MODE', function(data){
            console.log(`NVSET-learn ${JSON.stringify(data)}`);
            node.cbusSend(node.NNLRN(data.nodeId))
            node.cbusSend(node.NVSET(data.nodeId, data.variableId, data.variableValue))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.NVRD(data.nodeId, data.variableId))
            node.cbusSend(node.NNULN(data.nodeId))
        })
        socket.on('REQUEST_ALL_NODE_EVENTS', function(data){
            console.log(`REQUEST_ALL_NODE_EVENTS ${JSON.stringify(data)}`);
            node.cbusSend(node.NERD(data.nodeId))
        })
        socket.on('REQUEST_ALL_EVENT_VARIABLES', function(data){
            console.log(`REQUEST_EVENT_VARIABLE ${JSON.stringify(data)}`);
            for (let i = 0; i <= data.variables; i++) {
                let time = i*100
                setTimeout(function() {node.cbusSend(node.REVAL(data.nodeId, data.eventIndex, i))},time)
            }
        })
        socket.on('REQUEST_EVENT_VARIABLE', function(data){
            console.log(`REQUEST_EVENT_VARIABLE ${JSON.stringify(data)}`);
            node.cbusSend(node.REVAL(data.nodeId, data.eventIndex, data.eventVariableId))
        })
        socket.on('UPDATE_EVENT_VARIABLE', function(data){
            console.log(`EVLRN ${JSON.stringify(data)}`);
            node.cbusSend(node.NNLRN(data.nodeId))
            node.cbusSend(node.EVLRN(data.eventName, data.eventVariableId, data.eventVariableValue))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.REVAL(data.nodeId, data.eventIndex, data.eventVariableId))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.NERD(data.nodeId))
            node.cbusSend(node.RQEVN(data.nodeId))
        })
        socket.on('ACCESSORY_LONG_ON', function(data){
            console.log(`ACCESSORY_LONG_ON ${JSON.stringify(data)}`);
            node.cbusSend(node.ACON(data.nodeId, data.eventId))
        })
        socket.on('ACCESSORY_LONG_OFF', function(data){
            console.log(`ACCESSORY_LONG_OFF ${JSON.stringify(data)}`);
            node.cbusSend(node.ACOF(data.nodeId, data.eventId))
        })
        socket.on('TEACH_EVENT', function(data){
            console.log(`EVLRN ${JSON.stringify(data)}`);
            node.cbusSend(node.NNLRN(data.nodeId))
            node.cbusSend(node.EVLRN(data.eventName, data.eventId, data.eventVal))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.NERD(data.nodeId))
            node.cbusSend(node.RQEVN(data.nodeId))
        })
        socket.on('REMOVE_EVENT', function(data){
            console.log(`REMOVE_EVENT ${JSON.stringify(data)}`);
            node.cbusSend(node.NNLRN(data.nodeId))
            node.cbusSend(node.EVULN(data.eventName))
            node.cbusSend(node.NNULN(data.nodeId))
            node.removeNodeEvents(data.nodeId)
            node.cbusSend(node.NERD(data.nodeId))
            node.cbusSend(node.RQEVN(data.nodeId))
        })
        socket.on('CLEAR_NODE_EVENTS', function(data){
            console.log(`CLEAR_NODE_EVENTS ${data.nodeId}`)
            node.removeNodeEvents(data.nodeId);
        })
        socket.on('REFRESH_EVENTS', function(){
            console.log(`REFRESH_EVENTS`)
            node.refreshEvents();
        })
        socket.on('UPDATE_LAYOUT_DETAILS', function(data){
            console.log(`UPDATE_LAYOUT_DETAILS ${JSON.stringify(data)}`)
            layoutDetails = data
            jsonfile.writeFileSync('./config/layoutDetails.json', layoutDetails, {spaces: 2, EOL: '\r\n'})
            io.emit('layoutDetails', layoutDetails)
        })
        socket.on('CLEAR_CBUS_ERRORS', function(data){
            console.log(`CLEAR_CBUS_ERRORS`)
            node.clearCbusErrors()
        })
    });


    node.on('events', function (events) {
        //console.log(`Events :${JSON.stringify(events)}`)
        io.emit('events', events);
    })

    node.on('nodes', function (nodes) {
        //console.log(`Nodes Sent :${JSON.stringify(nodes)}`)
        io.emit('nodes', nodes);
    })

    node.on('cbusError', function (cbusErrors) {
        console.log(`CBUS - ERROR :${JSON.stringify(cbusErrors)}`)
        io.emit('cbusError', cbusErrors);
    })

    node.on('dccError', function (error) {
        console.log(`CBUS - ERROR :${JSON.stringify(error)}`)
        io.emit('dccError', error);
    })

    node.on('cbusNoSupport', function (cbusNoSupport) {
        console.log(`CBUS - Op Code Unknown : ${cbusNoSupport.opCode}`)
        io.emit('cbusNoSupport', cbusNoSupport);
    })

    node.on('dccSessions', function (dccSessions) {
        //console.log(`CBUS - Op Code Unknown : ${cbusNoSupport.opCode}`)
        io.emit('dccSessions', dccSessions);
    })

    node.on('requestNodeNumber', function () {
        const newNodeId=parseInt(layoutDetails.layoutDetails.nextNodeId)
        console.log(`requestNodeNumber : ${newNodeId}`)
        node.cbusSend(node.SNN(newNodeId))
        layoutDetails.layoutDetails.nextNodeId = newNodeId+1
        jsonfile.writeFileSync('./config/layoutDetails.json', layoutDetails, {spaces: 2, EOL: '\r\n'})
        io.emit('layoutDetails', layoutDetails)
        node.cbusSend(node.QNN())
    })

    node.on('cbus', function (task) {
        console.log(`cbus :${JSON.stringify(task)}`)
    })
}

module.exports = wsserver;
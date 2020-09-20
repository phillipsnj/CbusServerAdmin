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
        socket.on('QNN', function(){
            console.log('QNN Requested');
            node.cbusSend(node.QNN())
        })
        socket.on('RQNPN', function(data){ //Request Node Parameter
            console.log(`RQNPN ${JSON.stringify(data)}`);
            node.cbusSend(node.RQNPN(data.nodeId, data.parameter))
        })
        socket.on('NVRD', function(data){
            console.log(`NVRD ${JSON.stringify(data)}`);
            node.cbusSend(node.NVRD(data.nodeId, data.variableId))
        })
        socket.on('NVSET', function(data){
            console.log(`NVSET ${JSON.stringify(data)}`);
            node.cbusSend(node.NVSET(data.nodeId, data.variableId, data.variableValue))
            node.cbusSend(node.NVRD(data.nodeId, data.variableId))
        })
        socket.on('NERD', function(data){
            console.log(`NERD ${JSON.stringify(data)}`);
            node.cbusSend(node.NERD(data.nodeId))
        })
        socket.on('REVAL', function(data){
            console.log(`REVAL ${JSON.stringify(data)}`);
            node.cbusSend(node.REVAL(data.nodeId, data.actionId, data.valueId))
        })
        socket.on('EVLRN', function(data){
            console.log(`EVLRN ${JSON.stringify(data)}`);
            node.cbusSend(node.NNLRN(data.nodeId))
            node.cbusSend(node.EVLRN(data.eventName, data.eventId, data.eventVal))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.REVAL(data.nodeId, data.actionId, data.eventId))
            node.cbusSend(node.NNULN(data.nodeId))
            node.cbusSend(node.NERD(data.nodeId))
            node.cbusSend(node.RQEVN(data.nodeId))
        })
        socket.on('ACON', function(data){
            console.log(`ACON ${JSON.stringify(data)}`);
            node.cbusSend(node.ACON(data.nodeId, data.eventId))
        })
        socket.on('ACOF', function(data){
            console.log(`ACOF ${JSON.stringify(data)}`);
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
        socket.on('EVULN', function(data){
            console.log(`EVULN ${JSON.stringify(data)}`);
            node.cbusSend(node.NNLRN(data.nodeId))
            node.cbusSend(node.EVULN(data.eventName.event, data.eventName.actionId, data.eventName.eventVal))
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
const path = require('path')
const http = require('http')
const express = require('express')
const jsonfile = require('jsonfile')
//const socketio = require('socket.io')
var winston = require('./config/winston.js');

var serveStatic = require('serve-static')

var startClient;
process.argv.forEach(function (val) {
	if (val == "--startClient") {startClient = true;}
});



const app = express()
const server = http.createServer(app)
//const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname,'public')))
//
// Added to allow access to node_module without exposing the folder to the NET.
//
app.use(serveStatic(path.join(__dirname, '/node_modules')));
app.use('/css',express.static(__dirname +'/node_modules'));
//
// *********************************************************
//

const system = jsonfile.readFileSync('./config/systemConfig.json')

const NET_PORT = system.serverPort
const NET_ADDRESS = system.server
//const NET_ADDRESS = "mergDev4"
const PORT = system.port
const LAYOUT = system.config

const admin = require('./merg/mergAdminNode.js')

let node = new admin.cbusAdmin(LAYOUT,NET_ADDRESS,NET_PORT);

const websocket_Server = require('./wsserver')
websocket_Server(LAYOUT,server, node)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

if (Boolean(startClient)) {
	// open webpage in default browser
	require("openurl").open("http://localhost:" + PORT)
}

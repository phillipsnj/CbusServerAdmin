const path = require('path')
const http = require('http')
const express = require('express')
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

const NET_PORT = 5550;
const NET_ADDRESS = "localhost"
//const NET_ADDRESS = "mergDev4"
const PORT = 3000

const admin = require('./merg/mergAdminNode.js')

const layout_path = 'config/'

let node = new admin.cbusAdmin(layout_path,NET_ADDRESS,NET_PORT);

const websocket_Server = require('./wsserver')
websocket_Server(layout_path,server, node)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

if (Boolean(startClient)) {
	// open webpage in default browser
	require("openurl").open("http://localhost:" + PORT)
}

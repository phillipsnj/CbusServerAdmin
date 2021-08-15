const path = require('path')
const http = require('http')
const express = require('express')
const jsonfile = require('jsonfile')
//const socketio = require('socket.io')
var winston = require('./config/winston.js');
const fs = require('fs');

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

const system = getSystemConfig()

const NET_PORT = system.serverPort
const NET_ADDRESS = system.server
//const NET_ADDRESS = "mergDev4"
const PORT = system.port
const LAYOUT = system.config


const websocket_Server = require('./wsserver')
websocket_Server(LAYOUT, server, NET_ADDRESS, NET_PORT)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

if (Boolean(startClient)) {
	// open webpage in default_old browser
	require("openurl").open("http://localhost:" + PORT)
}



function getSystemConfig() {
            var directory = "./config/"
            
            // check if directory exists
            if (fs.existsSync(directory)) {
                winston.info({message: `Config: Directory exists`});
            } else {
                winston.info({message: `Config: Directory not found - creating new one`});
                fs.mkdir(directory, function(err) {
                  if (err) {
                    console.log(err)
                  } else {
                    winston.info({message: `Config: New directory successfully created.`});
                  }
                })            
            }

            // check if config file exists
            if (fs.existsSync(directory + 'systemConfig.json')) {
                winston.info({message: `systemConfig:  file exists`});
            } else {
                winston.info({message: `systemConfig: file not found - creating new one`});
                const systemConfig = {
                    "port": 3000,
                    "server": "localhost",
                    "serverPort": 5550,
                    "config": "default",
                    }
                jsonfile.writeFileSync(directory + "/systemConfig.json", systemConfig, {spaces: 2, EOL: '\r\n'})
            }
            
            // ok, now read it in
            return jsonfile.readFileSync('./config/systemConfig.json')
}


const path = require('path')
const http = require('http')
const express = require('express')
//const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
//const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname,'public')))

const NET_PORT = 5550;
const NET_ADDRESS = "192.168.8.123"
const PORT = 3000

const admin = require('./merg/mergAdminNode.js')

const file = 'config/nodeConfig.json'

let node = new admin.cbusAdmin(file,NET_ADDRESS,NET_PORT);

const websocket_Server = require('./wsserver')
websocket_Server(server, node)


server.listen(PORT, () => console.log(`Server running on port ${PORT}`))


const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = express();
const server = http.createServer(app)
const io = socketio(server); //socketio da raboti so raw http server

const { generateMessage } = require('./utils/messages')
const { generateLocationMessage } = require('./utils/locationMessage')



const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// let count= 0

io.on('connection', (socket)=>{
    console.log("New WebSocket connection");

     socket.emit('message', generateMessage('Welcome!',''))

     socket.broadcast.emit('message', 'a new user has joined')

     socket.on('sendMessage', (message, callback) => {

        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed")
        }
         io.emit('message',generateMessage(message));
         callback()
     })


     socket.on('sendLocation',(coords, callback)=>{
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback("Location Shared")
    })

     socket.on('disconnect', ()=>{

         io.emit('message','A user has left')
        //  callback('Delivered')
     })

    // socket.on('increment', ()=>{
    //     count++;
    //     //socket.emit('countUpdated',count)
    //     io.emit('countUpdated',count)
    // })
})

server.listen(port, () =>{

    console.log("Server is up on port " +  port);
})




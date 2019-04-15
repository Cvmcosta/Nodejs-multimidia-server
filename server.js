//Projeto para a turma de Redes 2


//socket library
const socket = require ("socket.io")
//express library
const express = require("express")
const app = express()
//fs
const fs = require('fs')
//setup server
const server = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  },app)
//setup client
const io = socket(server)
var p2p = require('socket.io-p2p-server').Server;
io.use(p2p);

//setup id system
const uniqid = require('uniqid');


//love-you
const love = require("love-you")



//Routing 
app.use(express.static(__dirname + '/public'))

//Setup https
/* app.get("*", function(request, response){
    response.redirect("https://" + request.headers.host + request.url);
  }); */

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app.html')
});




//Users array
let users = []



//On Connection
io.on('connection', (socket) => {
    let socket_id = uniqid()
    let socket_user = love.random()

    
    
    while(users.find(user => {return user.username == socket_user})){
        socket_user = love.random()
    }

    let socket_obj = {username: socket_user, id: socket_id}

    users.push(socket_obj)

    socket.emit("enter_room", socket_user)

    console.log(socket_user + " connected. Id: "+socket_id)
    console.log(users)
    


    //Handles username change
    const change_username = (new_username) => {
        
        let found_user = users.find(user => {return user.username == new_username})
        

        if(found_user == undefined){            
            let index = -1;

            users.find((user, i) => { if(user.id == socket_id) return index = i})
            
            users[index].username = new_username

            socket_user = new_username
        }

    }

    
    //On disconnection
    socket.on('disconnect', () => {        
        let index = -1;
        users.find((user, i) => { if(user.id == socket_id) return index = i})
        users.splice(index,1)

        console.log(socket_user + " disconnected.")
        console.log(users)
    })


    //Entering chat room
    socket.on('message', (username) => {
        change_username(username)
        socket.emit("enter_room", socket_user, "chat")
        console.log(socket_user + " joined chat room.")
        console.log(users)
    })


    //Entering video room
    socket.on('video_call', (username) => {
        change_username(username)
        socket.emit("enter_room", socket_user, "video")
        console.log(socket_user + " joined video room.")
    })


    //Tests star video transmition
    socket.on('start-stream', function (data) {
        socket.broadcast.emit('start-stream', data)
    })

    /* //Tests star video transmition
    socket.on('ready-client', function () {
        socket.emit('ready-server')
    }) */

    
    

});



server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,  process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0")
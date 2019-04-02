//Projeto para a turma de Redes 2


//socket library
const socket = require ("socket.io")
//express library
const express = require("express")
const app = express()
//setup server
const server = require('http').createServer(app)
//setup client
const io = socket(server)
//setup id system
const uniqid = require('uniqid');


//love-you
const love = require("love-you")



//Routing 
app.use(express.static(__dirname + '/public'))
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
        socket.emit("enter_room", socket_user)
        console.log(socket_user + " joined chat room.")
        console.log(users)
    })


    //Entering video room
    socket.on('video_call', (username) => {
        change_username(username)
        socket.emit("enter_room", socket_user)
        console.log(socket_user + " joined video room.")
    })

});



server.listen(3000)
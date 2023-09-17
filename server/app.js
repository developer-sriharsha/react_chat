const express=require("express")
const cors=require('cors')
const _ = require("lodash");
const socket=require('socket.io')
const bodyParser=require('body-parser')
const {TokenAuth} = require("./Helpers/Helpers");

const Port=8070
let app=express()
app.use(cors())
app.use(bodyParser.json({limit:"5mb"}))


//Routes
const Routes=require('./Routes/index')
app.use('/Api',Routes)



//initializing Server
let server=app.listen(Port,()=>{
    console.log("server running on",Port)
})

let io=socket(server,{
    cors:{
        origin:"http://localhost:5173"
    }
})


//Setting Global Variable for storing registered users
let ConnectedUser=[]
let RegisteredUsers=[]
app.set("RegisteredUsers",RegisteredUsers)
app.set("ConnectedUser",ConnectedUser)

//sockets logic
io.on('connection',(socket)=>{
    socket.on("UserConnect",(data)=>{
        //checking token expiration
        if (TokenAuth(data.token)){
            io.to(socket.id).emit("Session_Expired",{
                status:"Fail"
            })
        }
        let index=_.findIndex(ConnectedUser,{socketID:socket.id})
        if (index===-1){
            ConnectedUser.push({UserName:data.UserName,socketID:socket.id})
        }
        io.local.emit("ReceiveChatList",{chatList:ConnectedUser})
    })


    //listening send message event
    socket.on("Send_Message",(data)=>{
        if (TokenAuth(data.token)){
            io.to(socket.id).emit("Session_Expired",{
                status:"Fail"
            })
        }
        io.to(data.socketID).emit("Receive_Message",{
            socketID: data.socketID, Message: data.Message,UserName:data.UserName
        })
    })
    socket.on("Logout",()=>{
        //updating connected users on disconnect
        let index=_.findIndex(ConnectedUser,{socketID:socket.id})
        if (index>-1){
            ConnectedUser.splice(index,1)
        }
        io.local.emit("ReceiveChatList",{chatList:ConnectedUser})
    })

    socket.on("disconnect",()=>{
        //updating connected users on disconnect
        let index=_.findIndex(ConnectedUser,{socketID:socket.id})
        if (index>-1){
            ConnectedUser.splice(index,1)
        }
        io.local.emit("ReceiveChatList",{chatList:ConnectedUser})
    })
})


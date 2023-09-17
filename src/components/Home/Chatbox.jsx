import React, {useEffect, useReducer, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {socket, socketID} from "../helpers/helpers.jsx";

const Chatbox = () => {
    let navigate = useNavigate()
    const [state, setState] = useReducer((state, newState) => ({...state, ...newState}), {
        chatList: [],
        CurrentChatDetails: {},
        SessionObj: {},
        ChatMessages: {},
        MessageObj: {
            UserName: "",
            socketID: "",
            Message: ""
        }

    })

    const initializeData = (SessionObj) => {
        setState({SessionObj})

        //Reconnecting on Mounting
        socket.emit("UserConnect",{
            UserName:SessionObj.UserName,
            token:SessionObj.token
        })

        //Session Expiration Listener
        socket.on("Session_Expired", (data) => {
            navigate('/Login')
        })

        //listening new messages
        socket.on("Receive_Message", (data) => {
            if (data) {
             let ChatMessages=state.ChatMessages
                if (ChatMessages[data.UserName]){
                    ChatMessages[data.UserName].push({Message:data.Message,socketID: data.socketID,sender:data.UserName})
                }else{
                    ChatMessages[data.UserName]=[{Message: data.Message, socketID: data.socketID, sender: data.UserName}]
                }
                setState({ChatMessages})
            }
        })

        //Getting Connected users in realtime
        socket.on("ReceiveChatList", (data) => {
            if (data) {
                let chatList = data.chatList.filter((v) => v.UserName !== SessionObj.UserName)
                setState({chatList})
            }
        })
    }
let actionTimer;
    useEffect(() => {
        let SessionObj = JSON.parse(sessionStorage.getItem("AuthDetails"))
        //checking if session Exists
        if (SessionObj && Object.keys(SessionObj).length > 0) {
            clearTimeout(actionTimer)
            actionTimer= setTimeout( ()=>initializeData(SessionObj),200)
        } else {
            //else redirect user to Login page.
            navigate('/Login')
        }

    }, [])

    const handleSelectCurrentChat=(item)=>{
        let {CurrentChatDetails,ChatMessages}=state
          CurrentChatDetails=item
        if (!ChatMessages.hasOwnProperty(item.UserName)){
            ChatMessages[item.UserName]=[]
        }
        setState({CurrentChatDetails,ChatMessages})
    }


    //handling chat input
    const handleOnchangeMessage=(e)=>{
    let {MessageObj}=state
        MessageObj.Message=e.target.value
        setState({MessageObj})
    }
    const handleLogOut=()=>{
        sessionStorage.removeItem("AuthDetails")
        socket.emit("Logout",{
            socketID: socketID,
        })
       navigate('/Login')
    }


    //send Message to selected chat user
    const handleSendMessage=()=>{
        let {MessageObj,CurrentChatDetails,ChatMessages,SessionObj}=state
        if (MessageObj.Message !==""){
            socket.emit("Send_Message",{
                UserName: state.SessionObj.UserName,
                socketID: state.CurrentChatDetails.socketID,
                Message: state.MessageObj.Message,
            })
                if (ChatMessages.hasOwnProperty(CurrentChatDetails.UserName)){
                    ChatMessages[CurrentChatDetails.UserName].push({Message:MessageObj.Message,socketID: socketID,Sender:SessionObj.UserName})
                }
            MessageObj.Message=""
            setState({MessageObj,ChatMessages})
        }
    }
    return (
        <div className="container mx-auto border-2 border-gray-100">

            <div>
                <div className="border-b-2 border-b-sky-800">
                    <p className="text-2xl font-bold text-fuchsia-800 text-center mb-3">
                        React Chat App
                    </p>
                </div>
            </div>
            <div className="pt-5 pb-2 pl-3 flex justify-between">
                <div>

                <p className="text-green-700 font-semibold text-lg">Loggen-In as: {state.SessionObj.UserName}</p>
                </div>
            <div>
                <div className="bg-sky-800 rounded-md  text-white pt-2 pb-2 pl-3 pr-3 mr-3" onClick={handleLogOut}>
                    <button>
                        Log Out
                    </button>
                </div>
            </div>
            </div>
            <div className="chatBoxContainer mt-">

                <div className="grid grid-cols-12">
                    <div className="col-span-6">
                        <div className="LeftSection">
                            <div className="border-b-2 p-3">
                                <p className="font-bold text-sky-700">Chats</p>
                            </div>
                            <div className="p-4">
                                {
                                    state.chatList.map((item, index) => {
                                       return<div className={`chatItem cursor-pointer hover:bg-gray-100 mb-5 ${ Object.keys(state.CurrentChatDetails).length>0?state.CurrentChatDetails.UserName===item.UserName?"bg-violet-50 border-4 border-violet-300":"":""}`} key={index} onClick={()=>handleSelectCurrentChat(item)}>
                                            <div>
                                                <p className="font-bold text-gray-700">{item.UserName}</p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>

                    </div>
                    <div className="col-span-6">
                        <div className="chatBoxContainerRight border-l-2 ">
                            <div className="p-6 border-b-2 pl-3">
                                <p className="font-bold text-sky-700">
                                    {
                                        Object.keys(state.CurrentChatDetails).length>0?state.CurrentChatDetails.UserName:"Select To Chat"
                                    }
                                </p>
                            </div>
                            <div className="chatContentBox">
                                {
                                    Object.keys(state.CurrentChatDetails).length>0?state.ChatMessages[state.CurrentChatDetails.UserName]?.length>0?
                                        state.ChatMessages[state.CurrentChatDetails.UserName].map((item,index)=>{
                                                        if (item.Sender !== state.SessionObj.UserName){
                                                            return<div key={index}>
                                                                <div className="MSG_Item Left">
                                                                    <p className="text-white">{item.Message}</p>
                                                                </div>
                                                            </div>
                                                        }else {
                                                            return  <div className="flex justify-end mr-5" key={index}>
                                                                <div className="MSG_Item Right">
                                                                    <p className="text-gray-700">{item.Message}</p>
                                                                </div>
                                                            </div>
                                                        }
                                        })
                                        :"":<div className="w-full flex items-center justify-center h-full bg-gray-100"><p className="text-gray-400 font-semibold text-base">Start Messaging...</p></div>
                                }


                            </div>
                            {
                                Object.keys(state.CurrentChatDetails).length>0? <div>
                                    <div className="w-full flex pl-4 pr-4 pb-4">
                                        <div className="w-full">
                                            <div>
                                                <input type="text" className="p-3 rounded-full w-full border-2" onChange={handleOnchangeMessage} value={state.MessageObj.Message}/>
                                            </div>

                                        </div>
                                        <div className="w-20">
                                            <div className="bg-sky-800 rounded-md  text-white pt-3 pb-3 pl-4 pr-4 ml-3" onClick={handleSendMessage}>
                                                <button>
                                                    Send
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                </div>:""
                            }



                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Chatbox;
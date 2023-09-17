import axios from "axios";
import io from "socket.io-client"

const HostURL="http://localhost:8070"

//socket initializing...
export const  socket=io.connect(HostURL)
export let socketID=""
socket.on("connect",()=>{
    socketID=socket.id
})

//Global function for Consuming APIS
export const ApiCall=async (Rout_URL,ReqObj)=>{
let responseData={}
    let BaseURL=`${HostURL}/Api/${Rout_URL}`
    await axios.post(BaseURL,ReqObj).then((response)=>{
        responseData=response.data
    })
    return responseData
}
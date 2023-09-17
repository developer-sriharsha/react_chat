const Router=require('express').Router()
const bcrypt=require('bcrypt')

const cryptojs=require('crypto-js')
const {GenerateToken} = require("../../Helpers/Helpers");

Router.post('/LoginUser',async (request,response)=>{
    let requestObject=request.body
    let RegisteredUsers=request.app.get('RegisteredUsers')

    //Decrypting User Password and comparing with existing data
    const AuhtKey="HaR$Sh34"
    const rawDataBytes=cryptojs.AES.decrypt(requestObject.Password,AuhtKey)
    const DecryptedData=JSON.parse(rawDataBytes.toString(cryptojs.enc.Utf8))

    let FilterUser=RegisteredUsers.filter((v)=>v.UserName===requestObject.UserName)
    if (FilterUser.length>0){
        const isValid=await bcrypt.compare(DecryptedData,FilterUser[0].Password)
        if (isValid){
            let token=GenerateToken(requestObject)
            response.send({status:"Success",token})
        }else{
            response.send({status:"Fail"})
        }
    }else{
        response.send({status:"Fail"})
    }
})

Router.post('/RegisterUser',async (req,res)=>{
    let requestObject=req.body

    //getting List of Users
    let RegisteredUsers=req.app.get('RegisteredUsers')

    //Encrypting Password
    const AuhtKey="HaR$Sh34"
    const rawDataBytes=cryptojs.AES.decrypt(requestObject.Password,AuhtKey)
    const DecryptedData=JSON.parse(rawDataBytes.toString(cryptojs.enc.Utf8))


    requestObject.Password=await bcrypt.hash(DecryptedData,10)
    RegisteredUsers.push(requestObject)

    req.app.set('RegisteredUsers',RegisteredUsers)
    res.send({status:"Success"})

})
module.exports=Router

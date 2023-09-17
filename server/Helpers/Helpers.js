const JWT=require('jsonwebtoken')
const AuthKey="AuthH$()695&"

//Token Verification hepler function
const TokenAuth=(token)=>{
    let Auth=false;
    if (token){
        JWT.verify(token,AuthKey,(error,Ress)=>{
            if (error) Auth=true
        })
    }
    return Auth
}

const GenerateToken=(InpObj)=>{
    //generating token and expiration time is 400 seconds
    return JWT.sign(InpObj,AuthKey,{algorithm:"HS256",expiresIn: 400})
}

module.exports={TokenAuth,GenerateToken}
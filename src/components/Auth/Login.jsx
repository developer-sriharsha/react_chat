import React, {useEffect, useReducer} from 'react';
import Registration from "./Registration.jsx";
import {ApiCall, socket} from "../helpers/helpers.jsx";
import * as cryptojs from "crypto-js";
import {useNavigate} from "react-router-dom";

const Login = () => {
    let navigate=useNavigate()
    const [state,setState]=useReducer((state,newState)=>({...state,...newState}),{

        RegisterFlag:false,
        isInvalidFlag:false,
        LoginFormObject:{
            UserName:"",
            Password:""
        },
        Errors:{},
        MandatoryFields:{
            UserName:"",
            Password:""
        }
    })
    //Taking inputs from User
    const handleOnchangeForm=(e,name)=>{
        let {LoginFormObject}=state
        LoginFormObject[name]=e.target.value
        setState({LoginFormObject})
    }
    //Register form toggle
    const handleRegister=()=>{
        setState({RegisterFlag:!state.RegisterFlag})
    }

    //validate Fields
    const validateForn=()=>{
        let {MandatoryFields,LoginFormObject}=state

        let validateFlag=true, Errors={}

        for (const key in MandatoryFields){
            if (LoginFormObject[key].trim()===""){
                validateFlag=false
                Errors[key]="This Field is required!"

            }else{
                Errors[key]=""
            }
        }
        setState({Errors})
        return validateFlag
    }


    //Submiting Form Details to API
    const handleLogin=async ()=>{
        if (!validateForn()){
            return null
        }
        let {LoginFormObject}=state
        const AuhtKey="HaR$Sh34"
        const encryptedData=cryptojs.AES.encrypt(JSON.stringify(LoginFormObject.Password.trim()),AuhtKey).toString()
        LoginFormObject.Password=encryptedData
        let resp= await ApiCall('LoginUser',LoginFormObject)
        if (resp.status==="Success"){
            if (resp.token){
                LoginFormObject.token=resp.token
                sessionStorage.setItem("AuthDetails",JSON.stringify(LoginFormObject))
                socket.emit("UserConnect",{
                    UserName:LoginFormObject.UserName,
                    token:LoginFormObject.token
                })
                navigate('/')
            }
        }else{
            setState({isInvalidFlag:true})
        }
    }

    return (
        <div>
            <div className="mx-auto w-full h-screen flex justify-center items-center ">
                <div className=" h-fit">
                    <div className="pb-4">
                        <p className="text-xl font-bold text-sky-700  text-center">
                            React Chat App
                        </p>
                    </div>
                    <div className=" ">
                        <div className='rounded-lg border-2 border-gray-100 shadow-lg mt-2 loginContainer'>
                            <div className="login w-full">
                                {state.RegisterFlag?<Registration handleRegister={handleRegister} />:    <div>
                                    <div className="p-5">
                                        <p className="text-gray-700 font-bold text-xl ">
                                            Login
                                        </p>
                                    </div>
                                    <div className="p-5">
                                        <div className="mb-5">
                                            <label htmlFor="" className="text-base block text-sky-700 font-bold ">User Name</label>
                                            <input type="text" onChange={(e)=>handleOnchangeForm(e,"UserName")} value={state.LoginFormObject.UserName} className="p-2 rounded-md border-2 border-gray-100 w-full "/>
                                            {
                                                state.Errors.UserName?<div className="mt-2"><p className="text-red-500">{state.Errors.UserName}</p></div>:""
                                            }
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="" className="text-base block text-sky-700 font-bold ">Password</label>
                                            <input type="text" onChange={(e)=>handleOnchangeForm(e,"Password")} value={state.LoginFormObject.Password} className="p-2 rounded-md border-2 border-gray-100 w-full "/>
                                            {
                                                state.Errors.Password?<div className="mt-2"><p className="text-red-500">{state.Errors.Password}</p></div>:""
                                            }
                                        </div>

                                        {
                                            state.isInvalidFlag?<div className="bg-red-50 border-2 border-red-100 p-2">
                                                <p className="text-red-600">Invalid Credentials</p>
                                            </div>:""
                                        }
                                        <div className="flex mt-6 justify-center">
                                            <div className="pl-6 pr-6 pt-2 pb-2 bg-sky-800 rounded-full text-white cursor-pointer" onClick={handleLogin}>
                                                <button>
                                                    Login
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                }
                                {state.RegisterFlag?

                                    <div className="mt-5 flex justify-end mb-5 pr-6" >
                                        <a className="text-sky-500 cursor-pointer" onClick={handleRegister}> Back</a>
                                    </div>:
                                    <div className="mt-5 flex justify-end mb-5 pr-6">
                                        <a className="text-sky-500 cursor-pointer" onClick={handleRegister}> Register Now</a>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
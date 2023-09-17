import React, {useReducer} from 'react';
import {ApiCall} from "../helpers/helpers.jsx";
import * as cryptojs from "crypto-js";

const Registration = (props) => {
    const [state,setState]=useReducer((state,newState)=>({...state,...newState}),{
        RegisterObj:{
            UserName:"",
            DOB:"",
            Mobile:"",
            Country:"",
            Password:""
        },
        Errors:{},
        MandatoryFields:{
            UserName:"",
            DOB:"",
            Mobile:"",
            Country:"",
            Password:""
        }

    })

    //Taking inputs from User
    const handleOnchangeForm=(e,name)=>{
        let {RegisterObj}=state
        RegisterObj[name]=e.target.value
        setState({RegisterObj})
    }

    const validateForn=()=>{
     let {MandatoryFields,RegisterObj}=state

     let validateFlag=true, Errors={}

        for (const key in MandatoryFields){
            if (RegisterObj[key].trim()===""){
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
    const handleRegister=async ()=>{
        if (!validateForn()){
            return null
        }
        let {RegisterObj}=state

        const AuhtKey="HaR$Sh34"
        const encryptedData=cryptojs.AES.encrypt(JSON.stringify(RegisterObj.Password.trim()),AuhtKey).toString()
        RegisterObj.Password=encryptedData
        let resp= await ApiCall('RegisterUser',RegisterObj)
        if (resp.status==="Success"){
            props.handleRegister()
            console.log("response=====>",resp)
        }
    }
    return (
        <div>
            <div>
                <div className="p-5">
                    <p className="text-gray-700 font-bold text-xl ">
                        Register
                    </p>
                </div>
                <div className="p-5">
                    <div className="mb-5">
                        <label htmlFor="" className="text-base block text-sky-700 font-bold ">User Name</label>
                        <input type="text" onChange={(e)=>handleOnchangeForm(e,"UserName")} value={state.RegisterObj.UserName} className="p-2 rounded-md border-2 border-gray-100 w-full "/>
                        {
                            state.Errors.UserName?<div className="mt-2"><p className="text-red-500">{state.Errors.UserName}</p></div>:""
                        }
                    </div>
                    <div className="mb-5">
                        <label htmlFor="" className="text-base block text-sky-700 font-bold ">Password</label>
                        <input type="text" onChange={(e)=>handleOnchangeForm(e,"Password")} value={state.RegisterObj.Password} className="p-2 rounded-md border-2 border-gray-100 w-full "/>
                        {
                            state.Errors.Password?<div className="mt-2"><p className="text-red-500">{state.Errors.Password}</p></div>:""
                        }
                    </div>
                    <div className="mb-5">
                        <label htmlFor="" className="text-base block text-sky-700 font-bold ">DOB</label>
                        <input type="date" onChange={(e)=>handleOnchangeForm(e,"DOB")} value={state.RegisterObj.DOB} className="p-2 rounded-md border-2 border-gray-100 w-full "/>
                        {
                            state.Errors.DOB?<div className="mt-2"><p className="text-red-500">{state.Errors.DOB}</p></div>:""
                        }
                    </div>
                    <div className="mb-5">
                        <label htmlFor="" className="text-base block text-sky-700 font-bold ">Mobile</label>
                        <input type="text" onChange={(e)=>handleOnchangeForm(e,"Mobile")} value={state.RegisterObj.Mobile} className="p-2 rounded-md border-2 border-gray-100 w-full"/>
                        {
                            state.Errors.Mobile?<div className="mt-2"><p className="text-red-500">{state.Errors.Mobile}</p></div>:""
                        }
                    </div>
                    <div className="mb-5">
                        <label htmlFor="" className="text-base block text-sky-700 font-bold ">Country</label>

                        <select name="" id="" onChange={(e)=>handleOnchangeForm(e,"Country")} value={state.RegisterObj.Country}  className="p-2 rounded-md border-2 border-gray-100 w-full ">
                            <option value="">Select</option>
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                        </select>
                        {
                            state.Errors.Country?<div  className="mt-2"><p className="text-red-500">{state.Errors.Country}</p></div>:""
                        }

                    </div>

                    <div className="flex mt-6 justify-center">
                        <div className="pl-6 pr-6 pt-2 pb-2 bg-sky-800 rounded-full text-white" onClick={handleRegister}>
                            <button>
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
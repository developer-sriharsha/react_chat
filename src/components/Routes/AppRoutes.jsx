import React from 'react';
import {Routes,Route} from "react-router-dom";
import Chatbox from "../Home/Chatbox.jsx";
import Login from "../Auth/Login.jsx";


const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Chatbox/>}/>
                <Route exact path="/Login" element={<Login/>}/>
            </Routes>
        </div>
    );
};

export default AppRoutes;
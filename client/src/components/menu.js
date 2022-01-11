import { useState } from "react";
import { Redirect } from "react-router-dom";
import { Logout } from "./logout";
export function Menu(props){
    const [redirect, setRedirect]=useState({})
    return(
        <div className="menu-bar">
            <button className='btn-menu' onClick={(e)=>{
                e.preventDefault();
                setRedirect({path: '/'});
            }}>home</button>
            <button className='btn-menu' onClick={(e)=>{
                e.preventDefault();
                setRedirect({path: '/register'});
            }}>register</button>
            <button className='btn-menu' onClick={(e)=>{
                e.preventDefault();
                setRedirect({path: '/login'});
            }}>login</button>
            <button className='btn-menu' onClick={(e)=>{
                e.preventDefault();
                setRedirect({path: '/message'});
            }}>message</button>
            <Logout/>
            {redirect.path? <Redirect to={redirect.path}/>:''}
        </div>
    )
}
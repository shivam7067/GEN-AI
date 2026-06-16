import {useAuth} from "../hooks/useAuth"
import { Navigate } from "react-router-dom";
import React, { Children } from "react"


const Protected=({children})=>{
    const {loading,user}=useAuth()
   
    if(loading){
        return(
          <Navigate to={"/"} />
        )
    }
    if(!user){
        return (<Navigate to={'/login'} />)
    }
    
    return children
}

export default Protected
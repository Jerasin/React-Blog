import React, { useEffect , useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {AuthContext} from '../../../AuthContext'

function Main() {
  let location = useLocation();

   const getCookie = () => { 
    let cookieArr = document.cookie.split("=")[1]; 
    if(!cookieArr) return
    console.log(cookieArr)
    localStorage.setItem("LOCAL_ID",cookieArr)
  }

  // useEffect(() => {
  //   getCookie();
  // }, []);

  const {authen , setAuthen , forceUpdate} = useContext(AuthContext)

  return (
    <div>
      <h1>Main</h1>
      {/* {console.log(authen)}
      {console.log("Rerneder Main Page")} */}
    </div>
  );
}

export default Main;

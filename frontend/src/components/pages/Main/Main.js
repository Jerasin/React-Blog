import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
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

  return (
    <div>
      <h1>Main</h1>
      {console.log("Rerneder Main Page")}
    </div>
  );
}

export default Main;

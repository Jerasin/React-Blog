import React, { useEffect , useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {AuthContext} from '../../../AuthContext'
import Post from '../Post/Post'
import './Main.css'
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

  let postID = [1,2,3,4,5,6,7,8]

  const postList = () =>{
    return postID.map((data) => (
      <Post key={data}/>
      ));
    }
  const {authen , setAuthen , forceUpdate} = useContext(AuthContext)

  return (
    <div className="container-fluid ">
      <h1>Main</h1>
     <div className="grid-container">
     <div className="grid-postlist">
     {postList()}
     </div>
     </div>
    </div>
  );
}

export default Main;

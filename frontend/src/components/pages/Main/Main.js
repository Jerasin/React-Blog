import React, { useEffect, useContext , useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { httpClient } from "../../../utils/HttpClient";
import { GET_POST_TEXTEDITOR_URL, server } from "./../../../Constatns";
import Post from "../Post/Post";
import "./Main.css";
function Main() {
  let location = useLocation();
  const [data, setData] = useState(null)

  const getCookie = () => {
    let cookieArr = document.cookie.split("=")[1];
    if (!cookieArr) return;
    console.log(cookieArr);
    localStorage.setItem("LOCAL_ID", cookieArr);
  };

  useEffect(async () => {
    let result = await httpClient.get(server.GET_POST_TEXTEDITOR_URL);
    setData(result)
  }, []);

  let postID = [1, 2, 3, 4, 5, 6, 7, 8];

  const postList = (result) => {
    if (data === null) return;
    // console.log(data.data.result);
    return data.data.result.map((data) => 
    {
      let text = JSON.parse(data.posts)
      console.log(typeof(data.posts))
      console.log(typeof(text))
      
      return (
        <div key={data.id} className="container-fluid" dangerouslySetInnerHTML={{ __html: text }} />
      )
    });
  };
  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);

  return (
    <div className="container-fluid ">
      <h1>Main</h1>
      <div className="grid-container">
        <div className="grid-postlist">{postList()}</div>
      </div>
    </div>
  );
}

export default Main;

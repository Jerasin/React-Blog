import React, { useEffect, useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { httpClient } from "../../../utils/HttpClient";
import jwt_decode from "jwt-decode";
import { GET_POST_TEXTEDITOR_URL, server } from "./../../../Constatns";
import Post from "../Post/Post";
import "./Main.css";
function Main() {
  let token;
  let location = useLocation();
  const [data, setData] = useState(null);

  // useEffect(async () => {
  //   try {
  //     let result = await httpClient.get(server.GET_POST_TEXTEDITOR_URL);
  //     setData(result);
  //   } catch (err) {
  //     localStorage.clear();
  //     forceUpdate();
  //   }
  // }, []);

  const checkLogin = () => {
    try {
      token = localStorage.getItem("localID");
      let decoded = jwt_decode(token);
      let short_id = decoded.short_id;
      return short_id;
    } catch (err) {
      localStorage.clear();
    }
  };

  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);

  const getCookie = () => {
    let cookieArr = document.cookie.split("=")[1];
    if (!cookieArr) return;
    console.log(cookieArr);
    localStorage.setItem("LOCAL_ID", cookieArr);
  };

  const postList = (result) => {
    if (data === null) return;
    // console.log(data.data.result);
    return data.data.result.map((data) => {
      let text = JSON.parse(data.posts);
      console.log(typeof data.posts);
      console.log(typeof text);

      return (
        <div
          key={data.id}
          className="container-fluid"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    });
  };

  return (
    <div>
      <div
        id="carouselExampleSlidesOnly"
        className="carousel slide container_main"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner ">
          <div className="carousel-item active ">
            <img
              className="header_main"
              style={{height:"100%" , maxHeight:"640px"}}
              src={`${process.env.PUBLIC_URL}/Images/header_main.jpg`}
              className="d-block w-100"
              alt="..."
            />
            <h4 className="header_main_text">Welcome To TechBlog</h4>
          </div>
          {/* <div className="carousel-item">
            <img src="..." className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="..." className="d-block w-100" alt="..." />
          </div> */}
        </div>
      </div>

      <div className="container-fluid ">
        <div className="grid-container">
          <div className="grid-postlist">{postList()}</div>
        </div>
      </div>
    </div>
  );
}

export default Main;

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
  let history = useHistory();
  const [data, setData] = useState(null);

  useEffect(async () => {
    try {
      let result = await httpClient.get(server.GET_POST_TEXTEDITOR_URL);
      // console.log(result.data.result);
      setData(result.data.result);
    } catch (err) {
      console.log(err);
      // localStorage.clear();
      // forceUpdate();
    }
  }, []);

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

  const postList = () => {
    if (!data) return;

    return data.map((data) => {
      return (
        <div key={data.id}>
          <div className="card" style={{ width: "18rem" }}>
            {/* <img src="..." className="card-img-top" alt="..." /> */}
            <div className="card-body">
              <h5 className="card-title">{data.title}</h5>
              <p className="card-text">Category: {data.laguange}</p>
              <p className="card-text">Post by: {data.email}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  history.push(`/edit-text-editor/${data.id}`);
                }}
              >
                Go somewhere
              </button>
            </div>
          </div>
        </div>
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
              // style={{ height: "100%", maxHeight: "640px" }}
              src={`${process.env.PUBLIC_URL}/Images/header_main.jpg`}
              className="d-block w-100 header_main"
              alt="..."
            />
            <h4 className="header_main_text">Welcome To TechBlog</h4>
          </div>
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

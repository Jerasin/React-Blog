import React, { useEffect, useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { httpClient } from "../../../utils/HttpClient";
import jwt_decode from "jwt-decode";
import { GET_POST_TEXTEDITOR_URL, server } from "./../../../Constatns";
// import Post from "../Post/Post";
import "./Main.css";

function Main(props) {
  let token;
  let location = useLocation();
  let history = useHistory();
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(async () => {
    try {
      let result = await httpClient.post(server.GET_POST_TEXTEDITOR_URL, {
        page,
        limit,
      });
      // console.log(result.data);
      if (props.getByKeyWord) {
        setData(props.getByKeyWord.result);
        setCurrentPage(props.getByKeyWord);
        // console.log("Props", props.getByKeyWord.result);
        return;
      }
      setData(result.data.result);
      setCurrentPage(result.data);
    } catch (err) {
      // console.log(err);
      localStorage.clear();
    }
  }, [page, props.getByKeyWord]);

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

  const pagination = () => {
    if (!currentPage) return;
    console.log(currentPage);

    return (
      <ul className="pagination">
        {currentPage.after !== 0 && (
          <li className="page-item">
            <button
              className="page-link"
              href="#"
              aria-label="Previous"
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <span aria-hidden="true">«</span>
            </button>
          </li>
        )}

        {currentPage.after !== 0 && (
          <li className="page-item">
            <button
              className="btn btn-light"
              onClick={() => {
                setPage(page - 1);
              }}
            >
              {currentPage.after}
            </button>
          </li>
        )}

        <li className="page-item">
          <button className="btn btn-primary" disabled={true}>
            {currentPage.now}
          </button>
        </li>

        {currentPage.next <= currentPage.countPage && (
          <li className="page-item">
            <button
              className="btn btn-light"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              {currentPage.next}
            </button>
          </li>
        )}

        {currentPage.next <= currentPage.countPage && (
          <li className="page-item">
            <button
              className="page-link"
              aria-label="Next"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <span aria-hidden="true">»</span>
            </button>
          </li>
        )}
      </ul>
    );
 
  };

  const postList = () => {
    if (!data) return;

    return data.map((data) => {
      return (
        <div className="col col-auto p-0 ms-3 mb-3" key={data.id}>
          <div className="card" style={{ width: "auto" , maxWidth: "18rem" }}>
            {/* <img src="..." className="card-img-top" alt="..." /> */}
            <div className="card-body">
              <h5 className="card-title">{data.title}</h5>
              <p className="card-text">Category: {data.language}</p>
              <p className="card-text">Post by: {data.email}</p>
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  history.push(`/post/${data.id}`);
                  forceUpdate();
                }}
              >
                Go To Blog
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col col-12 p-0">
          <div className="container-fluid p-0 position-relative">
            <img
              // style={{ height: "100%", maxHeight: "640px" }}
              src={`${process.env.PUBLIC_URL}/Images/header_main.jpg`}
              style={{ height: "100%", maxHeight: "400px", width: "100%" }}
              alt="..."
            />
            <div className="position-absolute top-50 start-50 translate-middle">
              <p className=" text-center m-2">
                <b className="fs-1">Welcome To TechBlog</b>
              </p>
            
            </div>
          </div>
        </div>

        <div className="col mt-3  p-0">
          <div className="container">
            <div className="row m-0">{postList()}</div>
          </div>
        </div>

        <div className="container mt-3">
          <nav aria-label="Page navigation example">{pagination()}</nav>
        </div>
      </div>
    </div>
  );
}

export default Main;

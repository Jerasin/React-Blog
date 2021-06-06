import React, { useState } from "react";
import "./Login.css";
import Popup from "./../../Popup/Popup";
import { useHistory, useLocation } from "react-router-dom";
import { httpClient } from "./../../../utils/HttpClient";
import { apiUrl, server, FB_LOGIN, GOOGLE_LOGIN } from "./../../../Constatns";

export default function Login() {
  // ไว้เปลื่ยน path
  let history = useHistory();
  // ไว้ดู path ปัจจุบัน
  let location = useLocation();

  const [authen, setAuthen] = useState({
    email: null,
    password: null,
  });
  const [disabled, setDisabled] = useState(false);
  const [isError, setisError] = useState(false);
  const [isDuplicate, setisDuplicate] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const { email, password, user_role } = authen;

  // Clear State
  const closePopup = () => {
    setOpenPopup(false);
    setisError(false);
    setisDuplicate(false);
    setDisabled(false);
  };

  const isLogin = () => {
    setDisabled(true);
    if (!email && !password) {
      setisError(true);
      setOpenPopup(true);
    }
  };

  // Popup Component
  const isPopup = () => {
    if (openPopup) {
      if (isError) {
        let error = "Error";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            content={error}
          />
        );
      }
      if (isDuplicate) {
        let error = "Duplicate";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            content={error}
          />
        );
      }
    }
  };
  // let { from } = location.state || { from: { pathname: "/" } };
  return (
    <div className="container-fluid">
      <div className="container">
        {/* Popup Show State */}
        {isPopup()}
        {console.log(location)}
        <div className="container-sm">
          <form>
            <div className="mb-3">
              <h3 className="text-header">
                <center>Login</center>
              </h3>
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email :
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                onChange={(e) => {
                  setAuthen({ ...authen, email: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password :
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={(e) => {
                  setAuthen({ ...authen, password: e.target.value });
                }}
              />
            </div>
            <div className="login_social">
              <center>
                <div>
                  <h5 className="text-social">Login Social</h5>
                </div>
                {/* fa-2x edit size */}
                <center className="icon-container">
                  <div className="icon-fb">
                    <a href={apiUrl + server.FB_LOGIN} >
                      <i className="fab fa-facebook fa-2x" />
                    </a>
                  </div>
                  <div className="icon-go">
                    <a href={apiUrl + server.GOOGLE_LOGIN}>
                      <i className="fab fa-google  fa-2x" />
                    </a>
                  </div>
                </center>
              </center>
            </div>
            <div>
              <div className="btn_register">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    isLogin();
                  }}
                >
                  Login
                </button>
              </div>

              <div className="btn_cancel">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

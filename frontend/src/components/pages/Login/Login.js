import React, { useState, useContext } from "react";
import "./Login.css";
import Popup from "./../../Popup/Popup";
import { useHistory, useLocation } from "react-router-dom";
import { httpClient } from "./../../../utils/HttpClient";
import FacebookLogin from "react-facebook-login";
import { AuthContext } from "../../../AuthContext";
import {
  apiUrl,
  server,
  REGISTER_URL,
  FB_LOGIN,
  GOOGLE_LOGIN,
  REGISTER_FB_URL,
} from "./../../../Constatns";

export default function Login(props) {
  // ไว้เปลื่ยน path
  let history = useHistory();
  // ไว้ดู path ปัจจุบัน
  let location = useLocation();

  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);
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

  const isLogin = async () => {
    setDisabled(true);
    if (!email && !password) {
      setisError(true);
      setOpenPopup(true);
      return;
    }
    let result = await httpClient.post(server.LOGIN_URL, authen);
    setAuthen({ email: null, password: null });
    if (result.data.status === 200) {
      localStorage.setItem("localID", result.data.result);
      forceUpdate();
      history.push("/main");
      return;
    }
  };

  const responseFacebook = async (response) => {
    try {
      console.log(response);
      signup(response, "Facebook");
      localStorage.setItem("nameID",response.name )
    } catch (err) {
      alert(err);
    }
  };

  const signup = async (res, type) => {
    const { email, id } = res;
    let postData;
    if (type === "Facebook" && email && id) {
      postData = {
        email: email,
        password: id,
        user_role: "user",
      };
      let result = await httpClient.post(server.REGISTER_FB_URL, postData);
      if (result.data.status === 200) {
        localStorage.setItem("localID", result.data.result);
        forceUpdate();
        history.push("/main");
      }
    }
  };

  const isLoginFb = async () => {
    try {
      console.log(authen);
      let result = await httpClient.post(server.REGISTER_FB_URL, authen);
      console.log(result.data);
    } catch (err) {
      localStorage.clear();
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
            icon={<i className="fas fa-times" style={{ color: "red" }} />}
            content={error}
          />
        );
      }
      if (isDuplicate) {
        let duplicate = "Duplicate";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            content={duplicate}
            icon={<i className="fas fa-times" style={{ color: "red" }} />}
          />
        );
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        {/* Popup Show State */}
        {isPopup()}
        <div className="container-sm form">
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
                    <a href={apiUrl + server.FB_LOGIN}>
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
              <div className="container-fb">
                <FacebookLogin
                  appId="870240086864574"
                  autoLoad={false}
                  textButton=""
                  fields="name,email,picture"
                  onClick={() => {
                    // isLoginFb();
                  }}
                  callback={responseFacebook}
                  cssClass="btn btn-primary"
                  icon="fa-facebook"
                />
              </div>

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

              <div className="btn_canceled">
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

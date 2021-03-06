import { React, useState, useContext } from "react";
import "./Register.css";
import { useHistory } from "react-router-dom";
import Popup from "./../../Popup/Popup";
import {
  SweetAlert2_Success,
  SweetAlert2_Warning,
  SweetAlert2_Error,
} from "../../SweetAlert2/SweetAlert2";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";
import { AuthContext } from "../../../AuthContext";
export default function Register() {
  // const [authen, setAuthen] = useState({
  //   email: null,
  //   password: null,
  //   user_role: "user",
  // });
  const [disabled, setDisabled] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [isDuplicate, setisDuplicate] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);
  let history = useHistory();

  const isRegister = async () => {
    // ? this i make Error popup.
    // setDisabled(true);
    if (!authen.email && !authen.password) {
      // ? this i make Error popup.
      // setOpenPopup(true);
      // setisError(true);

      // ? this i use SweetAlert2 Error popup.
      SweetAlert2_Error();
      return;
    }
    let regularEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    if (regularEmail.test(authen.email) === false) {
      // ? this i make Error popup.
      // setOpenPopup(true);
      // setisError(true);

      // ? this i use SweetAlert2 Error popup.
      SweetAlert2_Error();
      return;
    }

    let result = await httpClient.post(server.REGISTER_URL, authen);
    console.log(result)
    if (result.data.status === 404) {
      // ? this i make Warning popup.
      // setOpenPopup(true);
      // setisDuplicate(true);

      // ? this i use SweetAlert2 Warning popup.
      SweetAlert2_Warning();
      return;
    }
    if (result.data.status === 200) {
      // ? this i make Success popup.
      // setOpenPopup(true);
      // setisSuccess(true);

      // ? this i use SweetAlert2 Success popup.
      SweetAlert2_Success();
    }
    setTimeout(() => {
      history.push("/login");
    }, 1000);
  };

  const closePopup = () => {
    setOpenPopup(false);
    setisError(false);
    setisDuplicate(false);
    setDisabled(false);
  };

  const isPopup = () => {
    if (openPopup) {
      if (isError) {
        let error = "Error";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            icon={<i className="fas fa-times" style={{ color: "red" }} />}
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
            icon={<i className="fas fa-times" style={{ color: "red" }} />}
            content={error}
          />
        );
      }

      if (isSuccess) {
        let success = "Success";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            icon={
              <i
                className="fas fa-check-circle"
                style={{ color: "green", marginRight: "10px" }}
              />
            }
            content={success}
          />
        );
      }
    }
  };

  const { email, password, user_role } = authen;

  return (
    <div className="container-fluid">
      <div className="container">
        {isPopup()}
        <div className="container-sm">
          <form>
            <div className="mb-3">
              <h3 className="text-header">
                <center>Register</center>
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
            <div>
              <div className="btn_register">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    isRegister();
                  }}
                >
                  Register
                </button>
              </div>

              <div className="btn_canceled">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

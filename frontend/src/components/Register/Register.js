import { React, useState } from "react";
import "./Register.css";
import { useHistory } from "react-router-dom";

import { httpClient } from "./../../utils/HttpClient";
import { server } from "./../../Constatns";
export default function Register() {
  const [authen, setAuthen] = useState({
    email: "",
    password: "",
    user_role: "user",
  });
  const [disabled, setDisabled] = useState(false);
  const [isError, setisError] = useState(false);
  const [isDuplicate, setisDuplicate] = useState(false);

  let history = useHistory();

  const regularEmailError = () => {
    return (
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol
            id="check-circle-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </symbol>
          <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </symbol>
          <symbol
            id="exclamation-triangle-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </symbol>
        </svg>

        <svg
          className="bi flex-shrink-0 me-2"
          width={24}
          height={24}
          role="img"
          aria-label="Danger:"
        >
          <use xlinkHref="#exclamation-triangle-fill" />
        </svg>
        <div>Please Check Email</div>
      </div>
    );
  };

  const emailDuplicate = () => {
    return (
      <div
        className="alert alert-warning d-flex align-items-center"
        role="alert"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol
            id="check-circle-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </symbol>
          <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </symbol>
          <symbol
            id="exclamation-triangle-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </symbol>
        </svg>
        <svg
          className="bi flex-shrink-0 me-2"
          width={24}
          height={24}
          role="img"
          aria-label="Warning:"
        >
          <use xlinkHref="#exclamation-triangle-fill" />
        </svg>
        <div>Email is Duplicate</div>
      </div>
    );
  };

  const isRegister = async () => {
    setTimeout(() => {
      setDisabled(false);
      setisError(false);
      setisDuplicate(false);
    }, 1000);
    setDisabled(true);
    let regularEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    if (regularEmail.test(authen.email) === false) setisError(true);
    let result = await httpClient.post(server.REGISTER_URL, authen);
    if(result.data.status === 404) return setisDuplicate(true);
    console.log(result.data)
  };
  const { email, password, user_role } = authen;
  return (
    <div className="container">
      <div className="container-sm">
        <form>
          <div className="mb-3">
            <h3 className="text-header">Register</h3>
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
            {isError && regularEmailError()}
            {isDuplicate && emailDuplicate()}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                isRegister();
              }}
            >
              Register
            </button>
            <br />
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
        </form>
      </div>
    </div>
  );
}

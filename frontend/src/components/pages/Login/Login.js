import React from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";
export default function Login() {
  let history = useHistory();

  return (
    <div className="container-fluid">
      <div className="container-sm">
        
      <div className="register-form">
        <form>
          <div className="mb-3">
            <h3 className="text-header">Login</h3>
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email :
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              aria-describedby="emailHelp"
              // onChange={(e) => {
              //   setAuthen({ ...authen, email: e.target.value });
              // }}
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
              // onChange={(e) => {
              //   setAuthen({ ...authen, password: e.target.value });
              // }}
            />
          </div>
          <div>
          <div className="btn_register">
          <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {
                
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

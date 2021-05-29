import React from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";
export default function Login() {
  let history = useHistory();

  return (
    <div className="container">
      <div className="container-sm">
        <form>
          <div className="mb-3">
            <h3 className="text-header">Login</h3>
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email :
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password :
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <br />
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
        </form>
      </div>
    </div>
  );
}

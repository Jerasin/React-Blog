import React, { useState, useContext } from "react";
import { withRouter } from "react-router";
import { AuthContext } from "../../../AuthContext";
import jwt_decode from "jwt-decode";
import "./Header.css";

function Herader(props) {
  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const userLogin = () => {
    try {
      let token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded.email.split("@")[0];
    } catch (err) {
      localStorage.clear();
    }
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <h3 className="navbar-brand" style={{ color: "white" }}>
          <b
            style={{
              fontSize: "30px",
              font: "italic small-caps bold 26px/28px Georgia, serif",
            }}
          >
            TechBlog
          </b>
        </h3>
        <div className="d-flex">
          <button
            className="custom-toggler navbar-toggler btn_navbar"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded={!isNavCollapsed ? true : false}
            aria-label="Toggle navigation"
            onClick={handleNavCollapse}
          >
            <i className="fas fa-bars" />
          </button>
        </div>

        <div className="navbar-status">
          <div
            className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
            id="navbarNavAltMarkup1"
          >
            <div className="container_profile">
            <p className="nav-link  nav_p user_profile">
              <i className="far fa-user" style={{ paddingRight: "5px" }} />
              {userLogin()}
            </p>
            </div>

            <p className="nav-link  nav_p" onClick={() => {
                props.history.push("/text-editor");
              }}>Test Editor</p>
            <p
              className="nav-link  nav_p"
              onClick={() => {
                props.history.push("/create-post");
              }}
            >
              <i className="far fa-plus-square"style={{ paddingRight: "5px" }} />

              Create Post
            </p>
            <p className="nav-link  nav_p">
              <i className="fas fa-cog" style={{ paddingRight: "5px" }} />
              Setting
            </p>
            <p
              className="nav-link  nav_p"
              onClick={() => {
                localStorage.clear();
                forceUpdate();
                props.history.push("/login");
              }}
            >
              <i
                className="fas fa-sign-out-alt"
                style={{ paddingRight: "5px" }}
              />
              Logout
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default withRouter(Herader);

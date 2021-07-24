import React, { useState, useContext, useEffect, useRef } from "react";
import { withRouter, useParams } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import jwt_decode from "jwt-decode";
import "./Header.css";

function Herader(props) {
  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  // ? function Click Outside Close Navbar

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsNavCollapsed(true);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  //? State about function Click Outside Close Navbar
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const getEmail = () => {
    try {
      let token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded.email;
    } catch (err) {
      localStorage.clear();
    }
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <h3 className="navbar-brand" style={{ color: "black" }}>
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
            ref={wrapperRef}
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

        <div className="navbar-status" id="navbar-status" ref={wrapperRef}>
          <div
            className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
            id="navbarNavAltMarkup1"
          >
            <div className="container_profile">
              <p
                className="nav-link  nav_p user_profile"
                onClick={() => {
                  props.history.push(`/user-post/${getEmail()}`);
                }}
              >
                <i className="far fa-user" style={{ paddingRight: "5px" }} />
                {getEmail()}
              </p>
            </div>

            <p
              className="nav-link  nav_p"
              onClick={() => {
                props.history.push("/main");
                forceUpdate();
              }}
            >
              <i className="fas fa-home" style={{ paddingRight: "5px" }} />
              Main
            </p>

            <p
              className="nav-link  nav_p"
              onClick={() => {
                props.history.push("/text-editor");
                forceUpdate();
              }}
            >
              <i
                className="fas fa-plus-square"
                style={{ paddingRight: "5px" }}
              />
              Text Editor
            </p>
            <p
              className="nav-link  nav_p"
              onClick={() => {
                props.history.push("/create-post");
                forceUpdate();
              }}
            >
              <i
                className="far fa-plus-square"
                style={{ paddingRight: "5px" }}
              />
              Create Post
            </p>
            <p
              className="nav-link  nav_p"
              onClick={() => {
                props.history.push("/setting");
              }}
            >
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

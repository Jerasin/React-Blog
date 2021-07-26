import React, { useState, useContext, useEffect, useRef } from "react";
import { withRouter, useParams } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";
import jwt_decode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import "./Header.css";

function Herader(props) {
  const { authen, setAuthen, forceUpdate } = useContext(AuthContext);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const [serach, setSerach] = useState(null);
  const [resultSerach, setResultSerach] = useState(null);
  const [pageByKeyWord, setPageByKeyWord] = useState(1);
  const [limitByKeyWord, setLimitByKeyWord] = useState(20);
  const location = useLocation();
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

  const disabledBtnSerach = () => {
    if (location.pathname === "/main") {
      return false;
    } else {
      return true;
    }
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

  const checkAuthen = () => {
    try {
      let token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded.userRole;
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
        <div className="d-flex justify-content-between">
          <div className="input-group">
            <input
              className="form-control border-end-0 border rounded-pill bg-light"
              type="text"
              disabled={disabledBtnSerach()}
              onChange={(e) => {
                setSerach(e.target.value);
              }}
              placeholder="Search by Category"
              id="example-search-input"
            />
            <span className="input-group-append me-3 ">
              <button
                className="btn btn-outline-secondary bg-white border-start-0 border rounded-pill ms-n3 "
                type="button"
                disabled={disabledBtnSerach()}
                onClick={async () => {
                  try {
                    const result = await httpClient.post(
                      server.GET_POSTBYKEYWORD_TEXTEDITOR_URL,
                      { serach, pageByKeyWord, limitByKeyWord }
                    );

                    // console.log(result.data.result.length);
                    if (result.data.result.length === 0)
                      return alert("Not found");
                    // console.log(result.data);
                    props.getKeyWord(result.data);
                  } catch (err) {
                    localStorage.clear();
                    forceUpdate();
                  }
                }}
              >
                <i className="fa fa-search" />
              </button>
            </span>
          </div>

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
            <i className="fa fa-bars" />
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
                  forceUpdate();
                }}
              >
                <i className="fa fa-user" style={{ paddingRight: "5px" }} />
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
              <i className="fa fa-home" style={{ paddingRight: "5px" }} />
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
                className="fa fa-plus-square"
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
                className="fa fa-plus-square"
                style={{ paddingRight: "5px" }}
              />
              Create Post
            </p>
            {checkAuthen() === 1 && (
              <p
                className="nav-link  nav_p"
                onClick={() => {
                  forceUpdate();
                  props.history.push("/setting");
                }}
              >
                <i className="fa fa-cog" style={{ paddingRight: "5px" }} />
                Setting
              </p>
            )}

            {checkAuthen() === 1 && (
              <p
                className="nav-link  nav_p"
                onClick={() => {
                  forceUpdate();
                  props.history.push("/users");
                }}
              >
                <i className="fa fa-users" style={{ paddingRight: "5px" }} />
                Users
              </p>
            )}

            <p
              className="nav-link  nav_p"
              onClick={() => {
                localStorage.clear();
                forceUpdate();
                props.history.push("/login");
              }}
            >
              <i
                className="fa fa-sign-out fas fa-sign-out-alt"
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

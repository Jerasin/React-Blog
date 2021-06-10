import React from 'react'
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

function PrivateRoute({children , ...rest}) {


    const isLogin = () => {
        let token = localStorage.getItem("localID");
        if (!token) return false;
        let decoded = jwt_decode(token);
        return decoded
      };

    return (
        <Route
        {...rest}
        render={({ location }) =>
          isLogin() ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    )
}

export default PrivateRoute

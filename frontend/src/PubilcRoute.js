import React from "react";
import { AuthContext } from "./AuthContext";
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

function PubilcRoute({ children, ...rest }) {
  const isLogin = () => {
    let token = localStorage.getItem("localID");
    if (!token) return false;
    let decoded = jwt_decode(token);
    return decoded;
  };

  return (
    <AuthContext.Consumer>
      {() => (
        <Route
          {...rest}
          render={({ location }) =>
            isLogin() ? (
              <Redirect
                to={{
                  pathname: "/main",
                  state: { from: location },
                }}
              />
            ) : (
              children
            )
          }
        />
      )}
    </AuthContext.Consumer>
  );
}

export default PubilcRoute;

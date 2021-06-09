import React, { Children, useContext, useState, useCallback } from "react";
import "./App.css";
import jwt_decode from "jwt-decode";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Herader from "./components/fragments/Header/Herader";
import Footer from "./components/fragments/Footer/Footer";
import Main from "./components/pages/Main/Main";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

const AuthContext = React.createContext();

function App() {
  const redirectToLogin = () => {
    return <Redirect to="/login" />;
  };

  const [authen, setAuthen] = useState({
    isLogin: false,
    email: null,
    password: null,
    user_role: null,
  });
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const isLogin = () => {
    try {
      let token = localStorage.getItem("localID");
      let decoded = jwt_decode(token);

      return decoded.email;
      return false;
    } catch (err) {
      localStorage.clear();
    }
  };

  const PubilcRoute = ({ children, ...rest }) => {
    return (
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
    );
  };

  const PrivateRoute = ({ children, ...rest }) => {
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
    );
  };

  return (
    <AuthContext.Provider value={{ authen, setAuthen, forceUpdate }}>
      <Router>
        {console.log(isLogin())}
        {isLogin() && <Herader />}
        <Switch>
          <PubilcRoute path="/login">
            <Login />
          </PubilcRoute>
          <PrivateRoute path="/main">
            <Main />
          </PrivateRoute>
          <PubilcRoute path="/register">
            <Register />
          </PubilcRoute>
          <Route path="/" exact>
            {redirectToLogin()}
          </Route>
          <Route path="*">{redirectToLogin()}</Route>
          {isLogin() && <Footer />}
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default App;

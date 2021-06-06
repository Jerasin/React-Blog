import React, { Children, useContext } from "react";
import "./App.css";

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

  const pubilcRoute = ({ children, ...rest }) => {
    let auth = true;
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth ? (
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

  const PrivateRoute = ({ children, ...rest }) => {
    let auth = true;
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth ? (
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
    <AuthContext.Provider value={null}>
      {false && <Herader />}

      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/main">
            <Main />
          </PrivateRoute>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/" exact>
            {redirectToLogin()}
          </Route>
          <Route path="*">{redirectToLogin()}</Route>
        </Switch>
      </Router>
      {false && <Footer />}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default App;

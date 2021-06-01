import React, { useContext } from "react";
import "./App.css";

import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Herader from "./components/fragments/Header/Herader";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import Footer from "./components/fragments/Footer/Footer";

const AuthContext = React.createContext();

function App() {
  function redirectToLogin() {
    return <Redirect to="/login" />;
  }

  return (
    <AuthContext.Provider value={null}>
     {false &&<Herader />}
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
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

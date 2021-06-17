import React, { Children, useState, useCallback } from "react";
import "./App.css";
import jwt_decode from "jwt-decode";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Sidebar from './components/fragments/Sidebar/Sidebar'
import Herader from "./components/fragments/Header/Herader";
import Footer from "./components/fragments/Footer/Footer";
import Main from "./components/pages/Main/Main";
import CreatePost from './components/pages/CreatePost/CreatePost'
import AuthContextProvider from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import PubilcRoute from "./PubilcRoute";
import TextEditor from './components/TextEditor/TextEditor'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

function App() {
  const redirectToLogin = () => {
    return <Redirect to="/login" />;
  };

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const isLogin = () => {
    try {
      let token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded;
    } catch (err) {
      localStorage.clear();
    }
  };

  return (
    <AuthContextProvider forceUpdate={forceUpdate}>
      <Router>
        {isLogin() && <Herader />}
        {/* {isLogin() && <Sidebar/>} */}
        <Switch>
          <PubilcRoute path="/login">
            <Login />
          </PubilcRoute>
          
          <PubilcRoute path="/register">
            <Register />
          </PubilcRoute>

          <PrivateRoute path="/main">
            <Main />
          </PrivateRoute>

          <PrivateRoute path="/create-post">
            <CreatePost />
          </PrivateRoute>

          <PrivateRoute path="/text-editor">
            <TextEditor />
          </PrivateRoute>

          <Route path="/" exact>
            {redirectToLogin()}
          </Route>
          <Route path="*">{redirectToLogin()}</Route>
        </Switch>
        {isLogin() && <Footer />}
      </Router>
    </AuthContextProvider>
  );
}

export default App;

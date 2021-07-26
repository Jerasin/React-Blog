import React, { Children, useState, useCallback, useEffect } from "react";
import "./App.css";
import jwt_decode from "jwt-decode";
import Login from "./components/pages/Login/Login";
import Post from "./components/pages/Post/Post";
import Register from "./components/pages/Register/Register";
import Sidebar from "./components/fragments/Sidebar/Sidebar";
import Herader from "./components/fragments/Header/Herader";
import Footer from "./components/fragments/Footer/Footer";
import Main from "./components/pages/Main/Main";
import CreatePost from "./components/pages/CreatePost/CreatePost";
import EditTextEditor from "./components/TextEditor/EditTextEditor";
import AuthContextProvider from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import PubilcRoute from "./PubilcRoute";
import TextEditor from "./components/TextEditor/TextEditor";
import Setting from "./components/pages/Setting/Setting";
import UserPost from "./components/pages/ีUserPost/UserPost";
import EditCategory from './components/pages/Setting/EditCategory'
import Users from './components/pages/Users/Users'
import EditUser from './components/pages/Users/EditUser'
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

  let token;

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [resultSerach, setResultSerach] = useState(null)

  const serachByKey = (keyWord) => {
    // console.log("serachByKey" , keyWord);
    setResultSerach(keyWord)
  }

  const isLogin = () => {
    try {
      token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded;
    } catch (err) {
      localStorage.clear();
      forceUpdate();
    }
  };

  return (
    <AuthContextProvider forceUpdate={forceUpdate}>
      <div className="position-relative pb-5 min-vh-100">
        <Router>
          {isLogin() && <Herader getKeyWord={serachByKey} />}

          {/* {isLogin() && <Sidebar/>} */}
          <Switch>
            <PubilcRoute path="/login">
              <Login />
            </PubilcRoute>

            <PubilcRoute path="/register">
              <Register />
            </PubilcRoute>

            <PrivateRoute path="/main">
              <Main getByKeyWord={resultSerach} />
            </PrivateRoute>

            <PrivateRoute path="/post/:id">
              <Post />
            </PrivateRoute>

            <PrivateRoute path="/create-post">
              <CreatePost />
            </PrivateRoute>

            <PrivateRoute path="/text-editor">
              <TextEditor />
            </PrivateRoute>

            <PrivateRoute path="/user-post/:id">
              <UserPost />
            </PrivateRoute>

            <PrivateRoute path="/edit-text-editor/:id">
              <EditTextEditor />
            </PrivateRoute>

            <PrivateRoute path="/setting">
              <Setting />
            </PrivateRoute>

            <PrivateRoute path="/edit-category/:id">
              <EditCategory />
            </PrivateRoute>

            <PrivateRoute path="/users">
              <Users />
            </PrivateRoute>

            <PrivateRoute path="/edit-user/:id">
              <EditUser />
            </PrivateRoute>

            <Route path="/" exact>
              {redirectToLogin()}
            </Route>
            <Route path="*">{redirectToLogin()}</Route>
          </Switch>

          {isLogin() && <Footer />}
        </Router>
      </div>
    </AuthContextProvider>
  );
}

export default App;

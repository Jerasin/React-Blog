import  React , {useContext} from "react";
import "./App.css";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

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
  

  function redirectToLogin() {
    return <Redirect to="/login" />;
  }

  return (
    <AuthContext.Provider value={null}>
      <Router>
        <div>
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
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export {AuthContext};
export default App;



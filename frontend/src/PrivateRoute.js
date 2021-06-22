import React , {useContext} from 'react'
import { AuthContext } from "../src/AuthContext";
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
  const {  forceUpdate } = useContext(AuthContext);

    const isLogin = () => {
        try{
          let token = localStorage.getItem("localID");
        let decoded = jwt_decode(token);
        return decoded
        }
        catch(err){
          localStorage.clear();
        }
      };

    return (
        <Route
        {...rest}
        render={({ location }) =>
          isLogin() ? (
            children
          ) : 
          (
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

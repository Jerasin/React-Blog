import React , {useState ,useContext , useCallback} from 'react'

const AuthContext = React.createContext();

function AuthContextProvider(props) {

    const [authen, setAuthen] = useState({
        isLogin: false,
        email: null,
        password: null,
        user_role: null,
      });

    const  {forceUpdate} = props

    return (
        <AuthContext.Provider value={{ authen, setAuthen, forceUpdate }}>
            {props.children}
        </AuthContext.Provider>
    )
}
export {AuthContext};
export default AuthContextProvider

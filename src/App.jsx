import { useState } from 'react'
import './App.css'
import Router from './Router'
import Login from './Login';
//import useToken from './useToken';



function App() {

  function useToken() {

    const getToken = () => {
      const tokenString = sessionStorage.getItem('token');
      const userToken = JSON.parse(tokenString);
      return userToken?.token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
      sessionStorage.setItem('token', JSON.stringify(userToken));
      setToken(userToken.token);
    };

    return {
      setToken: saveToken,
      token
    }

  }


  const [products, setProducts] = useState()
  const [logMessage, setLogMessage] = useState(false)
  
  const { token, setToken } = useToken();
 

  if (!token) {

    return <Login setToken={setToken} />
  }


  return (
    <div>

      <Router
        products={products}
        setProducts={setProducts}
        token={token}
        setToken={setToken}
        logMessage={logMessage}
        setLogMessage={setLogMessage}
        
      />
    </div>
  )

}

export default App

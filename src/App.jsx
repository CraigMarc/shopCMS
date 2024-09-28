/*

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default */

import { useState, useEffect } from 'react'
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

  const [messages, setMessages] = useState([])
  const [comments, setComments] = useState()
  
  

const { token, setToken } = useToken();


  if (!token) {

    return <Login setToken={setToken} />
  }


  return (
    <div>

      <Router
        messages={messages}
        setMessages={setMessages}
        comments={comments}
        setComments={setComments}
        token={token}
        setToken={setToken}
        
        
      />
    </div>
  )

}

export default App

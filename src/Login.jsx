import { useState } from 'react'


const Login = (props) => {

  const {

    setToken,
  

  } = props;

  async function loginUser(credentials) {


    try {
      return fetch('https://shoppingapi.fly.dev/users/login ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(credentials)
      })
        .then(data => data.json())

    }
    catch (error) {

      console.log(err.message);

    }
  }


  //event listener
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState()

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password
    });
    let errMessage = token.message

    setToken(token);
   
    if (token.message == "wrong username or password") {
      setError(errMessage)
    }
    else { setError() }

  }




  return (
    <div className="login-wrapper">
      <h1>Store Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div className="loginSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
      <p>{error}</p>
    </div>
  )
}


export default Login;
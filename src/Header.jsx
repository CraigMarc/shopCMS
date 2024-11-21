//import { Link } from "react-router-dom"
import { Link,  useNavigate } from "react-router-dom";

function Header(props) {

  const {

    setLogMessage,

  } = props;


  const navigate = useNavigate();

  const handleLogout = (event) => {
    sessionStorage.removeItem("message");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    setLogMessage(false)
    navigate('/login')
  }

  return (
    <div>
      <header>

        <Link className="heading" to="/">
          <h1>My Store</h1>
        </Link>
        <div className="editButtonContainer" >
        <Link className="heading" to="/">
          <h3>Inventory</h3>
        </Link>
        <Link className="heading" to="/orders">
          <h3>Orders</h3>
        </Link>
          <Link to={'/login'} >
            <button className="logout" onClick={handleLogout} >logout</button>
          </Link>
        </div>
      </header>
    </div>
  )
}


export default Header
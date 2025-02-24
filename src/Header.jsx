//import { Link } from "react-router-dom"
import { Link, useNavigate } from "react-router-dom";

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
          <h2>My Store</h2>
        </Link>
        <div className="editButtonContainer" >
          <Link to={'/newproduct'}>
            <h3>Add New Product</h3>
          </Link>
          <Link className="heading" to="/">
            <h3>Inventory</h3>
          </Link>
          <Link className="heading" to="/orders">
            <h3>Orders</h3>
          </Link>
          <Link className="heading" to="/category">
            <h3>Categories</h3>
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
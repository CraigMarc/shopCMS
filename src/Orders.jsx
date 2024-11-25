import { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"

const Orders = (props) => {

  const navigate = useNavigate();

  const {

    setLogMessage,
    orders,
    setOrders,

  } = props;

  //load page get info to use token

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  //get posts


  const fetchInfo = async () => {
    //setLoading(true)

    try {

      const apiOrders = await fetch('http://localhost:3000/products/orders', {
        headers: { Authorization: tokenFetch }

      })


      const orderData = await apiOrders.json();

      setOrders(orderData)

    }

    catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      //add error message to dom
      setError("true")

      //send to login if token expires

      if (error.message.includes("Unauthorized")) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("message");
        setLogMessage(true)
        navigate('/login')
      }

    }
    setLoading(false)

  }


  useEffect(() => {
    fetchInfo();
  }, [])

  //display error and loading for api call

  if (error) return (
    <div>

      <p>A network error was encountered</p>
    </div>
  )

  if (loading) return <p>Loading...</p>;


  // delete order

  const handleDelete = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/deleteOrder/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setOrders(data)
        //maybe set state for a rerender
      })
      .catch((err) => {
        console.log(err.message);

        //send to login if token expires

        if (err.message.includes("Unauthorized")) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user_id");
          sessionStorage.removeItem("message");
          setLogMessage(true)
          navigate('/login')
        }

      });
  };

  // shipped not shipped

  const handleShip = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/shipped/${id}`, {
      method: 'PUT',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setOrders(data)
        //maybe set state for a rerender
      })
      .catch((err) => {
        console.log(err.message);

        //send to login if token expires

        if (err.message.includes("Unauthorized")) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user_id");
          sessionStorage.removeItem("message");
          setLogMessage(true)
          navigate('/login')
        }

      });
  };



  return (
    <div>
      <Header
        setLogMessage={setLogMessage}
      />
      <h2>Orders</h2>

      {orders.map((index, iter) => {

        let shipped = ""
        if (index.shipped == true) {
          shipped = 'Yes'
        }
        else {
          shipped = 'No'
        }

        return (

          <div key={iter} className="post">

            <div id={index._id} className="card" >
              <div className='titleContainer'>
              <h2 className='postTitle'>{index.title}</h2>
                <h3><span className='productSpan'>order number:</span> {index._id}</h3>
              </div>

              <div className='descriptionContainer'>
                <p><span className='productSpan'>name:</span> {index.firstName} {index.lastName}</p>
                <p><span className='productSpan'>email:</span> {index.email}</p>
                <p><span className='productSpan'>address1:</span> {index.address1}</p>
                <p><span className='productSpan'>address2:</span> {index.address2}</p>
                <p><span className='productSpan'>town:</span> {index.town}</p>
                <p><span className='productSpan'>state:</span> {index.state}</p>
                <p><span className='productSpan'>zip:</span> {index.zip}</p>
                <p><span className='productSpan'>shipping:</span> {index.shippingCost}</p>
                <p><span className='productSpan'>price:</span> {index.orderCost}</p>
              </div>
              <h3 className='productTitle'>Products:</h3>
              {index.productsArray.map((data, iter) => {
                  return (
                    <div className='productsContainer' key={iter}>
                      <p>{data.title}</p>
                      <p>${data.price}</p>
                      <p><span className='productSpan'>quantity:</span> {data.quantity}</p>
                    </div>
                  )
                })}
              <div className='commentContainer'>
                <p><span className='productSpan'>Shipped:</span> {shipped}</p>

              </div>
            </div>
            <div className='allButtonContainer'>
              <div className="deleteButtonContainer">
                <button className="delete" value={index._id} onClick={handleDelete} >delete order</button>

              </div>
              <div className="editButtonContainer" >
                <Link to={`order/${index._id}`} state={index._id}>
                  <button className="edit" value={index._id} >edit order</button>
                </Link>
              </div>
              <div className="publishButtonContainer"  >
                <button className="publish" value={index._id} onClick={handleShip} >shipped / not shipped</button>

              </div>
            </div>
          </div>

        )
      })}


    </div>
  );
};

export default Orders;
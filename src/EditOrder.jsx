import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header"

const EditOrder = (props) => {

  const {

    setLogMessage,
    orders,
    setOrders,

  } = props;

  const urlParams = useParams();
  const orderId = urlParams.id
  const orderData = orders.filter((product) => product._id == orderId)

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    console.log(data)

    //send form data
    await fetch(`http://localhost:3000/products/editOrder/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({

        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address1: data.address1,
        address2: data.address2,
        town: data.town,
        state: data.state,
        zip: data.zip,
        orderCost: data.orderCost,
        shippingCost: data.shippingCost,
        productArray: data.productArray,

      }),
      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })



      .then((response) => response.json())
      .then((data) => {
        //navigate('/')

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


  }

  console.log(orderData[0].productsArray)
  // render products

  const renderProducts = () => {
    return (
      <>
       {orderData[0].productsArray.map((data) => {
                  return (
                    <div key={data._id}>
                    <label>
                    <p>Title</p>
                    <input className="titleInput" defaultValue={data.title} type="text" name="`title[${expression}]`" />
                  </label>
                  <label>
                    <p>Quantity</p>
                    <input className="titleInput" defaultValue={data.quantity} type="text" name="quantity" />
                  </label>
                  <label>
                    <p>Price</p>
                    <input className="titleInput" defaultValue={data.price} type="text" name="price" />
                  </label>
                  </div>
                  )
                })}
      
      </>
    )

  }
    // render form

    const renderform = () => {

      return (
        <>

          <form onSubmit={handleSubmit}>
            <div className="editContainer">
            <label>
              <p>First Name</p>
              <input className="titleInput" defaultValue={orderData[0].firstName} type="text" name="firstName" />
            </label>
            <label>
              <p>Last Name</p>
              <input className="titleInput" defaultValue={orderData[0].lastName} type="text" name="lastName" />
            </label>
            <label>
              <p>Email</p>
              <input className="titleInput" defaultValue={orderData[0].email} type="text" name="email" />
            </label>
            <label>
              <p>Address 1</p>
              <input className="titleInput" defaultValue={orderData[0].address1} type="text" name="address1" />
            </label>
            <label>
              <p>Address 2</p>
              <input className="titleInput" defaultValue={orderData[0].address2} type="text" name="address2" />
            </label>
            <label>
              <p>Town</p>
              <input className="titleInput" defaultValue={orderData[0].town} type="text" name="town" />
            </label>
            <label>
              <p>State</p>
              <input className="titleInput" defaultValue={orderData[0].state} type="text" name="state" />
            </label>
            <label>
              <p>Zip Code</p>
              <input className="titleInput" defaultValue={orderData[0].zip} type="text" name="zip" />
            </label>
            <label>
              <p>Order Cost</p>
              <input className="titleInput" defaultValue={orderData[0].orderCost} type="number" name="orderCost" />
            </label>
            <label>
              <p>Shipping Cost</p>
              <input className="titleInput" defaultValue={orderData[0].shippingCost} type="number" name="shippingCost" />
            </label>
            {renderProducts()}
            </div>
            <div className="submitChanges">
              <button type="submit">Submit Changes</button>
            </div>
          </form>
         
        </>
      )
    }








    return (
      <div>
        <Header
          setLogMessage={setLogMessage}
        />
        <h2>Edit Order</h2>
        {renderform()}
       
      </div>
    );
  };

  export default EditOrder;
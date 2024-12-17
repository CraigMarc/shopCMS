import { useNavigate, Link } from "react-router-dom";
import Header from './Header'
import { useState, useRef } from 'react'

const NewProduct = (props) => {

  const {

    setLogMessage,

  } = props;

  const [sizeArray, setSizeArray] = useState([])
  const [colorArray, setcolorArray] = useState([])


  //submit new color array

  const submitProduct = async event => {

    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    let uuid = self.crypto.randomUUID();
    const idData = { ...data, sizeArray: sizeArray }
    const newData = [...colorArray, idData]

    setcolorArray(newData)
    setSizeArray([])

    clearAllInputs()

    /*
        await fetch("http://localhost:3000/products/product_array", {
          method: 'PUT',
          body: JSON.stringify({
            color_array: idData,
            current_id: current_data._id
    
          }),
          headers: {
            Authorization: tokenFetch,
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
    
    
    
          .then((response) => response.json())
          .then((data) => {
    
            setCurrent_data(data)
            setSizeArray([])
    
          })
    
    
          .catch((err) => {
            console.log(err.message);
    
            if (err.message.includes("Unauthorized")) {
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("userName");
              setLogMessage(true)
              navigate('/login')
            }
    
          });
    */




  }

  console.log(colorArray)


  function clearAllInputs() {
    let allInputs = document.querySelectorAll('.productInput');
    allInputs.forEach(singleInput => singleInput.value = '');

  }

  // submit size array
  const submitSize = async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    let uuid = self.crypto.randomUUID();
    const idData = { ...data, id_size: uuid }
    const newData = [...sizeArray, idData]
    setSizeArray(newData)
    let allInputs = document.querySelectorAll('.sizeInput');
    allInputs.forEach(singleInput => singleInput.value = '');

  }

  // display main form

  function displayMain() {
    return (
      <div>
        <form>
          <label>
            <p>Product Name</p>
            <input className="titleInput" type="text" name="title" required />
          </label>
          <label>
            <p>Category</p>
            <input className="titleInput" type="text" name="category" required />
          </label>
          <label>
            <p>Brand</p>
            <input className="titleInput" type="text" name="brand" />
          </label>
          <label>
            <label>
              <p>Model Number</p>
              <input className="titleInput" type="text" name="modelNum" />
            </label>
            <p>Description</p>
            <textarea className="descriptInput" type="text" name="description" required />
          </label>


        </form>
      </div>
    )
  }

  // display size array

  function displaySize() {

    return (
      <div>
        {sizeArray.map((index, iter) => {
          return (
            <div key={iter}>
              <p>size: {index.size}</p>
              <p>price: {index.price}</p>
              <p>quantity: {index.quantity}</p>
              <p>length: {index.length}</p>
              <p>width: {index.width}</p>
              <p>height: {index.height}</p>
              <p>weight: {index.weight}</p>

            </div>
          )
        })}

      </div>
    )

  }



  // color form

  function addProduct() {

    return (
      <div>
        {displaySize()}
        <form onSubmit={submitProduct}>
          <label>
            <p>Color</p>
            <input className="productInput" type="text" name="color" required />
          </label>
          <div className="newProductSubmit">

            <button type="submit product">Add Color</button>

          </div>
        </form>
        {addSize()}
      </div>
    )
  }


  // create size form

  function addSize() {

    return (
      <div>
        <form onSubmit={submitSize}>
          <label>
            <p>Size</p>
            <input className="sizeInput" type="text" name="size" />
          </label>
          <label>
            <p>Price</p>
            <input className="sizeInput" type="number" step="0.01" name="price" required />
          </label>
          <label>
            <p>Quantity</p>
            <input className="sizeInput" type="number" step="0.01" name="quantity" required />
          </label>
          <label>
            <p>Length</p>
            <input className="sizeInput" type="number" step="0.01" name="length" required />
          </label>
          <label>
            <p>Width</p>
            <input className="sizeInput" type="number" step="0.01" name="width" required />
          </label>
          <label>
            <p>Height</p>
            <input className="sizeInput" type="number" step="0.01" name="height" required />
          </label>
          <label>
            <p>Weight</p>
            <input className="sizeInput" type="number" name="weight" required />
          </label>
          <div className="newProductSubmit">
            <button type="submit product">Add Size</button>
          </div>
        </form>



      </div>
    )
  }


  return (
    <div className="login-wrapper">

      <Header
        setLogMessage={setLogMessage}
      />
      <h2 className="pageTitle">New Product</h2>

      {displayMain()}
      {addProduct()}

    </div>
  )


}




export default NewProduct;
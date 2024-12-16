import { useNavigate } from "react-router-dom";
import Header from './Header'
import { useState, useRef } from 'react'

const NewProduct = (props) => {

  const navigate = useNavigate();

  const {

    setLogMessage,

  } = props;

  //  think can get rid of picarray    ***************
  const [picArray, setPicArray] = useState([])
  const [current_data, setCurrent_data] = useState()
  const [sizeArray, setSizeArray] = useState([])
  const displayNew = useRef(true);
  const displayColor = useRef(false);
  


  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

 

  // submit new product

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    let uuid = self.crypto.randomUUID()


    //send form data
    await fetch("http://localhost:3000/products/new_product1", {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        category: data.category,
        description: data.description,
        modelNum: data.modelNum,
        brand: data.brand,
        product_id: uuid

      }),
      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })



      .then((response) => response.json())
      .then((data) => {

        setCurrent_data(data)
        displayNew.current = false
        displayColor.current = true

        //e.target.reset()

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
    //setDisplaySize(false)
  }


  //submit new color array

  const submitProduct = async event => {

    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    let uuid = self.crypto.randomUUID();
    const idData = { ...data, sizeArray: sizeArray, id_product: uuid }


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




    clearAllInputs()
  }


  function clearAllInputs() {
    let allInputs = document.querySelectorAll('.productInput');
    allInputs.forEach(singleInput => singleInput.value = '');

  }

  // add pic to color array

  const newImage = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log(e.target.id)

    const formData = new FormData();


    formData.append("image", data.image);
    formData.append("current_id", current_data._id)
    formData.append("array_number", e.target.id)


    await fetch(`http://localhost:3000/products/new_image/`, {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,
        //'Content-type': 'application/json; charset=UTF-8',

      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newData = [...picArray, data.image]
        setPicArray(newData);


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


  function handleDelete() {

  }



  // create size array

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



  // create color array

  function addProduct() {

    return (
      <div>
        <form onSubmit={submitProduct}>
          <label>
            <p>Color</p>
            <input className="productInput" type="text" name="color" required />
          </label>
          <div className="newProductSubmit">

            <button type="submit product">Submit</button>
          </div>
        </form>
        {addSize()}
      </div>
    )
  }

  // show new product

  function showNew() {
    return (
      <div>
        <p>{current_data.title}</p>
        <p>category: {current_data.category}</p>
        <p>brand: {current_data.brand}</p>
        <p>modelNum: {current_data.modelNum}</p>
        <p>description: {current_data.description}</p>
      </div>
    )
  }

   


  // show colors arrray
  
  function showProducts() {
    if (current_data) {
      if (current_data.colorArray) {
        return (
          <div>
            {current_data.colorArray.map((index, iter) => {

              return (

                <div key={index.id_product} className="productCard">
                  <p>{index.color}</p>

                  {index.sizeArray.map((index, iter) => {
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
                

                  <div className="addImageContainer">
                    <form encType="multipart/form-data" id={iter} onSubmit={newImage}>
                      <label>
                        <div className="form-group">
                          <label>Image (file must be .jpeg .jpg or .png):</label>
                          <input type="file" className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
                        </div>
                      </label>
                      <div className="addImage">
                        <button type="submit">Add New Picture</button>
                      </div>
                    </form>
                  </div>
                  <button className="delete" value={index._id} onClick={handleDelete} >delete product</button>
                </div>

              )
            })}
          </div>

        )
      }
    }
  }
 

  // display main form

  function displayForms() {
    if (displayNew.current == true) {
      return (
        <div>
          {displayMain()}
        </div>
      )
    }
    else {
      return (
        <div>
          {showNew()}
        </div>
      )
    }
  }

  // display colorform

  function displayColorForm() {
    if (displayNew.current == false && displayColor.current == true) {
      return (
        <div>
          {addProduct()}
        </div>
      )
    }

  }

  


  function displayMain() {
    return (
      <div>
        <form onSubmit={handleSubmit}>
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
            <p>Description</p>
            <textarea className="descriptInput" type="text" name="description" required />
          </label>
          <label>
            <p>Model Number</p>
            <input className="titleInput" type="text" name="modelNum" />
          </label>
          <div className="newProductSubmit">
            <button type="submit product">Submit</button>
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
      {displayForms()}
      {showProducts()}
      {displayColorForm()}

    </div>
  )
}




export default NewProduct;
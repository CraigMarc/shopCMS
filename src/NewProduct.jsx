import { useNavigate } from "react-router-dom";
import Header from './Header'
import { useState } from 'react'

const NewProduct = (props) => {

  const navigate = useNavigate();

  const {

    setLogMessage,

  } = props;

  const [newProduct, setNewProduct] = useState([])
  const [picArray, setPicArray] = useState([])
  const [current_id, setCurrent_id] = useState()

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  //submit new post
  /*
    const handleSubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
  
      const formData = new FormData();
  
      formData.append("title", data.title)
      formData.append("category", data.category)
      formData.append("brand", data.brand)
      formData.append("color", data.color)
      formData.append("description", data.description)
      formData.append("modelNum", data.modelNum)
      formData.append("price", Math.round(data.price * 100))
      formData.append("length", Math.round(data.length * 100))
      formData.append("height", Math.round(data.height * 100))
      formData.append("width", Math.round(data.width * 100))
      formData.append("weight", Math.round(data.weight * 100));
      formData.append("quantity", data.quantity)
      formData.append("image", data.image);
  
  
      await fetch("http://localhost:3000/products/new", {
  
        method: 'Post',
        body: formData,
  
        headers: {
          Authorization: tokenFetch,
          //'Content-type': 'application/json; charset=UTF-8',
  
        },
      })
        .then((response) => response.json())
        .then((data) => {
          navigate('/');
  
        })
        .catch((err) => {
          console.log(err.message);
  
          if (err.message.includes("Unauthorized")) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_id");
            sessionStorage.removeItem("message");
            setLogMessage(true)
            navigate('/login')
          }
  
        });
  
    }*/

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
        console.log(data)
        setCurrent_id(data._id)
        //e.target.reset()
       
      })


      .catch((err) => {
        console.log(err.message);

        if (err.message.includes("Unauthorized")) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userName");
          navigate('/login')
        }

      });


  }
console.log(current_id)

const submitProduct = async event => {
  
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    let uuid = self.crypto.randomUUID();
    const idData = { ...data, id_product: uuid }
    //const newData = [...newProduct, idData]
    
    //setNewProduct(newData);

      //send form data
    await fetch("http://localhost:3000/products/new_product1", {
      method: 'PUT',
      body: JSON.stringify({
      products_array: idData,
      current_id: current_id

      }),
      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })



      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        //setCurrent_id(data._id)
        //e.target.reset()
       
      })


      .catch((err) => {
        console.log(err.message);

        if (err.message.includes("Unauthorized")) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userName");
          navigate('/login')
        }

      });


    

    clearAllInputs()
  }


  function clearAllInputs() {
    let allInputs = document.querySelectorAll('.productInput');
    allInputs.forEach(singleInput => singleInput.value = '');

  }

  // add pic

  const newImage = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();


    formData.append("image", data.image);


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

  

  function showProducts() {
    return (
      <div>
        {newProduct.map((index) => {

          return (

            <div key={index.id_product} className="productCard">
              <p>{index.color}</p>
              <p>{index.size}</p>
              <p>{index.price}</p>
              <p>{index.quantity}</p>
              <p>{index.length}</p>
              <p>{index.width}</p>
              <p>{index.height}</p>
              <p>{index.weight}</p>

              {index.images.map((data, iter) => {
                let url = `http://localhost:3000/${data}`
                return (

                  <div key={iter} className="productCard">
                    <img className="imgEdit" src={url}></img>
                  </div>

                )
              })}
               <div className="addImageContainer">
          <form encType="multipart/form-data" onSubmit={newImage}>
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

  function addProduct() {

    return (
      <div>
        <form onSubmit={submitProduct}>
          <label>

            <p>Color</p>
            <input className="productInput" type="text" name="color" />
          </label>
          <label>
            <p>Size</p>
            <input className="productInput" type="text" name="size" />
          </label>
          <label>
            <p>Price</p>
            <input className="productInput" type="number" step="0.01" name="price" required />
          </label>
          <label>
            <p>Quantity</p>
            <input className="productInput" type="number" step="0.01" name="quantity" required />
          </label>
          <label>
            <p>Length</p>
            <input className="productInput" type="number" step="0.01" name="length" required />
          </label>
          <label>
            <p>Width</p>
            <input className="productInput" type="number" step="0.01" name="width" required />
          </label>
          <label>
            <p>Height</p>
            <input className="productInput" type="number" step="0.01" name="height" required />
          </label>
          <label>
            <p>Weight</p>
            <input className="productInput" type="number" name="weight" required />
          </label>
          <div className="newProductSubmit">
            <button type="submit product">Add New Product</button>
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
      {showProducts()}
      {addProduct()}
    </div>
  )
}




export default NewProduct;
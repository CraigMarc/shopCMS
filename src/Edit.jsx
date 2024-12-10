import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react'
import Header from './Header'


const Edit = (props) => {

  const {

    products,
    setProducts,
    setLogMessage,

  } = props;

  const urlParams = useParams();
  const productId = urlParams.id
  const productData = products.filter((product) => product._id == productId)

  let image = productData[0].image
  let url = ""
  if (image) {
    url = `http://localhost:3000/${image}`
  }

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  
  //submit function

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());


    //send form data
    await fetch(`http://localhost:3000/products/edit/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({

        title: data.title,
        category: data.category,
        brand: data.brand,
        color: data.color,
        description: data.description,
        modelNum: data.modelNum,
        price: Math.round(data.price * 100),
        length: Math.round(data.length * 100),
        width: Math.round(data.width * 100),
        height: Math.round(data.height * 100),
        weight: Math.round(data.weight * 100),
        quantity: data.quantity

      }),
      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })



      .then((response) => response.json())
      .then((data) => {
        navigate('/')

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

  // delete pic

  const deleteImage = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/image/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setProducts(data)

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

  // add pic

  const newImage = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();

    formData.append("image", data.image);


    await fetch(`http://localhost:3000/products/image/${productId}`, {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,
        //'Content-type': 'application/json; charset=UTF-8',

      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)

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

  // render form

  const renderform = () => {

    return (
      <>

        <form onSubmit={handleSubmit}>
          <label>
            <p>Product Name</p>
            <input className="titleInput" defaultValue={productData[0].title} type="text" name="title" />
          </label>
          <label>
            <p>Category</p>
            <input className="titleInput" defaultValue={productData[0].category} type="text" name="category" />
          </label>
          <label>
            <p>Brand</p>
            <input className="titleInput" defaultValue={productData[0].brand} type="text" name="brand" />
          </label>
          <label>
            <p>Color</p>
            <input className="titleInput" defaultValue={productData[0].color} type="text" name="color" />
          </label>
          <label>
            <p>Description</p>
            <textarea defaultValue={productData[0].description} type="text" name="description" />
          </label>
          <label>
            <p>Model Number</p>
            <input className="titleInput" defaultValue={productData[0].modelNum} type="text" name="modelNum" />
          </label>
          <label>
            <p>Price</p>
            <input className="titleInput" defaultValue={productData[0].price / 100} type="number" step="0.01" name="price" />
          </label>
          <label>
            <p>Quantity</p>
            <input className="titleInput" defaultValue={productData[0].quantity} type="number" name="quantity" />
          </label>
          <label>
            <p>Length</p>
            <input className="titleInput" defaultValue={productData[0].length / 100} type="number" step="0.01" name="length" />
          </label>
          <label>
            <p>Width</p>
            <input className="titleInput" defaultValue={productData[0].width / 100} type="number" step="0.01" name="width" />
          </label>
          <label>
            <p>Height</p>
            <input className="titleInput" defaultValue={productData[0].height / 100} type="number" step="0.01" name="height" />
          </label>
          <label>
            <p>Weight</p>
            <input className="titleInput" defaultValue={productData[0].weight / 100} type="number" step="0.01" name="weight" />
          </label>
          <div className="submitChanges">
            <button type="submit">Submit Changes</button>
          </div>
        </form>
      </>
    )
  }



  // render delete pic button

  if (productData[0].image) {
    return (

      <div className="login-wrapper">
        <Header
        setLogMessage={setLogMessage}
        />
        <h2 className="pageTitle">Edit Post</h2>
        {renderform()}
        <img className="imgEdit" src={url}></img>
        <div className="deleteImageContainer">
          <button className="delete" value={productData[0]._id} onClick={deleteImage}>Delete Image</button>

        </div>
      </div>

    )
  }

  // render add new pic button

  else {

    return (




      <div className="login-wrapper">
        <Header />
        <h2 className="pageTitle">Edit Post</h2>
        {renderform()}
        <img className="imgEdit" src={url}></img>
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

      </div>

    )
  }


}




export default Edit;
/*import { Link } from "react-router-dom";

const Edit = () => {
  return (
    <div className="error">
      <h1>Oh no, this route doesn't exist!</h1>
      <Link to="/">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
};

export default Edit;*/

import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import Header from './Header'


const Edit = (props) => {

  const {

    products,
    setProducts,
   


  } = props;

  const urlParams = useParams();
  const productId = urlParams.id
  const productData = products.filter((product) => product._id == productId)
 
  let image = productData[0].image
  let url = ""
  if (image) {
    url = `http://localhost:3000//uploads/${image}`
  }

  const navigate = useNavigate();
/*
  // delete comments

  const deleteComments = async (event) => {
    let id = event.target.value


    await fetch(`https://blogapi1200.fly.dev/users/comments/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setComments(data)
        //maybe set state for a rerender
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
*/


  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  //submit function

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());


    //send form data
    await fetch(`http://localhost:3000/products/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
       
        title: data.title,
        category: data.category,
        brand: data.brand,
        color: data.color,
        description: data.description,
        modelNum: data.modelNum,
        price: data.price,
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
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
      });
  };

  // add pic

  const newImage = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();
    
    formData.append("image", data.image);


    await fetch(`http://localhost:3000/products/image/${postId}`, {

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
      });

  }

  //jsx
  

  // render delete pic button

  if (productData[0].image) {
    return (
      <div className="login-wrapper">
        <Header />
        <h2 className="pageTitle">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Title</p>
            <input className="titleInput" defaultValue={productData[0].title} type="text" name="title" />
          </label>
          <label>
            <p>Text</p>
            <textarea defaultValue={productData[0].text} type="text" name="text" />
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
        <img className="imgEdit" src={url}></img>
        <div className="deleteImageContainer">
          <button className="delete" value={productData[0]._id} onClick={deleteImage}>delete image</button>

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
        <form onSubmit={handleSubmit}>
          <label>
            <p>Title</p>
            <input className="titleInput" defaultValue={productData[0].title} type="text" name="title" />
          </label>
          <label>
            <p>Text</p>
            <textarea defaultValue={productData[0].text} type="text" name="text" />
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
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
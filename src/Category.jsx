import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import Header from './Header'


const Category = (props) => {


  const {

    category,
    setCategory,
    setLogMessage,

  } = props;

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  const [message, setMessage] = useState(false)

  //submit new post

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("image", data.image);


    await fetch(`http://localhost:3000/products/new_category/`, {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,
        //'Content-type': 'application/json; charset=UTF-8',

      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategory(data)

      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  // delete category

  const handleDelete = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/delete_category/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.message == "category in use") {
            setMessage(true)
        }
        else {
        setCategory(data)
        setMessage(false)
        }
       
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

  function ListCategories() {

    if (category) {
      return (
        <div>
          <h2>Categories</h2>

          {category.map((index, iter) => {

            let url = `http://localhost:3000/${index.image}`


            return (

              <div key={iter} className="post">

                <div id={index._id} className="card" >

                  <div className='descriptionContainer'>
                    <p><span className='productSpan'>name:</span> {index.name}</p>
                    <img className="newProdImage" src={url}></img>
                  </div>


                </div>
                <div className='allButtonContainer'>
                  <div className="deleteButtonContainer">
                    <button className="delete" value={index._id} onClick={handleDelete} >delete category</button>

                  </div>
                </div>
              </div>

            )
          })}

        </div>
      )
    }
    else {
      return (
        <div>
          <h3>there are no categories</h3>
        </div>
      )
    }
  }

  function DisplayMessage() {
    if (message == true) {
      return (
        <div>
          <h3>This category is in use delete all products using the category to delete the category</h3>
        </div>
      )
    }
  }


  return (
    <div className="login-wrapper">

      <Header />
      <ListCategories />
      <DisplayMessage/>
      <h2 className="pageTitle">New Category</h2>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <label>
          <p>Name</p>
          <input className="nameInput" type="text" name="name" />
        </label>
        <div className="addImage">
          <label>Image (file must be .jpeg .jpg or .png):</label>
          <input type="file" className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
        </div>
        <div className="newPostSubmit">
          <button type="submit post">Add New Category</button>
        </div>
      </form>

    </div>
  )
}




export default Category;
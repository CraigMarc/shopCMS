import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react'
import Header from './Header'


const Brand = (props) => {


  const {

    brand,
    setBrand,
    setLogMessage,

  } = props;

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const iterForm = useRef();

  //submit new brand

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("image", data.image);


    await fetch(`http://localhost:3000/products/new_brand/`, {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,

      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBrand(data)

      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  // delete brand

  const handleDelete = async (e, iter) => {
    let id = e.target.value


    await fetch(`http://localhost:3000/products/delete_brand/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.message == "category in use") {
          setMessage(iter)
        }
        else {
          setBrand(data)
          setMessage(null)
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

  // add pic to existing brand

  const newImage = async (e, index) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();

    formData.append("image", data.image);



    await fetch(`http://localhost:3000/products/new_brand_image/${index._id}`, {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,
        //'Content-type': 'application/json; charset=UTF-8',

      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBrand(data)

      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  // delete pic

  const deleteImage = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/delete_brand_image/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setBrand(data)
        //maybe set state for a rerender
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // submit edit form

  const submitEditForm = async (e, _id) => {

    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
   

    await fetch(`http://localhost:3000/products/edit_brand/${_id}`, {
      method: 'PUT',
      body: JSON.stringify({

        name: data.name,


      }),
      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })



      .then((response) => response.json())
      .then((data) => {
        setShowForm(false)
        setBrand(data)
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



  // show form when button clicked

  function displayForm(e) {
    setShowForm(true)
    iterForm.current = e.target.value

  }

  // render edit form 

  function RenderEditForm(props) {

    const {

      index,
      iter

    } = props;


    if (showForm == true && iterForm.current == iter) {

      return (
        <div>
          <form onSubmit={(e) => submitEditForm(e, index._id)} >
            <label>
              <p>Name</p>
              <input defaultValue={index.name} type="text" name="name" />
            </label>

            <div className="editColorSubmit">
              <button type="submit">Submit Changes</button>
            </div>
          </form>
        </div>
      )
    }
  }

 
// show delete or edit image buttons

  function RenderPicButton(props) {

    const {

      index

    } = props;

    if (index.image) {
      return (
        <button className="delete" value={index._id} onClick={deleteImage} >delete image</button>
      )
    }
    else {
      return (
        <form encType="multipart/form-data" onSubmit={(e) => newImage(e, index)}>
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
      )
    }


  }



  function ListCategories() {

    if (brand) {
      return (
        <div className="brandPadding">
          <h2>Brands</h2>

          {brand.map((index, iter) => {

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
                    <button className="delete" value={index._id}  onClick={(e) => handleDelete(e, iter)} >delete brand</button>
                    <button className="delete" value={iter} onClick={displayForm} >edit brand</button>
                    <DisplayMessage
                    iter={iter}
                    />
                    <RenderEditForm
                      index={index}
                      iter={iter}
                    />
                    <RenderPicButton
                      index={index}
                    />
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
          <h3>there are no brands</h3>
        </div>
      )
    }
  }

  function DisplayMessage(props) {

    const {

      iter

    } = props;



    if (message == iter) {
      return (
        <div>
          <h3>This brand is in use delete all products using the brand to delete the brand</h3>
        </div>
      )
    }
  }


  return (
    <div>

      <Header />
     
      
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <label>
          <p>Name</p>
          <input className="nameInput" type="text" required name="name" />
        </label>
        <div className="addImage">
          <label>Image (file must be .jpeg .jpg or .png):</label>
          <input type="file" className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
        </div>
        <div className="newPostSubmit">
          <button type="submit post">Add New Brand</button>
        </div>
      </form>
      <ListCategories />
    </div>
  )
}




export default Brand;
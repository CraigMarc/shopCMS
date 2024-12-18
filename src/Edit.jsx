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
            <p>Model Number</p>
            <input className="titleInput" defaultValue={productData[0].modelNum} type="text" name="modelNum" />
          </label>
          <label>
            <p>Description</p>
            <textarea defaultValue={productData[0].description} type="text" name="description" />
          </label>
          <div className="submitChanges">
            <button type="submit">Submit Changes</button>
          </div>
        </form>
      </>
    )
  }

  // function display images 

  function displayImages(data) {

    if (data.images) {


      return (
        <div>
          {data.images.map((index, iter) => {
            let url = `http://localhost:3000/${index}`
            return (
              <div key={iter}>
                <img className="newProdImage" src={url}></img>
              <button>add image</button>
              <button>delete image</button>
              </div>
            )
          })
          }
        </div>
      )

    }
  }

  // display the colors and sizes

  const renderColorArray = () => {
    return (
      <div>
        
      <div className="post">

        <div className="card" >

        
          <div className='descriptionContainer'>
           
            {productData[0].colorArray.map((index2, iter) => {

              return (
                <div key={iter}>
                  <p><span className='productSpan'>color:</span> {index2.color}</p>

                  {index2.sizeArray.map((index3, iter) => {
                    return (
                      <div className='productQuantityContainer' key={iter}>
                        <p><span className='productSpan'>size:</span> {index3.size}</p>
                        <p><span className='productSpan'>price:</span> {index3.price}</p>
                        <p><span className='productSpan'>quantity:</span> {index3.quantity}</p>
                        <p><span className='productSpan'>length:</span> {index3.length}</p>
                        <p><span className='productSpan'>width:</span> {index3.width}</p>
                        <p><span className='productSpan'>height:</span> {index3.height}</p>
                        <p><span className='productSpan'>weight:</span> {index3.weight}</p>

                      </div>

                    )
                  })}

                  {displayImages(index2)}
                  <button>Delete</button>
                  <button>Edit</button>
                </div>
              )
            })}

          </div>

        </div>

      </div>

    </div >
)

  }




  return (

    <div className="login-wrapper">
      <Header
        setLogMessage={setLogMessage}
      />
      <h2 className="pageTitle">Edit Post</h2>
      {renderform()}
      {renderColorArray()}
    </div>


  )




}




export default Edit;
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from 'react'
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

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  const [display, setDisplay] = useState(false)
  /// maybe get rid of *********
  const [update, setUpdate] = useState(true)
  const [title, setTitle] = useState(productData[0].title)
  const [category, setCategory] = useState(productData[0].category)
  const [brand, setBrand] = useState(productData[0].brand)
  const [modelNum, setModelNum] = useState(productData[0].modelNum)
  const [description, setDescription] = useState(productData[0].description)
  const [current_data, setCurrent_data] = useState(productData[0])
  const iter = useRef();
  const disableEdit = useRef(false);

  //send updates to API
  const sendUpdates = async e => {

    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());


    //send form data 
    await fetch(`http://localhost:3000/products/edit/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({

        title: title,
        category: category,
        brand: brand,
        modelNum: modelNum,
        description: description,
        colorArray: current_data.colorArray

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




  // display and populate form

  function handleEdit(e, colorIter, sizeIter) {

    setDisplay(true)
    disableEdit.current = true
    iter.current = { colorIter: colorIter, sizeIter: sizeIter }

  }

  // handle color and size form submission

  const submitColorForm = (event) => {

    let colorIter = iter.current.colorIter
    let sizeIter = iter.current.sizeIter
    let array2 = structuredClone(current_data);

    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());

    //set new color
    array2.colorArray[colorIter].color = data.color

    // set new size array

    delete data.color

    array2.colorArray[colorIter].sizeArray[sizeIter] = data


    disableEdit.current = false
    setCurrent_data(array2)
    setDisplay(false)
  }

  // delete item from cart **** need to change

  const handleDelete = (colorIter, sizeIter) => {

    let array2 = structuredClone(current_data);

    array2.colorArray[colorIter].sizeArray.splice(sizeIter, 1)
    setCurrent_data(array2)

  }

  // delete image **** need to add apicall to delete image
console.log(current_data)
  const deleteImage = async (colorIter, picIter) => {

    let array2 = structuredClone(current_data);
    let picName = current_data.colorArray[colorIter].images[picIter]

    array2.colorArray[colorIter].images.splice(picIter, 1)
    
    await fetch(`http://localhost:3000/products/image/${picName}`, {
      method: 'Delete',
      body: JSON.stringify({

        title: title,
        category: category,
        brand: brand,
        modelNum: modelNum,
        description: description,
        colorArray: array2.colorArray,
        _id: current_data._id

      }),

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setCurrent_data(data)

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
      })



  }

  // render form

  const renderform = () => {

    return (
      <>

        <form>
          <label>
            <p>Product Name</p>
            <input onChange={(e) => setTitle(e.target.value)} className="titleInput" defaultValue={current_data.title} type="text" name="title" />
          </label>
          <label>
            <p>Category</p>
            <input onChange={(e) => setCategory(e.target.value)} className="titleInput" defaultValue={current_data.category} type="text" name="category" />
          </label>
          <label>
            <p>Brand</p>
            <input onChange={(e) => setBrand(e.target.value)} className="titleInput" defaultValue={current_data.brand} type="text" name="brand" />
          </label>
          <label>
            <p>Model Number</p>
            <input onChange={(e) => setModelNum(e.target.value)} className="titleInput" defaultValue={current_data.modelNum} type="text" name="modelNum" />
          </label>
          <label>
            <p>Description</p>
            <textarea onChange={(e) => setDescription(e.target.value)} defaultValue={current_data.description} type="text" name="description" />
          </label>

        </form>
      </>
    )
  }

  // function display images 

  function displayImages(data, colorIter) {

    if (data.images) {


      return (
        <div>
          {data.images.map((index, iter) => {
            let url = `http://localhost:3000/${index}`
            return (
              <div key={iter}>
                <img className="newProdImage" src={url}></img>
                <button>add image</button>
                <button onClick={() => deleteImage(colorIter, iter)}>delete image</button>
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

              {current_data.colorArray.map((index2, iter1) => {

                return (
                  <div key={iter1}>
                    <p><span className='productSpan'>color:</span> {index2.color}</p>

                    {index2.sizeArray.map((index3, iter2) => {
                      return (
                        <div className='productQuantityContainer' key={iter2}>
                          <p><span className='productSpan'>size:</span> {index3.size}</p>
                          <p><span className='productSpan'>price:</span> {index3.price}</p>
                          <p><span className='productSpan'>quantity:</span> {index3.quantity}</p>
                          <p><span className='productSpan'>length:</span> {index3.length}</p>
                          <p><span className='productSpan'>width:</span> {index3.width}</p>
                          <p><span className='productSpan'>height:</span> {index3.height}</p>
                          <p><span className='productSpan'>weight:</span> {index3.weight}</p>

                          <button onClick={() => handleDelete(iter1, iter2)}>Delete</button>
                          <button onClick={(e) => handleEdit(e, iter1, iter2)} disabled={disableEdit.current} type="submit" > Edit</button>

                          {showForm(iter1, iter2)}
                        </div>
                      )
                    })}

                    {displayImages(index2, iter1)}

                  </div>
                )
              })}

            </div>

          </div>

        </div>

      </div >
    )

  }

  function showForm(colorIter, sizeIter) {

    if (display == true && iter.current.colorIter == colorIter && iter.current.sizeIter == sizeIter) {
      return (
        <div>
          {displayForm()}
        </div>
      )
    }
  }


  const displayForm = () => {

    let colorIter = iter.current.colorIter
    let sizeIter = iter.current.sizeIter

    return (
      <div>
        <form onSubmit={submitColorForm} >
          <label>
            <p>Color</p>
            <input defaultValue={current_data.colorArray[colorIter].color} className="sizeInput" type="text" name="color" />
          </label>
          <label>
            <p>Size</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].size} className="sizeInput" type="text" name="size" />
          </label>
          <label>
            <p>Price</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].price} className="sizeInput" type="number" step="0.01" name="price" required />
          </label>
          <label>
            <p>Quantity</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].quantity} className="sizeInput" type="number" step="0.01" name="quantity" required />
          </label>
          <label>
            <p>Length</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].length} className="sizeInput" type="number" step="0.01" name="length" required />
          </label>
          <label>
            <p>Width</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].width} className="sizeInput" type="number" step="0.01" name="width" required />
          </label>
          <label>
            <p>Height</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].height} className="sizeInput" type="number" step="0.01" name="height" required />
          </label>
          <label>
            <p>Weight</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].weight} className="sizeInput" type="number" name="weight" required />
          </label>
          <div className="newProductSubmit">
            <button type="submit">Submit Changes</button>
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
      <h2 className="pageTitle">Edit Post</h2>
      {renderform()}
      {renderColorArray()}

    </div>


  )




}




export default Edit;
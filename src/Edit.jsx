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
  const iter = useRef();
  const disableEdit = useRef(false);

// display and populate form

  function handleEdit(e, colorIter, sizeIter) {

    setDisplay(true)
    disableEdit.current = true
    iter.current = {colorIter: colorIter, sizeIter: sizeIter}

  }

  // handle color and size form submission shut off edit button if form is open ??????????????? proper iter
  const submitColorForm = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    console.log(data)
    disableEdit.current = false
    setDisplay(false)
  }

  // render form

  const renderform = () => {

    return (
      <>

        <form>
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

              {productData[0].colorArray.map((index2, iter1) => {

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

                          <button>Delete</button>
                          <button onClick={(e) => handleEdit(e, iter1, iter2) } disabled={disableEdit.current} type = "submit" > Edit</button>
                          
                          {showForm(iter1, iter2)}
                        </div>
                )
              })}

              {displayImages(index2)}

            </div>
            )
              })}

          </div>

        </div>

      </div>

      </div >
    )

  }

function showForm (colorIter, sizeIter) {
  
  if (display == true && iter.current.colorIter == colorIter && iter.current.sizeIter == sizeIter) {
    return (
      <div>
      {displayForm()}
      </div>
    )
  }
}


const displayForm = () => {
  console.log(iter.current)
  let colorIter = iter.current.colorIter
  let sizeIter = iter.current.sizeIter

  return (
    <div>
      <form onSubmit={submitColorForm} >
        <label>
          <p>Color</p>
          <input defaultValue={productData[0].colorArray[colorIter].color} className="sizeInput" type="text" name="color" />
        </label>
        <label>
          <p>Size</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].size} className="sizeInput" type="text" name="size" />
        </label>
        <label>
          <p>Price</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].price} className="sizeInput" type="number" step="0.01" name="price" required />
        </label>
        <label>
          <p>Quantity</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].quantity} className="sizeInput" type="number" step="0.01" name="quantity" required />
        </label>
        <label>
          <p>Length</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].length} className="sizeInput" type="number" step="0.01" name="length" required />
        </label>
        <label>
          <p>Width</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].width} className="sizeInput" type="number" step="0.01" name="width" required />
        </label>
        <label>
          <p>Height</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].height} className="sizeInput" type="number" step="0.01" name="height" required />
        </label>
        <label>
          <p>Weight</p>
          <input defaultValue={productData[0].colorArray[colorIter].sizeArray[sizeIter].weight} className="sizeInput" type="number" name="weight" required />
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
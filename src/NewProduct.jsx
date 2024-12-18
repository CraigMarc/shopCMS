import { useNavigate, Link } from "react-router-dom";
import Header from './Header'
import { useState, useRef } from 'react'

const NewProduct = (props) => {

  const {

    setLogMessage,

  } = props;

  const navigate = useNavigate();

  const [sizeArray, setSizeArray] = useState([])
  const [colorArray, setcolorArray] = useState([])
  const [title, setTitle] = useState()
  const [category, setCategory] = useState()
  const [brand, setBrand] = useState()
  const [modelNum, setModelNum] = useState()
  const [description, setDescription] = useState()
  const [current_data, setCurrent_data] = useState()
  const display = useRef(false);

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`


  // submit new product

  const handleSubmit = async () => {

    let uuid = self.crypto.randomUUID()

    //send form data
    await fetch("http://localhost:3000/products/new_product1", {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        category: category,
        description: description,
        modelNum: modelNum,
        brand: brand,
        colorArray: colorArray,
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
        display.current = true

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

  }


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

  //display color 

  function displayColorArray() {
    return (
      <div>
        {colorArray.map((index2, iter) => {

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

            </div>
          )
        })}
      </div>
    )
  }

  // display main form

  function displayMain() {
    return (
      <div>
        <form>
          <label>
            <p>Product Name</p>
            <input onChange={(e) => setTitle(e.target.value)} className="titleInput" type="text" name="title" required />
          </label>
          <label>
            <p>Category</p>
            <input onChange={(e) => setCategory(e.target.value)} className="titleInput" type="text" name="category" required />
          </label>
          <label>
            <p>Brand</p>
            <input onChange={(e) => setBrand(e.target.value)} className="titleInput" type="text" name="brand" />
          </label>
          <label>
            <label>
              <p>Model Number</p>
              <input onChange={(e) => setModelNum(e.target.value)} className="titleInput" type="text" name="modelNum" />
            </label>
            <p>Description</p>
            <textarea onChange={(e) => setDescription(e.target.value)} className="descriptInput" type="text" name="description" required />
          </label>


        </form>
        {displayColorArray()}
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

  function switchDisplay() {
    if (display.current == true) {
      return (
        <div>
          {displaySubmitted()}
          <Link to="/">
            <button>Return Home If Done Adding Pictures</button>
          </Link>
        </div>
      )
    }
    else {
      return (
        <div>
          {displayMain()}
          {addProduct()}
          <div className="newProductSubmit">
            <button onClick={handleSubmit} type="submit product">Submit Product</button>
          </div>
        </div>
      )
    }
  }



  function displaySubmitted() {

    return (
      <div>


        <div className="post">

          <div className="card" >

            <div className='titleContainer'>
              <h2 className='postTitle'>{current_data.title}</h2>

            </div>
            <div className='descriptionContainer'>
              <p><span className='productSpan'>category:</span> {current_data.category}</p>
              <p><span className='productSpan'>brand:</span> {current_data.brand}</p>
              <p><span className='productSpan'>model number:</span> {current_data.modelNum}</p>
              <p><span className='productSpan'>description:</span> {current_data.description}</p>

              {current_data.colorArray.map((index2, iter) => {


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

                  </div>
                )
              })}


            </div>

          </div>

        </div>

      </div>
    )

  }


  return (
    <div className="login-wrapper">

      <Header
        setLogMessage={setLogMessage}
      />
      <h2 className="pageTitle">New Product</h2>

      {switchDisplay()}

    </div>
  )


}




export default NewProduct;
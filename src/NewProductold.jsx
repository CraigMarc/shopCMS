import { useNavigate, Link } from "react-router-dom";
import Header from './Header'
import { useState, useRef, useEffect } from 'react'
import Dropdown from './Dropdown'
import DropdownSub from './DropdownSub'


const NewProduct = (props) => {

  const {

    setLogMessage,
    category,
    setCategory,
    brand,
    setBrand

  } = props;


  const navigate = useNavigate();

  const [sizeArray, setSizeArray] = useState([])
  const [colorArray, setcolorArray] = useState([])
  const [title, setTitle] = useState()
  const [categoryForm, setCategoryForm] = useState(category[0].name)
  const [brandForm, setBrandForm] = useState(brand[0].name)
  const [modelNum, setModelNum] = useState()
  const [salePercent, setSalePercent] = useState()
  const [description, setDescription] = useState()
  const [current_data, setCurrent_data] = useState()
  const display = useRef(false);
  const [message, setMessage] = useState(false)
  const [message2, setMessage2] = useState(false)
  const category_id = useRef(category[0]._id);
  const brand_id = useRef(brand[0]._id);
  const [subCategory, setSubCategory] = useState()
  if (category[0].subCategory.length > 0) {
    setSubCategory(category[0].subCategory[0].name)
  }

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  // submit new product

  const handleSubmit = async () => {

    let uuid = self.crypto.randomUUID()

    if (!title || !category || !description || !modelNum || !brand || colorArray.length == 0) {
      setMessage(true)
    }
    else {
      //send form data
      await fetch("http://localhost:3000/products/new_product1", {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          category: category_id.current,
          subCategory: subCategory,
          description: description,
          modelNum: modelNum,
          sale_percent: salePercent,
          brand: brand_id.current,
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

  }


  //submit new color array

  const submitProduct = async event => {
    event.preventDefault();
    if (sizeArray.length == 0) {
      setMessage2(true)
    }
    else {

      const data = Object.fromEntries(new FormData(event.target).entries());
      let uuid = self.crypto.randomUUID();
      const idData = { ...data, sizeArray: sizeArray }
      const newData = [...colorArray, idData]

      setcolorArray(newData)
      setSizeArray([])

      clearAllInputs()
    }
  }


  function clearAllInputs() {
    let allInputs = document.querySelectorAll('.productInput');
    allInputs.forEach(singleInput => singleInput.value = '');

  }

  // submit size array
  const submitSize = async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());

    data.height = data.height * 100
    data.length = data.length * 100
    data.price = data.price * 100
    data.weight = data.weight * 100
    data.width = data.width * 100
    data.quantity = Number(data.quantity)

    let uuid = self.crypto.randomUUID();
    const idData = { ...data, id_size: uuid }
    const newData = [...sizeArray, idData]
    setSizeArray(newData)
    let allInputs = document.querySelectorAll('.sizeInput');
    allInputs.forEach(singleInput => singleInput.value = '');
    setMessage2(false)
  }

  // add pic to color array

  const newImage = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

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


      });

  }




  //display color 

  function displayColorArray() {

    if (colorArray.length > 0) {
      return (
        <div className="newProductColorContainer">

          {colorArray.map((index2, iter) => {

            return (
              <div key={iter}>
                <p><span className='productSpan'>color:</span> {index2.color}</p>

                {index2.sizeArray.map((index3, iter) => {
                  return (
                    <div className='productQuantityContainer' key={iter}>
                      <p><span className='productSpan'>size:</span> {index3.size}</p>
                      <p><span className='productSpan'>price:</span> {index3.price / 100}</p>
                      <p><span className='productSpan'>quantity:</span> {index3.quantity}</p>
                      <p><span className='productSpan'>length:</span> {index3.length / 100}</p>
                      <p><span className='productSpan'>width:</span> {index3.width / 100}</p>
                      <p><span className='productSpan'>height:</span> {index3.height / 100}</p>
                      <p><span className='productSpan'>weight:</span> {index3.weight / 100}</p>


                    </div>
                  )
                })}

              </div>
            )
          })}
        </div>
      )
    }
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
          <Dropdown
            dataName={category}
            setForm={setCategoryForm}
            data_id={category_id}
            dataForm={categoryForm}
            setSubCategory={setSubCategory}
            labelName="Category"
          />
          <DropdownSub
          category={category}
          categoryForm={categoryForm}
          subCategory={subCategory}
          setSubCategory={setSubCategory}
          />

          <Dropdown
            dataName={brand}
            setForm={setBrandForm}
            data_id={brand_id}
            dataForm={brandForm}
            labelName="Brand"
          />
          <label>
            <label>
              <p>Model Number</p>
              <input onChange={(e) => setModelNum(e.target.value)} className="titleInput" type="text" name="modelNum" />
            </label>
            <label>
              <p>Sale Percent (leave empty if not on sale)</p>
              <input onChange={(e) => setSalePercent(e.target.value)} className="titleInput" type="number" name="sale_percent" />
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

    if (sizeArray.length > 0) {

      return (
        <div>
          <h3>Sizes to be submitted hit add color to submit</h3>
          {sizeArray.map((index, iter) => {
            return (

              <div key={iter}>
                <p>size: {index.size}</p>
                <p>price: {index.price / 100}</p>
                <p>quantity: {index.quantity}</p>
                <p>length: {index.length / 100}</p>
                <p>width: {index.width / 100}</p>
                <p>height: {index.height / 100}</p>
                <p>weight: {index.weight / 100}</p>

              </div>
            )
          })}

        </div>
      )
    }
  }

  // display warning if size form is not complete

  function displaySizeMessage() {
    if (message2 == true) {
      return (
        <div>
          <h3>Must fill out and submit size form</h3>
        </div>
      )
    }

  }



  // color form

  function AddColor() {

    return (
      <div>
        {displaySize()}
        <form onSubmit={submitProduct}>
          <label>
            <p>Color</p>
            <input className="productInput" type="text" name="color" required />
          </label>
          <div className="addColorSubmit">
            {displaySizeMessage()}
            <button type="submit">Add Color</button>

          </div>
        </form>
        <AddSize/>
      </div>
    )
  }


  // create size form

  function AddSize() {

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
            <input className="sizeInput" type="number" name="quantity" required />
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

  function displayMessage() {
    if (message == true) {
      return (
        <div>
          <h3>All fields must be filled out</h3>
        </div>
      )
    }
  }


  // display submitted product screen after form submission

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
          <div className="newProductMenuContainer">
            <AddColor/>
          </div>
          <div className="newProductSubmit">
            {displayMessage()}
            <button onClick={handleSubmit} type="submit product">Submit Product</button>
          </div>
        </div>
      )
    }
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

              </div>
            )
          })
          }
        </div>
      )

    }
  }

  
  // display submitted product 

  function displaySubmitted() {

    return (
      <div>

        <div className="newProductContainer">

          <div className="card" >

            <div className='titleContainer'>
              <h2 className='postTitle'>{current_data.title}</h2>

            </div>
            <div className='descriptionContainer'>
              <p><span className='productSpan'>category:</span> {current_data.category}</p>
              <p><span className='productSpan'>brand:</span> {current_data.brand}</p>
              <p><span className='productSpan'>sale_percent:</span> {current_data.sale_percent}</p>
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
                          <p><span className='productSpan'>price:</span> {index3.price / 100}</p>
                          <p><span className='productSpan'>quantity:</span> {index3.quantity}</p>
                          <p><span className='productSpan'>length:</span> {index3.length / 100}</p>
                          <p><span className='productSpan'>width:</span> {index3.width / 100}</p>
                          <p><span className='productSpan'>height:</span> {index3.height / 100}</p>
                          <p><span className='productSpan'>weight:</span> {index3.weight / 100}</p>

                        </div>

                      )
                    })}

                    {displayImages(index2)}

                    <div className="addImageContainer">
                      <form encType="multipart/form-data" id={iter} onSubmit={newImage}>
                        <label>
                          <div className="form-group">
                            <label>Image (file must be .jpeg .jpg or .png):</label>
                            <input type="file" required className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
                          </div>
                        </label>
                        <div className="addImageCont">
                          <button type="submit">Add New Picture</button>
                        </div>
                      </form>
                    </div>

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
      <h2 className="pageTitle">New Product</h2>

      {switchDisplay()}

    </div>
  )


}




export default NewProduct;
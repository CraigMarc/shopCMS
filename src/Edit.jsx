import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from 'react'
import Header from './Header'
import Dropdown from './Dropdown'
import DropdownSub from './DropdownSub'
import editIcon from './assets/editIcon30.png'
import trashIcon from './assets/trashIcon.png'
import imageIcon from './assets/imageIcon.png'



const Edit = (props) => {

  const {

    products,
    setProducts,
    setLogMessage,
    category,
    setCategory,
   
   

  } = props;

  const urlParams = useParams();
  const productId = urlParams.id
  const productData = products.filter((product) => product._id == productId)

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`
  const [display, setDisplay] = useState(false)
  const [title, setTitle] = useState(productData[0].title)
  const [categoryForm, setCategoryForm] = useState(productData[0].category.name)
  const [modelNum, setModelNum] = useState(productData[0].modelNum)
  const [description, setDescription] = useState(productData[0].description)
  const [salePercent, setSalePercent] = useState(productData[0].sale_percent)
  const [current_data, setCurrent_data] = useState(productData[0])
  const [showPicForm, setShowPicForm] = useState(false)
  const [showColorForm, setShowColorForm] = useState(false)
  const [showSizeForm, setShowSizeForm] = useState(false)
  const [message, setMessage] = useState(false)
  const iter = useRef();
  const disableEdit = useRef(false);
  const disablePic = useRef(false);
  const iterImage = useRef();
  const iterSize = useRef();
  const category_id = useRef(productData[0].category._id);
  const [subCategory, setSubCategory] = useState(productData[0].subCategory)
  const [brandForm2, setBrandForm2] = useState(productData[0].brand)


  //send updates to API
  const sendUpdates = async () => {

    if (!title || !category || !description || !modelNum || !brandForm2 || current_data.colorArray.length == 0) {
      setMessage(true)
    }
    //send form data 
    else {
      await fetch(`https://shoppingapi.fly.dev/products/edit/`, {
        method: 'PUT',
        body: JSON.stringify({

          title: title,
          category: category_id.current,
          subCategory: subCategory,
          brand: brandForm2,
          modelNum: modelNum,
          description: description,
          sale_percent: salePercent,
          colorArray: current_data.colorArray,
          product_id: current_data.product_id,
          _id: current_data._id

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

  }

  // submit new image

  const newImage = async (e, colorIter) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    // update any product changes

    await fetch(`https://shoppingapi.fly.dev/products/update_product/`, {
      method: 'Post',
      body: JSON.stringify({

        title: title,
        category: category_id.current,
        subCategory: subCategory,
        brand: brandForm2,
        modelNum: modelNum,
        description: description,
        sale_percent: salePercent,
        colorArray: current_data.colorArray,
        product_id: current_data.product_id,
        _id: current_data._id,


      }),

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        disablePic.current = false
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




    //send pic in multipart form
    const formData = new FormData();

    formData.append("current_id", current_data._id);
    formData.append("image", data.image);
    formData.append("array_number", colorIter);

    await fetch(`https://shoppingapi.fly.dev/products/new_image/`, {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,
        //'Content-type': 'application/json; charset=UTF-8',

      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowPicForm(false)
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

    data.height = data.height * 100
    data.length = data.length * 100
    data.price = data.price * 100
    data.weight = data.weight * 100
    data.width = data.width * 100
    data.quantity = Number(data.quantity)

    //set new color
    array2.colorArray[colorIter].color = data.color

    // set new size array

    delete data.color

    array2.colorArray[colorIter].sizeArray[sizeIter] = data


    disableEdit.current = false
    setCurrent_data(array2)
    setDisplay(false)
  }

  // delete size and color array if sizes all deleted

  const handleDelete = async (colorIter, sizeIter) => {

    let array2 = structuredClone(current_data);

    array2.colorArray[colorIter].sizeArray.splice(sizeIter, 1)
    setCurrent_data(array2)

    // if size array empty delete pics and color array
    if (current_data.colorArray[colorIter].sizeArray.length == 1) {

      //api call to delete pics and color array at color iter

      await fetch(`https://shoppingapi.fly.dev/products/delete_color/`, {
        method: 'Delete',
        body: JSON.stringify({

          colorArray: current_data.colorArray,
          _id: current_data._id,
          color_iter: colorIter

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


  }

  // delete image

  const deleteImage = async (colorIter, picIter) => {

    let array2 = structuredClone(current_data);
    let picName = current_data.colorArray[colorIter].images[picIter]

    array2.colorArray[colorIter].images.splice(picIter, 1)

    await fetch(`https://shoppingapi.fly.dev/products/image/`, {
      method: 'Delete',
      body: JSON.stringify({

        colorArray: array2.colorArray,
        _id: current_data._id,
        picName: picName

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

  function DisplayMessage() {
    if (message == true) {
      return (
        <div>
          <h3>All fields must be filled out</h3>
        </div>
      )
    }
  }

  // submit new size form
  const submitNewSizeForm = (e) => {

    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    data.height = data.height * 100
    data.length = data.length * 100
    data.price = data.price * 100
    data.weight = data.weight * 100
    data.width = data.width * 100
    data.quantity = Number(data.quantity)

    let newColorArr = structuredClone(current_data.colorArray)
    newColorArr[iterSize.current].sizeArray.push(data)
    let newArr = { ...current_data, colorArray: newColorArr }

    setCurrent_data(newArr)
    setShowSizeForm(false)

  }
  // display new size form

  const displayNewSizeForm = (iterColor) => {

    iterSize.current = iterColor

    setShowSizeForm(true)

  }

  // add new size form
  const NewSizeForm = (props) => {

    const {

      iter1

    } = props;


    if (showSizeForm == true && iterSize.current == iter1) {
      return (
        <div>
          <form onSubmit={submitNewSizeForm} >
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
              <input className="sizeInput" type="number" step="0.01" name="weight" required />
            </label>
            <div className="editColorSubmit">
              <button type="submit">Submit Size</button>
            </div>
          </form>


        </div>
      )
    }
  }

  // submit color form
  const submitNewColorForm = (e) => {

    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    let newColorArr = structuredClone(current_data.colorArray)
    newColorArr.push({ color: data.color, sizeArray: [], images: [] })
    let newArr = { ...current_data, colorArray: newColorArr }

    setCurrent_data(newArr)
    setShowColorForm(false)

  }


  // display color form
  const displayNewColorForm = () => {

    setShowColorForm(true)

  }
  // add new color form

  const NewColorForm = () => {
    if (showColorForm == true) {
      return (
        <div>
          <form onSubmit={submitNewColorForm} >
            <label>
              <p>Color (enter false if only one color)</p>
              <input className="sizeInput" type="text" name="color" />
            </label>
            <div className="editColorSubmit">
              <button type="submit">Submit Changes</button>
            </div>
          </form>

        </div>
      )
    }
    else {
      return (
        <div>
          <button onClick={displayNewColorForm}>Add New Color</button>
        </div>
      )
    }

  }

  // render new pic form 
  const newPicForm = (colorIter) => {
    return (
      <div className="addImageContainer">
        <form encType="multipart/form-data" id={iter} onSubmit={(e) => newImage(e, colorIter)}>
          <label>
            <div className="form-group">
              <label>Image (file must be .jpeg .jpg or .png):</label>
              <input type="file" required className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
            </div>
          </label>
          <div className="addImage">
            <button className="imageIcon" src={imageIcon} type="submit">submit image</button>
          </div>
        </form>
      </div>
    )
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
          <Dropdown
            dataName={category}
            setForm={setCategoryForm}
            setSubCategory={setSubCategory}
            data_id={category_id}
            dataForm={categoryForm}
            labelName="Category"
          />
          <DropdownSub
            category={category}
            categoryForm={categoryForm}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
          />
          <label>
            <p>Brand</p>
            <input onChange={(e) => setBrandForm2(e.target.value)} className="titleInput" defaultValue={current_data.brand} type="text" name="brand" />
          </label>
         
          <label>
            <p>Model Number</p>
            <input onChange={(e) => setModelNum(e.target.value)} className="titleInput" defaultValue={current_data.modelNum} type="text" name="modelNum" />
          </label>
          <label>
            <p>Sale Percent</p>
            <input onChange={(e) => setSalePercent(e.target.value)} className="titleInput" defaultValue={current_data.sale_percent} type="number" name="salePercent" />
          </label>
          <label>
            <p>Description</p>
            <textarea onChange={(e) => setDescription(e.target.value)} defaultValue={current_data.description} type="text" name="description" />
          </label>

        </form>
        <div className="addNewColorContainer">
          <NewColorForm />

        </div>
      </>
    )
  }

  // set state to display add image
  function showImage(colorIter) {

    iterImage.current = colorIter
    disablePic.current = true
    setShowPicForm(true)

  }

  // function display images 

  function displayImages(data, colorIter) {

    if (data.images) {


      return (
        <div>
          {data.images.map((index, iter) => {
            let url = `https://shoppingapi.fly.dev/${index}`
            return (
              <div className="editImageContainer" key={iter}>
                <img className="newProdImage" src={url}></img>
                <img className="editIcon" src={trashIcon} onClick={() => deleteImage(colorIter, iter)}></img>
              </div>
            )
          })
          }
        </div>
      )

    }
  }

  const renderPicForm = (index2, colorIter) => {
    if (showPicForm == true && colorIter == iterImage.current) {
      return (
        <div>
          {newPicForm(colorIter)}
        </div>
      )
    }
    else {
      return (
        <div>
          {displayImages(index2, colorIter)}
        </div>
      )
    }
  }

  function RenderSizeButton(props) {

    const {

      iter1

    } = props;


    if (showSizeForm == false) {
      return (
        <div className="editNewSizeButtonContainer">
          <button onClick={() => displayNewSizeForm(iter1)}>Add New Size</button>
        </div>
      )
    }
  }

  // display the colors and sizes

  const RenderColorArray = () => {
    return (
      <div>

        <div className="editContainer">

          <div className="card" >


            <div className='descriptionContainer'>

              {current_data.colorArray.map((index2, iter1) => {

                return (
                  <div className="editBorderContainer" key={iter1}>
                    <h4 className="colorText"><span className='productSpan'>color:</span> {index2.color}</h4>

                    <RenderSizeButton
                      iter1={iter1}
                    />
                    <NewSizeForm
                      iter1={iter1}
                    />
                    {index2.sizeArray.map((index3, iter2) => {
                      return (
                        <div className='productQuantityContainer' key={iter2}>
                          <div className='sizeEditDeleteContainer'>
                              <div>
                              <p><span className='productSpan'>size:</span> {index3.size}</p>
                              <p><span className='productSpan'>price:</span> {index3.price / 100}</p>
                              <p><span className='productSpan'>quantity:</span> {index3.quantity}</p>
                              <p><span className='productSpan'>length:</span> {index3.length / 100}</p>
                              <p><span className='productSpan'>width:</span> {index3.width / 100}</p>
                              <p><span className='productSpan'>height:</span> {index3.height / 100}</p>
                              <p><span className='productSpan'>weight:</span> {index3.weight / 100}</p>
                            </div>
                            <div className="sizeArrayButtonContainer">
                              <img className="editIcon" src={trashIcon} onClick={() => handleDelete(iter1, iter2)}></img>
                              <img className="editIcon" src={editIcon} onClick={(e) => handleEdit(e, iter1, iter2)} disabled={disableEdit.current} type="submit" ></img>
                              <img className="editIcon" src={imageIcon} onClick={() => showImage(iter1)} disabled={disablePic.current}></img>
                            </div>
                          </div>
                          {showForm(iter1, iter2)}

                        </div>
                      )
                    })}
                    {renderPicForm(index2, iter1)}

                    
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
          <EditSizeForm />
        </div>
      )
    }
  }


  const EditSizeForm = () => {


    let colorIter = iter.current.colorIter
    let sizeIter = iter.current.sizeIter


    return (
      <div>
        <form onSubmit={submitColorForm} >
          <label>
            <p>Color (enter false if only one color)</p>
            <input defaultValue={current_data.colorArray[colorIter].color} className="sizeInput" type="text" name="color" />
          </label>
          <label>
            <p>Size (enter false if only one size)</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].size} className="sizeInput" type="text" name="size" />
          </label>
          <label>
            <p>Price</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].price / 100} className="sizeInput" type="number" step="0.01" name="price" required />
          </label>
          <label>
            <p>Quantity</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].quantity} className="sizeInput" type="number" name="quantity" required />
          </label>
          <label>
            <p>Length</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].length / 100} className="sizeInput" type="number" step="0.01" name="length" required />
          </label>
          <label>
            <p>Width</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].width / 100} className="sizeInput" type="number" step="0.01" name="width" required />
          </label>
          <label>
            <p>Height</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].height / 100} className="sizeInput" type="number" step="0.01" name="height" required />
          </label>
          <label>
            <p>Weight</p>
            <input defaultValue={current_data.colorArray[colorIter].sizeArray[sizeIter].weight / 100} className="sizeInput" type="number" step="0.01" name="weight" required />
          </label>
          <div className="editColorSubmit">
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
      <RenderColorArray />
      <DisplayMessage />
      <button onClick={sendUpdates}>Submit Changes</button>
    </div>


  )




}




export default Edit;
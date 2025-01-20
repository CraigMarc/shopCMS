import { useNavigate, Link } from "react-router-dom";
import Header from './Header'
import { useState, useRef, useEffect } from 'react'
import Dropdown from './Dropdown'
import DropdownSub from './DropdownSub'
import DropdownBrand from './DropdownBrand'



const NewProduct = (props) => {

    const {

        setLogMessage,
        category,
        setCategory,
        brand,
        setBrand

    } = props;


    const navigate = useNavigate();



    const [categoryForm, setCategoryForm] = useState(category[0].name)
    const [brandForm, setBrandForm] = useState(brand[0].name)
    const [current_data, setCurrent_data] = useState()
    const category_id = useRef(category[0]._id);
    const brand_id = useRef(brand[0]._id);
    const [subCategory, setSubCategory] = useState()
    const hideMainForm = useRef(false);
    const [showColorForm, setShowColorForm] = useState(false)
    const [showSizeForm, setShowSizeForm] = useState(false)
    const iterNewSizeForm = useRef();
    const disablePic = useRef(false);
    const iterImage = useRef();
    const [showPicForm, setShowPicForm] = useState(false)


    if (category[0].subCategory.length > 0) {
        setSubCategory(category[0].subCategory[0].name)
    }

    const token = sessionStorage.getItem("token");
    const tokenOb = JSON.parse(token)
    const tokenFetch = `Bearer ${tokenOb.token}`


    // submit new product

    const submitMain = async (e) => {

        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());


        let uuid = self.crypto.randomUUID()


        //send form data
        await fetch("http://localhost:3000/products/new_product1", {



            method: 'POST',
            body: JSON.stringify({
                title: data.title,
                category: category_id.current,
                subCategory: subCategory,
                description: data.description,
                modelNum: data.modelNum,
                sale_percent: data.salePercent,
                brand: brand_id.current,
                colorArray: [],
                product_id: uuid

            }),
            headers: {
                Authorization: tokenFetch,
                'Content-type': 'application/json; charset=UTF-8',
            },
        })



            .then((response) => response.json())
            .then((data) => {

                hideMainForm.current = true
                setCurrent_data(data)


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

    // submit new color

    const submitColor = async (e) => {

        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());

        current_data.colorArray.push({ color: data.color, sizeArray: [], images: [] })

        //send form data
        await fetch("http://localhost:3000/products/new_color", {

            method: 'POST',
            body: JSON.stringify({

                colorArray: current_data.colorArray,
                _id: current_data._id

            }),
            headers: {
                Authorization: tokenFetch,
                'Content-type': 'application/json; charset=UTF-8',
            },
        })



            .then((response) => response.json())
            .then((data) => {

                setShowColorForm(false)
                setCurrent_data(data)


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

    // submit new size

    const submitNewSize = async (e) => {

        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log(data)

        data.height = data.height * 100
        data.length = data.length * 100
        data.price = data.price * 100
        data.weight = data.weight * 100
        data.width = data.width * 100
        data.quantity = Number(data.quantity)

        current_data.colorArray[iterNewSizeForm.current].sizeArray.push({ size: data.size, height: data.height, length: data.length, price: data.price, weight: data.weight, width: data.width, quantity: data.quantity })

        //send form data
        await fetch("http://localhost:3000/products/new_color", {

            method: 'POST',
            body: JSON.stringify({

                colorArray: current_data.colorArray,
                _id: current_data._id

            }),
            headers: {
                Authorization: tokenFetch,
                'Content-type': 'application/json; charset=UTF-8',
            },
        })



            .then((response) => response.json())
            .then((data) => {

                setShowSizeForm(false)
                setCurrent_data(data)


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

    // submit new image

  const newImage = async (e, colorIter) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

   
    //send pic in multipart form
    const formData = new FormData();

    formData.append("current_id", current_data._id);
    formData.append("image", data.image);
    formData.append("array_number", colorIter);

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
        disablePic.current = false
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


    // delete image

    const deleteImage = async (colorIter, picIter) => {

        let array2 = structuredClone(current_data);
        let picName = current_data.colorArray[colorIter].images[picIter]

        array2.colorArray[colorIter].images.splice(picIter, 1)

        await fetch(`http://localhost:3000/products/image/`, {
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
                        let url = `http://localhost:3000/${index}`
                        return (
                            <div className="editImageContainer" key={iter}>
                                <img className="newProdImage" src={url}></img>
                                <button onClick={() => deleteImage(colorIter, iter)}>delete image</button>
                            </div>
                        )
                    })
                    }
                </div>
            )

        }
    }

    // render new pic form 
    const newPicForm = (colorIter) => {

        if (showPicForm == true) {
        return (
            <div className="addImageContainer">
                <form encType="multipart/form-data" onSubmit={(e) => newImage(e, colorIter)}>
                    <label>
                        <div className="form-group">
                            <label>Image (file must be .jpeg .jpg or .png):</label>
                            <input type="file" required className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
                        </div>
                    </label>
                    <div className="addImage">
                        <button type="submit">Add New Picture</button>
                    </div>
                </form>
            </div>
        )
    }
    }

    // color form

    function Colorform() {

        if (showColorForm == true) {

            return (
                <div>
                    <form onSubmit={submitColor}>
                        <label>
                            <p>Color</p>
                            <input className="productInput" type="text" name="color" required />
                        </label>
                        <div className="addColorSubmit">

                            <button type="submit">Add Color</button>

                        </div>
                    </form>

                </div>
            )
        }
    }

    // show new size form when button clicked

    function renderNewSizeForm(e) {
        setShowSizeForm(true)
        iterNewSizeForm.current = e.target.value

    }

    // add new size form
    const NewSizeForm = (props) => {

        const {

            iter

        } = props;


        if (showSizeForm == true && iterNewSizeForm.current == iter) {
            return (
                <div>
                    <form onSubmit={submitNewSize} >
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


    function renderMainForm() {
        if (hideMainForm.current == false) {
            return (
                <>
                    {displayMainForm()}
                </>
            )
        }
        else {
            return (
                <div>
                    <p><span className='productSpan'>category:</span> {current_data.category.name}</p>
                    <p><span className='productSpan'>subCategory:</span> {current_data.subCategory}</p>
                    <p><span className='productSpan'>brand:</span> {current_data.brand.name}</p>
                    <p><span className='productSpan'>model number:</span> {current_data.modelNum}</p>
                    <p><span className='productSpan'>sale percent:</span> {current_data.sale_percent}</p>
                    <p><span className='productSpan'>description:</span> {current_data.description}</p>
                    <button onClick={() => setShowColorForm(true)}>Add New Color</button>
                    <Colorform />

                    {current_data.colorArray.map((index, iter) => {

                        return (
                            <div key={iter}>
                                <p><span className='productSpan'>color:</span> {index.color}</p>
                                <button>edit color</button>
                                <button>delete color</button>
                                <button onClick={() => showImage(iter)} disabled={disablePic.current}>add image</button>
                                {displayImages(index, iter)}
                                {newPicForm(iter)}
                                <button value={iter} onClick={(e) => renderNewSizeForm(e)}>Add New Size</button>
                                <NewSizeForm
                                    iter={iter}
                                />
                                {index.sizeArray.map((index2, iter2) => {
                                    return (
                                        <div className='productQuantityContainer' key={iter2}>
                                            <p><span className='productSpan'>size:</span> {index2.size}</p>
                                            <p><span className='productSpan'>price:</span> {index2.price / 100}</p>
                                            <p><span className='productSpan'>quantity:</span> {index2.quantity}</p>
                                            <p><span className='productSpan'>length:</span> {index2.length / 100}</p>
                                            <p><span className='productSpan'>width:</span> {index2.width / 100}</p>
                                            <p><span className='productSpan'>height:</span> {index2.height / 100}</p>
                                            <p><span className='productSpan'>weight:</span> {index2.weight / 100}</p>
                                            <button>edit size</button>
                                            <button>delete size</button>
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


    function displayMainForm() {
        return (
            <div>
                <form onSubmit={submitMain}>
                    <label>
                        <p>Product Name</p>
                        <input className="titleInput" type="text" name="title" required />
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

                    <DropdownBrand
                        dataName={brand}
                        setForm={setBrandForm}
                        data_id={brand_id}
                        dataForm={brandForm}
                        labelName="Brand"
                    />
                    <label>
                        <label>
                            <p>Model Number</p>
                            <input className="titleInput" type="text" name="modelNum" />
                        </label>
                        <label>
                            <p>Sale Percent (not required)</p>
                            <input className="titleInput" type="number" name="sale_percent" />
                        </label>
                        <p>Description</p>
                        <textarea className="descriptInput" type="text" name="description" required />
                    </label>


                    <button type="submit">Submit</button>

                </form>

            </div>
        )
    }

    return (
        <div>
            {renderMainForm()}
        </div>
    )


}

export default NewProduct;
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

        current_data.colorArray.push({color: data.color, sizeArray: [], images: []})

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
                    <Colorform/>
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
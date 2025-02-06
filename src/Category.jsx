import { useNavigate } from "react-router-dom";
import { useState, useRef } from 'react'
import Header from './Header'
import editIcon from './assets/editIcon30.png'
import trashIcon from './assets/trashIcon.png'
import imageIcon from './assets/imageIcon.png'


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

  const [message, setMessage] = useState(null)
  const [subMessage, setSubMessage] = useState(null)
  const [displaySub, setDisplaySub] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const iterCategoryForm = useRef();
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false)
  const iterSubCategoryForm = useRef();


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

  const handleDelete = async (id, iter) => {


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
          setMessage(iter)
        }
        else {
          setCategory(data)
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

  // handle subcat delete

  const handleDeleteSub = async (_id, iter, subName) => {



    await fetch(`http://localhost:3000/products/delete_subcategory/`, {
      method: 'Delete',

      body: JSON.stringify({

        _id: _id,
        iter: iter,
        subName: subName

      }),

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.message == "category in use") {
          setSubMessage(iter)
        }
        else {
          setCategory(data)
          setSubMessage(null)
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




  // handle new sub category submit
  const handleSubcatSubmit = async (e, index) => {

    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target).entries());

    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("image", data.image);

    await fetch(`http://localhost:3000/products/new_subcategory/${index._id}`, {

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
        setDisplaySub(false)

      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  // add pic to existing category

  const newImage = async (e, index) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();

    formData.append("image", data.image);



    await fetch(`http://localhost:3000/products/new_category_image/${index._id}`, {

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

  // delete category pic

  const deleteImage = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/delete_category_image/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setCategory(data)
        //maybe set state for a rerender
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // add pic to existing subcategory

  const newSubImage = async (e, index, iter2) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const formData = new FormData();

    formData.append("image", data.image);
    formData.append("subIter", iter2);

    await fetch(`http://localhost:3000/products/new_subCategory_image/${index._id}`, {

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


  // delete subcategory pic

  const deleteSubImage = async (event, iter2) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/delete_subCategory_image/${id}`, {
      method: 'Delete',

      body: JSON.stringify({

        subIter: iter2

      }),

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setCategory(data)

      })
      .catch((err) => {
        console.log(err.message);
      });
  };


  // submit category edit form

  const submitCategoryEditForm = async (e, _id) => {

    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());


    await fetch(`http://localhost:3000/products/edit_category/${_id}`, {
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
        setShowCategoryForm(false)
        setCategory(data)
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

  // submit category edit form

  const submitSubCategoryEditForm = async (e, _id, iter2) => {

    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());


    await fetch(`http://localhost:3000/products/edit_subcategory/${_id}`, {
      method: 'PUT',
      body: JSON.stringify({

        name: data.name,
        subIter: iter2

      }),
      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })



      .then((response) => response.json())
      .then((data) => {
        setShowSubCategoryForm(false)
        setCategory(data)
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




  // display subcategory form

  function handleDisplay() {
    setDisplaySub(true)
  }

  // render sub form when button clicked
  function DisplaySubForm(props) {
    const {

      index

    } = props;


    if (displaySub == true)
      return (
        <form encType="multipart/form-data" onSubmit={(e) => handleSubcatSubmit(e, index)}>
          <h4>Add new subcategory</h4>
          <label>
            <p>Name</p>
            <input className="nameInput" type="text" required name="name" />
          </label>
          <div className="addImage">
            <label>Image (file must be .jpeg .jpg or .png): (subcategory pics not currently in use)</label>
            <input type="file" className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
          </div>
          <div className="newPostSubmit">
            <button type="submit">Add New SubCategory</button>
          </div>
        </form>
      )
  }

  // show subCategory form when button clicked

  function displaySubCategoryEditForm(iter2) {
    setShowSubCategoryForm(true)
    iterSubCategoryForm.current = iter2

  }

  // render subcatecory edit form 

  function RenderSubCategoryEditForm(props) {

    const {

      index2,
      iter2,
      index

    } = props;


    if (showSubCategoryForm == true && iterSubCategoryForm.current == iter2) {

      return (
        <div>
          <form onSubmit={(e) => submitSubCategoryEditForm(e, index._id, iter2)} >
            <label>
              <p>Name</p>
              <input defaultValue={index2.name} type="text" name="name" />
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
        <button className="delete" value={index._id} onClick={deleteImage}>delete image</button>
      )
    }
    else {
      return (
        <form encType="multipart/form-data" onSubmit={(e) => newImage(e, index)}>
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
      )
    }


  }

  // List all subcategories

  function ListSubCategories(props) {
    const {

      index

    } = props;


    if (index.subCategory) {
      return (
        <div className="subPadding">
          <h3>Subcategories</h3>

          {index.subCategory.map((index2, iter2) => {

            let url = `http://localhost:3000/${index2.image}`

            return (
              <div className="subCategoryContainer" key={iter2}>
                <h4>{index2.name}</h4>
                <div className="subcategoryButtoncontainer">
                  <img className="newProdImage" src={url}></img>
                  <img className="editIcon" src={trashIcon} onClick={() => handleDeleteSub(index._id, iter2, index2.name)}></img>
                  <img className="editIcon" src={editIcon} value={iter2} onClick={() => displaySubCategoryEditForm(iter2)} ></img>
                </div>
                <DisplaySubMessage
                  iter={iter2}
                />
                <RenderSubCategoryEditForm
                  index2={index2}
                  iter2={iter2}
                  index={index}
                />
                <RenderSubPicButton
                  index2={index2}
                  iter2={iter2}
                  index={index}
                />
              </div>
            )
          })}
        </div>
      )
    }

  }

  // render edit form 

  function RenderCategoryEditForm(props) {

    const {

      index,
      iter

    } = props;


    if (showCategoryForm == true && iterCategoryForm.current == iter) {

      return (
        <div>
          <form onSubmit={(e) => submitCategoryEditForm(e, index._id)} >
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

  // show form when button clicked

  function displayCategoryEditForm(iter) {
    setShowCategoryForm(true)
    iterCategoryForm.current = iter

  }

  // show delete or edit image buttons

  function RenderPicButton(props) {

    const {

      index

    } = props;

    if (index.image) {
      return (
        <button className="delete" value={index._id} onClick={deleteImage}>delete image</button>
      )
    }
    else {
      return (
        <form encType="multipart/form-data" onSubmit={(e) => newImage(e, index)}>
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
      )
    }


  }

  // show delete or edit image buttons for subcategory

  function RenderSubPicButton(props) {

    const {

      index2,
      index,
      iter2

    } = props;



    if (index2.image) {
      return (
        <button className="delete" value={index._id} onClick={(e) => deleteSubImage(e, iter2)}>delete image</button>
      )
    }
    else {
      return (
        <form encType="multipart/form-data" onSubmit={(e) => newSubImage(e, index, iter2)}>
          <label>
            <div className="form-group">
              <label>Image (file must be .jpeg .jpg or .png): (pics not currently in use)</label>
              <input type="file" required className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
            </div>
          </label>
          <div className="addImage">
            <button type="submit">Add New Picture</button>
          </div>
        </form>
      )
    }


  }


  // list all categories

  function ListCategories() {

    if (category) {
      return (
        <div className="categoryDivPadding">
          <h2>Categories</h2>

          {category.map((index, iter) => {

            let url = `http://localhost:3000/${index.image}`


            return (

              <div key={iter} className="post">

                <div id={index._id} className="card" >

                  <div className='descriptionContainer'>
                    <h3>{index.name}</h3>
                    <div className="categoryEditButtons">
                      <img className="editIcon" src={trashIcon} value={index._id} onClick={() => handleDelete(index._id, iter)}></img>
                      <img className="editIcon" src={editIcon} onClick={() => displayCategoryEditForm(iter)}></img>
                      <RenderCategoryEditForm
                        index={index}
                        iter={iter}
                      />
                    </div>
                    <img className="newProdImage" src={url}></img>
                  </div>


                </div>
                <div className="renderCategoryImageCont">
                  <RenderPicButton
                    index={index}
                  />
                </div>
                <button onClick={handleDisplay}>add subcategory</button>
                <DisplayMessage
                  iter={iter}
                />
                <DisplaySubForm
                  index={index}
                />
                <ListSubCategories
                  index={index}
                />


                <div className="subButtonContainer">

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

  function DisplaySubMessage(props) {

    const {

      iter

    } = props;


    if (subMessage == iter) {
      return (
        <div>
          <h3>This subcategory is in use delete all products using the subcategory to delete the subcategory</h3>
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
          <h3>This category is in use delete all products using the category to delete the category</h3>
        </div>
      )
    }
  }


  return (
    <div>

      <Header />
      <dir className="newCategoryForm">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <label>
            <p>Category Name</p>
            <input className="nameInput" type="text" required name="name" />
          </label>
          <div className="addImage">
            <label>Image (file must be .jpeg .jpg or .png):</label>
            <input type="file" className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
          </div>
          <div className="newPostSubmit">
            <button type="submit">Add New Category</button>
          </div>
        </form>
      </dir>
      <ListCategories />
    </div>
  )
}




export default Category;
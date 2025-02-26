import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"

function Products(props) {

  const navigate = useNavigate();

  const {

    products,
    setProducts,
    setLogMessage,
    category,
    setCategory,
   
   

  } = props;


  //load page get info use token

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  // publish posts

  const handlePublish = async (event, index, iter) => {
    let id = event.target.value

    if (index.colorArray.length == 0 || index.colorArray[0].sizeArray.length == 0) {
    
      setMessage(iter)
    }

else {
    await fetch(`/apiproducts/publish/${id}`, {
      method: 'PUT',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setProducts(data)
        //maybe set state for a rerender
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
  };

  // delete posts

  const handleDelete = async (event) => {
    let id = event.target.value


    await fetch(`/apiproducts/delete/${id}`, {
      method: 'Delete',

      headers: {
        Authorization: tokenFetch,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        setProducts(data)
        //maybe set state for a rerender
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

  
const fetchInfo = async () => {
  //setLoading(true)

  try {
    //return fetch(picUrl)
    
    const [apiProducts, apiCategory] = await Promise.all([
      await fetch('/apiusers/all'), 
      await fetch('/apiusers/category'),
     
    ]);

   

    const productData = await apiProducts.json();
    const categoryData = await apiCategory.json();
    
   

    //setData(productData)
    setProducts(productData)
    setCategory(categoryData)
    
   
  }

  catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    //add error message to dom
    setError("true")

  }
  setLoading(false)

}


useEffect(() => {
  fetchInfo();
}, [])


//display error and loading for api call

if (error) return (
  <div>

    <p>A network error was encountered</p>
  </div>
)

if (loading) return <p>Loading...</p>;

// renderMessage


function renderMessage (iter) {


  if (message == iter) {
    return (
      <h4>Must have at least one color and one size to publish</h4>
    )
  }
}

// render page


  return (
    <div>
      <Header
        setLogMessage={setLogMessage}
      />
      <h2 className='pageTitle'>All Products</h2>
      <div className="newPostContainer" >
            
          </div>
      <div className='postContainer'>

        <div className="postCard">

          {products.map((index, iter) => {
           
            let published = ""
            if (index.published == true) {
              published = 'Yes'
            }
            else {
              published = 'No'
            }

            return (

              <div key={index._id} className="post">

                <div id={index._id} className="card" >

                  <div className='titleContainer'>
                    <h2 className='postTitle'>{index.title}</h2>
                    
                  </div>
                  <div className='descriptionContainer'>
                    <p><span className='productSpan'>category:</span> {index.category.name}</p>
                    <p><span className='productSpan'>subCategory:</span> {index.subCategory}</p>
                    <p><span className='productSpan'>brand:</span> {index.brand}</p>
                    <p><span className='productSpan'>model number:</span> {index.modelNum}</p>
                    <p><span className='productSpan'>sale percent:</span> {index.sale_percent}</p>
                    <p><span className='productSpan'>description:</span> {index.description}</p>

                    {index.colorArray.map((index2, iter2) => {
                      let url = ""
                      if (index2.images) {
                       url = `/api${index2.images[0]}`
                      }
                    return (
                      <div key={iter2}>
                        <p><span className='productSpan'>color:</span> {index2.color}</p>

                        {index2.sizeArray.map((index3, iter) => {
                    return (
                      <div className='productQuantityContainer' key={iter}>
                        <p><span className='productSpan'>size:</span> {index3.size}</p>
                        <p><span className='productSpan'>price:</span> {index3.price /100}</p>
                        <p><span className='productSpan'>quantity:</span> {index3.quantity}</p>
                        <p><span className='productSpan'>length:</span> {index3.length /100}</p>
                        <p><span className='productSpan'>width:</span> {index3.width /100}</p>
                        <p><span className='productSpan'>height:</span> {index3.height /100}</p>
                        <p><span className='productSpan'>weight:</span> {index3.weight /100}</p>
                       

                      </div>
                    )
                  })}
                      <img className="newProdImage" src={url}></img>
                      </div>
                    )
                  })}
                   
                    
                  </div>
                  {renderMessage(iter)}

                  <div className='commentContainer'>
                    <p><span className='productSpan'>Published:</span> {published}</p>

                  </div>
                </div>
                <div className='allButtonContainer'>
                  <div className="deleteButtonContainer">
                    <button className="delete" value={index._id} onClick={handleDelete} >delete product</button>

                  </div>
                  <div className="editButtonContainer" >
                    <Link to={`product/${index._id}`} state={index._id}>
                      <button className="edit" value={index._id} >edit product</button>
                    </Link>
                  </div>
                  <div className="publishButtonContainer"  >
                    <button className="publish" value={index._id} onClick={(e) => handlePublish(e, index, iter)} >publish/unpublish product</button>

                  </div>
                </div>
              </div>

            )
          })}

         

        </div>
      </div>
    </div>
  )


}

export default Products
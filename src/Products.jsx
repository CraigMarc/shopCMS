import { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"

function Products(props) {

  const navigate = useNavigate();

  const {

    products,
    setProducts,
    setLogMessage,

  } = props;



  //load page get info use token

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  // publish posts

  const handlePublish = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/publish/${id}`, {
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
  };

  // delete posts

  const handleDelete = async (event) => {
    let id = event.target.value


    await fetch(`http://localhost:3000/products/delete/${id}`, {
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


  //get posts


  const fetchInfo = async () => {
    //setLoading(true)

    try {

      const apiProducts = await fetch('http://localhost:3000/products/all', {
        headers: { Authorization: tokenFetch }

      })


      const productData = await apiProducts.json();

      setProducts(productData)

    }

    catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      //add error message to dom
      setError("true")

      //send to login if token expires

      if (error.message.includes("Unauthorized")) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("message");
        setLogMessage(true)
        navigate('/login')
      }

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


  return (
    <div>
      <Header
        setLogMessage={setLogMessage}
      />
      <h2 className='pageTitle'>All Products</h2>
      <div className='postContainer'>

        <div className="postCard">

          {products.map((index) => {
            //const postComments = comments.filter((comment) => comment.posts_id == index._id).length
            let image = index.image
            let url = ""
            if (image) {
              url = `http://localhost:3000/uploads/${index.image}`
            }
            let date = new Date(index.timestamp).toLocaleString()
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


                  <h2 className='postTitle'>{index.title}</h2>
                  <p>model number: {index.modelNum}</p>
                  <p>quantity: {index.quantity}</p>
                  <img alt="no image" className="imgPost" src={url}></img>
                  <div className='commentContainer'>
                    <p>Published: {published}</p>

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
                    <button className="publish" value={index._id} onClick={handlePublish} >publish/unpublish product</button>

                  </div>
                </div>
              </div>

            )
          })}

          <div className="newPostContainer" >
            <Link to={'/newproduct'}>
              <button className="edit"  >Add New Product</button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )


}

export default Products
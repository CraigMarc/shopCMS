import { useNavigate } from "react-router-dom";
import Header from './Header'

const NewProduct = (props) => {

  const navigate = useNavigate();

  const {

    setLogMessage,

  } = props;

  const token = sessionStorage.getItem("token");
  const tokenOb = JSON.parse(token)
  const tokenFetch = `Bearer ${tokenOb.token}`

  //submit new post

  const handleSubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    const formData = new FormData();

    formData.append("title", data.title)
    formData.append("category", data.category)
    formData.append("brand", data.brand)
    formData.append("color", data.color)
    formData.append("description", data.description)
    formData.append("modelNum", data.modelNum)
    formData.append("price", data.price)
    formData.append("length", data.length)
    formData.append("height", data.height)
    formData.append("width", data.width)
    formData.append("weight", data.weight);
    formData.append("quantity", data.quantity)
    formData.append("image", data.image);


    await fetch("http://localhost:3000/products/new", {

      method: 'Post',
      body: formData,

      headers: {
        Authorization: tokenFetch,
        //'Content-type': 'application/json; charset=UTF-8',

      },
    })
      .then((response) => response.json())
      .then((data) => {
       navigate('/');

      })
      .catch((err) => {
        console.log(err.message);

        if (err.message.includes("Unauthorized")) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user_id");
          sessionStorage.removeItem("message");
          setLogMessage(true)
          navigate('/login')
        }

      });

  }


  return (
    <div className="login-wrapper">

      <Header
      setLogMessage={setLogMessage}
      />
      <h2 className="pageTitle">New Product</h2>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <label>
          <p>Product Name</p>
          <input className="titleInput" type="text" name="title" required />
        </label>
        <label>
          <p>Category</p>
          <input className="titleInput" type="text" name="category" required />
        </label>
        <label>
          <p>Brand</p>
          <input className="titleInput" type="text" name="brand" />
        </label>
        <label>
          <p>Color</p>
          <input className="titleInput" type="text" name="color"  />
        </label>
        <label>
          <p>Description</p>
          <textarea className="descriptInput" type="text" name="description" required  />
        </label>
        <label>
          <p>Model Number</p>
          <input className="titleInput" type="text" name="modelNum" />
        </label>
        <label>
          <p>Price</p>
          <input className="titleInput" type="number" name="price" required />
        </label>
        <label>
          <p>Length</p>
          <input className="titleInput" type="number" name="length" required />
        </label>
        <label>
          <p>Width</p>
          <input className="titleInput" type="number" name="width" required  />
        </label>
        <label>
          <p>Height</p>
          <input className="titleInput" type="number" name="height" required  />
        </label>
        <label>
          <p>Weight</p>
          <input className="titleInput" type="number" name="weight" required  />
        </label>
        <label>
          <p>Quantity</p>
          <input className="titleInput" type="number" name="quantity" required  />
        </label>

        <div className="addImage">
          <label>Image (file must be .jpeg .jpg or .png):</label>
          <input type="file" className="form-control-file" id="image" name="image" accept=".jpeg, .jpg, .png" />
        </div>
        <div className="newProductSubmit">
          <button type="submit product">Submit</button>
        </div>
      </form>

    </div>
  )
}




export default NewProduct;
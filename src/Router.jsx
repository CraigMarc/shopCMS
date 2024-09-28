import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./Products"
import ErrorPage from "./ErrorPage";
import Login from "./Login"
import Edit from "./Edit"
import NewProduct from "./NewProduct"

const Router = (props) => {

  const {

    products,
    setProducts,
    token,
    setToken,
    

  } = props;

  const router = createBrowserRouter([

    {
      path: "/",
      element:
        <Products
          products={products}
          setProducts={setProducts}

        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/login",
      element: <Login
        
        setToken={setToken}
        
      />,
      errorElement: <ErrorPage />,
    },

    {
      path: "/post/:id",
      element:
        <Edit
          products={products}
          setMessages={setProducts}

        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/newproduct",
      element:
        <NewProduct
          products={products}
       
        />,

      errorElement: <ErrorPage />,
    },


  ]);

  return <RouterProvider router={router} />;
};

export default Router;
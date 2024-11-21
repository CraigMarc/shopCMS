import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./Products"
import ErrorPage from "./ErrorPage";
import Login2 from "./Login2"
import Edit from "./Edit"
import NewProduct from "./NewProduct"
import Orders from "./Orders"

const Router = (props) => {

  const {

    products,
    setProducts,
    token,
    setToken,
    logMessage,
    setLogMessage,
    orders,
    setOrders


  } = props;

  const router = createBrowserRouter([

    {
      path: "/",
      element:
        <Products
          products={products}
          setProducts={setProducts}
          setLogMessage={setLogMessage}
        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/login",
      element: <Login2
        setToken={setToken}
        logMessage={logMessage}
        setLogMessage={setLogMessage}

      />,
      errorElement: <ErrorPage />,
    },

    {
      path: "/product/:id",
      element:
        <Edit
          products={products}
          setProducts={setProducts}
          setLogMessage={setLogMessage}
        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/newproduct",
      element:
        <NewProduct
          products={products}
          setLogMessage={setLogMessage}

        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/orders",
      element:
        <Orders
          setLogMessage={setLogMessage}
          orders={orders}
          setOrders={setOrders}

        />,

      errorElement: <ErrorPage />,
    },


  ]);

  return <RouterProvider router={router} />;
};

export default Router;
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./Products"
import ErrorPage from "./ErrorPage";
import Login2 from "./Login2"
import Edit from "./Edit"
import NewProduct from "./NewProduct"
import Orders from "./Orders"
import EditOrder from "./EditOrder"
import Category from "./Category"
import Brand from "./Brand"


const Router = (props) => {

  const {

    products,
    setProducts,
    token,
    setToken,
    logMessage,
    setLogMessage,
    orders,
    setOrders,
    category,
    setCategory,
    brand,
    setBrand


  } = props;

  const router = createBrowserRouter([

    {
      path: "/",
      element:
        <Products
          products={products}
          setProducts={setProducts}
          setLogMessage={setLogMessage}
          category={category}
          setCategory={setCategory}
          setBrand={setBrand}
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
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/newproduct",
      element:
        <NewProduct
          products={products}
          setLogMessage={setLogMessage}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}

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

    {
      path: "orders/order/:id",
      element:
        <EditOrder
          setLogMessage={setLogMessage}
          orders={orders}
          setOrders={setOrders}

        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/category",
      element:
        <Category
        setLogMessage={setLogMessage}
        category={category}
        setCategory={setCategory}

        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/brand",
      element:
        <Brand
        setLogMessage={setLogMessage}
        brand={brand}
        setBrand={setBrand}

        />,

      errorElement: <ErrorPage />,
    },
 

  ]);

  return <RouterProvider router={router} />;
};

export default Router;
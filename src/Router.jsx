import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./Products"
import ErrorPage from "./ErrorPage";
import Login from "./Login"
import Edit from "./Edit"
import NewProduct from "./NewProduct"

const Router = (props) => {

  const {

    messages,
    setMessages,
    comments,
    setComments,
    token,
    setToken,
    

  } = props;

  const router = createBrowserRouter([

    {
      path: "/",
      element:
        <Products
          messages={messages}
          setMessages={setMessages}
          comments={comments}
          setComments={setComments}

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
          messages={messages}
          setMessages={setMessages}
          comments={comments}
          setComments={setComments}

        />,

      errorElement: <ErrorPage />,
    },

    {
      path: "/newproduct",
      element:
        <NewProduct
          messages={messages}
          comments={comments}
          setComments={setComments}

        />,

      errorElement: <ErrorPage />,
    },


  ]);

  return <RouterProvider router={router} />;
};

export default Router;
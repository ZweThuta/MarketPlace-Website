import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./layouts/Main";
import Error from "./pages/Error";
import { AuthProvider } from "./util/AuthContext";
import Logout from "./pages/Logout";
import AddProducts from "./pages/AddProducts";
import UserProducts, { userProductsLoader } from "./pages/UserProducts";
import UserProductsDetails from "./pages/UserProductDetails"
import EditProduct from "./pages/EditProduct";
import Products, { productsLoader } from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Category, { categoryLoader } from "./pages/Category";
import MyCart from "./pages/MyCart";
import SearchProducts from "./pages/SearchProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Main />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Index />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/logout",
          element:<Logout/>
        },
        
        {
          path: "/addProduct",
          element:<AddProducts/>
        },
        {
          path: "/editProduct/:productId",
          element: <EditProduct/>

        },
        {
          path: "/userProduct",
          element: <UserProducts/>,
          loader: userProductsLoader,
        },
        {
          path: "/userProductDetail/:productId",
          element: <UserProductsDetails/>
        },
        {
          path:"/products",
          element:<Products/>,
          loader: productsLoader,
        },
        {
          path: "/productDetails/:productId",
          element:<ProductDetails/>
        },
        {
          path:"/category/:category",
          element:<Category/>,
          loader: categoryLoader,
        },
        {
          path:"/addToCart",
          element:<MyCart/>
        },
        {
          path:"/searchProducts",
          element:<SearchProducts/>
        }
      ],
    },
  ]);

  return (
    <>
      <AuthProvider>
      <ToastContainer position="bottom-right" theme="dark" autoClose={2000} />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
};

export default App;

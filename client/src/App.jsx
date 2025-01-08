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
import UserProductsDetails from "./pages/UserProductDetails";
import EditProduct from "./pages/EditProduct";
import Products, { productsLoader } from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Category, { categoryLoader } from "./pages/Category";
import MyCart from "./pages/MyCart";
import SearchProducts from "./pages/SearchProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavProducts from "./pages/FavProducts";
import CheckOut from "./pages/CheckOut";
import BillingReceipt from "./pages/BillingReceipt";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AdminRoute from "./util/AdminRoute";
import UserDetails from "./pages/UserDetails";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Main />,
      errorElement: <Error />,
      children: [
        {
          path: "/adminPanel",
          element: (
            <AdminRoute>
              <Admin />
            </AdminRoute>
          ),
        },
        {
          path: "/",
          element: <Index />,
        },
        {
          path: "/about",
          element: <About />,
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
          element: <Logout />,
        },

        {
          path: "/addProduct",
          element: <AddProducts />,
        },
        {
          path: "/editProduct/:productId",
          element: <EditProduct />,
        },
        {
          path: "/userProduct",
          element: <UserProducts />,
          loader: userProductsLoader,
        },
        {
          path: "/userProductDetail/:productId",
          element: <UserProductsDetails />,
        },
        {
          path:"/userDetail/:userId",
          element:<UserDetails/>
        },
        {
          path: "/products",
          element: <Products />,
          loader: productsLoader,
        },
        {
          path: "/productDetails/:productId",
          element: <ProductDetails />,
        },
        {
          path: "/category/:category",
          element: <Category />,
          loader: categoryLoader,
        },
        {
          path: "/addToCart",
          element: <MyCart />,
        },
        {
          path: "/searchProducts",
          element: <SearchProducts />,
        },
        {
          path: "/favProducts",
          element: <FavProducts />,
        },
        { path: "/checkout", element: <CheckOut /> },
        { path: "/billingReceipt", element: <BillingReceipt /> },
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

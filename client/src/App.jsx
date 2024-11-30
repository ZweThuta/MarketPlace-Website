import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./layputs/Main";
import Error from "./pages/Error";
import { AuthProvider } from "./util/AuthContext";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import AddProducts from "./pages/AddProducts";
import UserProducts, { userProductsLoader } from "./pages/UserProducts";

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
          path: "/profile",
          element:<Profile/>
        },
        {
          path: "/addProduct",
          element:<AddProducts/>
        },
        {
          path: "/userProduct",
          element: <UserProducts/>,
          loader: userProductsLoader,
        }
      ],
    },
  ]);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />;
      </AuthProvider>
    </>
  );
};

export default App;

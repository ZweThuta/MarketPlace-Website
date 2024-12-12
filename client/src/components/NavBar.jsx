import { Link, useRouteLoaderData } from "react-router-dom";
import logo from "../logo/LuxeSphere_Logo.png";
import { useAuth } from "../util/AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "axios";
const NavBar = () => {
  const [user, setUser] = useState(null);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, user may not be logged in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 1 && response.data.data) {
        setUser(response.data.data);
      } else {
        console.error("Failed to fetch user ID:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error.message);
    } finally{
      setLoading(false);
    }
  };
 

  return (
    <nav className="flex items-center justify-between py-1 bg-richChocolate">
      <Link to={"/"}>
        <div className="flex items-center gap-1">
          <img src={logo} alt="LuxeSphere Logo" width={60} className="ml-2" />
          <div>
            <h1 className="text-xl text-ivoryWhite font-semibold uppercase antialiased tracking-widest">
              LuxeSphere
            </h1>
            <p className="text-gray-100 text-xs font-light tracking-wide">
              Online Market Place
            </p>
          </div>
        </div>
      </Link>
      <div>
          <Link  className="text-white font-semibold hover:text-gray-200 hover:[text-shadow:_0px_0px_2px_#d4d4d4] uppercase tracking-widest [text-shadow:_1px_1px_2px_#d4d4d4]"  to={"/products"}>Market Place</Link>
        </div>
      {authToken ? (
        <>
          <div className="flex items-center mr-4">
            <Link to={"/userProduct"}>
              <div className="flex items-center gap-1 mr-4 p-1 rounded-md  text-ivoryWhite cursor-pointer">
                <UserCircleIcon color="white" width={30} />
                {loading ? ( 
                  <p className="text-white pr-2">Loading...</p>
                ) : user ? (
                  <p className="text-white pr-2 hover:text-gray-200 font-semibold capitalize">
                    {user.name}
                  </p>
                ) : (
                  <p className="text-white pr-2 hover:text-gray-200 font-semibold">
                    Profile
                  </p>
                )}
              </div>
            </Link>
            <Link
              to="/logout"
              className="text-white font-semibold hover:text-gray-200"
              aria-label="Logout"
            >
              Logout
            </Link>
          </div>
        </>
      ) : (
        <>
       
          <div className="flex gap-5 mr-5">
            <Link
              to="/login"
              className="text-white font-semibold hover:text-gray-200"
              aria-label="Login"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white font-semibold hover:text-gray-200"
              aria-label="Register"
            >
              Register
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;

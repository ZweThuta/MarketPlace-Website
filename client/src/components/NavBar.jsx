import { Link, useNavigate } from "react-router-dom";  
import { useAuth } from "../util/AuthContext";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import logo from "../logo/LuxeSphere_Logo.png";
import { itemContext } from "../util/itemContext";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { items } = useContext(itemContext);
  const [searchQuery, setSearchQuery] = useState("");  
  const navigate = useNavigate();  

  const totalCart = items.reduce(
    (currentVal, item) => currentVal + item.amount,
    0
  );

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 1 && response.data.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

 
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/searchProducts?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="flex items-center justify-between py-2 px-4 bg-richChocolate shadow-md relative">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center gap-2">
          <img src={logo} alt="LuxeSphere Logo" width={50} className="ml-2" />
          <div>
            <h1 className="text-xl text-ivoryWhite font-semibold uppercase tracking-wider">
            TrendHaven
            </h1>
            <p className="text-gray-200 text-xs font-light tracking-wide">
              Online Marketplace
            </p>
          </div>
        </div>
      </Link>

      {/* Marketplace Link */}
      <div>
        <Link
          className="text-white text-center font-semibold hover:text-gray-200 hover:[text-shadow:_0px_0px_2px_#d4d4d4] uppercase tracking-widest [text-shadow:_1px_1px_2px_#d4d4d4]"
          to={"/products"}
        >
          Market Place
        </Link>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={searchHandler}
        className="flex items-center bg-gray-300 rounded-lg px-2 py-0 shadow-sm"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-64 px-2 py-0 text-gray-800 text-sm font-medium bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Search"
        >
          <MagnifyingGlassIcon width={24} />
        </button>
      </form>

      {/* Cart and User Section */}
      <div className="flex items-center gap-6">
        {/* Shopping Cart */}
        <div className="relative">
          <Link to="/addToCart" className="flex items-center">
            <ShoppingBagIcon color="white" width={30} />
          </Link>
          {totalCart > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalCart}
            </span>
          )}
        </div>

        {/* Favourite */}
        <div className="relative">
          <Link to="/favProducts" className="flex items-center">
            <HeartIcon color="white" width={30} />
          </Link>
        </div>

        {/* User Profile */}
        {authToken ? (
          <div className="flex items-center gap-4">
            <Link to="/userProduct" className="flex items-center">
              {loading ? (
                <p className="text-white pr-2">Loading...</p>
              ) : user?.profile ? (
                <img
                  src={`${import.meta.env.VITE_IMAGES_URL}/${user.profile}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                  alt="User Profile"
                />
              ) : (
                <UserCircleIcon color="white" width={30} />
              )}
            </Link>
            <Link
              to="/logout"
              className="text-white text-sm font-semibold hover:text-gray-200"
              aria-label="Logout"
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-white text-sm font-semibold hover:text-gray-200"
              aria-label="Login"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white text-sm font-semibold hover:text-gray-200"
              aria-label="Register"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { itemContext } from "../util/itemContext";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { items } = useContext(itemContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="flex items-center gap-10 justify-between py-3 px-4 bg-neroBlack950 shadow-md relative">
      {/* Logo */}
      <div className="flex items-center ml-1 space-x-10">
        {/* Search Bar */}
        <div className="flex items-center">
          <button
            onClick={toggleSearch}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle Search"
          >
            <MagnifyingGlassIcon width={24} className="text-customWhite" />
          </button>
          <form
            onSubmit={searchHandler}
            className={`flex items-center bg-gray-300 rounded-lg px-2 py-0 shadow-sm transition-all duration-300 ease-in-out ${
              isSearchOpen
                ? "max-w-xs opacity-100"
                : "max-w-0 opacity-0 overflow-hidden"
            }`}
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
              <p className="text-customWhite bg-neroBlack950 px-2 py-1 uppercase rounded-lg text-xs tracking-wider">
                Find
              </p>
              {/* <MagnifyingGlassIcon width={24} /> */}
            </button>
          </form>
        </div>
        <Link
          to={"/"}
          className="text-customWhite text-1xl uppercase font-semibold tracking-wider hover:text-shadow-xl"
        >
          Home
        </Link>

        <Link
          to={"/about"}
          className="text-customWhite uppercase text-1xl font-semibold tracking-wider hover:text-shadow-xl"
        >
          About Us
        </Link>
      </div>

     { /* Marketplace Link */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-neroBlack950 py-3 mt-2 px-5 rounded-2xl">
          <Link to={"/products"}>
            <div>
          <h1 className="text-xl text-customWhite italic font-semibold uppercase tracking-wider hover:text-shadow-xl">
            TrendHaven
          </h1>
          <p className="text-gray-300 text-sm text-center font-extralight tracking-wide">
            Online Marketplace
          </p>
            </div>
          </Link>
        </div>

        {/* Cart and User Section */}
      <div className="flex items-center gap-6">
        {/* User Profile */}
        {authToken ? (
          <>
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
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
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
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-customWhite rounded-md shadow-lg py-2 z-20">
                  {
                    user.role === "admin" &&  <Link
                    to="/adminPanel"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Admin Panel
                  </Link>
                  }
                 
                  <Link
                    to="/userProduct"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/register"
              className="text-customWhite text-sm uppercase font-semibold tracking-wider hover:text-shadow-xl border border-customWhite px-4 py-2 rounded-lg"
              aria-label="Register"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

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

const Nav = () => {
  const [user, setUser] = useState(null);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { items } = useContext(itemContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <nav className="flex justify-between items-center p-4 bg-neroBlack950">
      <div className="flex items-center space-x-10">
        <Link
          to={"/"}
          className="text-customWhite text-1xl font-semibold tracking-wider hover:text-shadow-xl"
        >
          Home
        </Link>

        <Link
          to={"/"}
          className="text-customWhite text-1xl font-semibold tracking-wider hover:text-shadow-xl"
        >
          About
        </Link>
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-neroBlack950 py-4 px-5 rounded-2xl z-10">
        <Link
          className="text-customWhite text-center font-semibold hover:text-gray-200 hover:[text-shadow:_0px_0px_2px_#d4d4d4] uppercase tracking-wider [text-shadow:_1px_1px_2px_#d4d4d4]"
          to={"/products"}
        >
           <div>
            <h1 className="text-lg font-semibold uppercase tracking-wider">
            TrendHaven
            </h1>
            <p className="text-gray-200 text-xs font-light tracking-wide">
              Online Marketplace
            </p>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;

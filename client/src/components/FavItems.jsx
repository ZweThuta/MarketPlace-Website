import {
    UserCircleIcon,
    ShoppingCartIcon,
    HeartIcon,
    TrashIcon,
  } from "@heroicons/react/24/solid";
  import { useContext, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { itemContext } from "../util/itemContext";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import axios from "axios";

  
  const FavItems = ({ product, currentUserId }) => {
    const  navigate = useNavigate();
    const {
      id,
      userId,
      name,
      profile,
      productName,
      description,
      image,
      price,
      quantity,
      category,
      date,
    } = product;
  
    
  
    const shortProductName =
      productName.length > 30 ? productName.substr(0, 30) + "..." : productName;
    const shortDescription =
      description.length > 80 ? description.substr(0, 80) + "..." : description;
  
    const { addItem } = useContext(itemContext);
    const [currentAmount, setCurrentAmount] = useState(1);
    const currentAmountNumber = +currentAmount;
  
    const addToCartHandler = () => {
      addItem({
        id,
        productName,
        price,
        image,
        quantity,
        amount: currentAmountNumber,
      });
    };

    
  
    const removeFavouriteHandler = async () => {

        try {
            const response = await axios.delete(`${import.meta.env.VITE_FAVOURITE_URL}?userId=${currentUserId}&productId=${id}`);
            if(response.data?.status === 1){
              toast.success("Removed from Favourites!");
              navigate(0)
            }else{
              toast.error("Failed to remove from Favourites!");
            }
        } catch (error) {
            console.error("Error removing from Favourites:", error);
            toast.error("Failed to remove from Favourites!");
            
        }
    }
  
    return (
        <>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-transform transform hover:scale-105 relative">
          <Link to={`/productDetails/${id}`}>
            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${image}`}
              alt={productName}
              className="w-full h-60 object-cover rounded-t-xl"
            />
          </Link>
          <Link
          to={`/category/${category}`}
          className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full capitalize"
        >
          {category}
        </Link>

          <div className="p-5 text-center">
            <h2 className="text-lg capitalize font-bold text-gray-800 tracking-wide">
              {shortProductName}
            </h2>
            <div className="flex justify-center items-center mt-3">
              <span className="text-green-500 text-2xl font-bold">${price}</span>
            </div>
          </div>
          <div className="flex justify-between items-center px-5 py-4 border-t">
            <button
              onClick={addToCartHandler}
              className="flex items-center text-sm  bg-neroBlack950 text-white hover:bg-customWhite hover:border-neroBlack950 hover:border hover:text-neroBlack950 px-6 py-2 rounded-lg transition"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" /> Add to Cart
            </button>
            <button
              onClick={removeFavouriteHandler}
              className="flex items-center text-red-500 hover:text-red-600 transition"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </>
      
      
    );
  };
  
  export default FavItems;
  
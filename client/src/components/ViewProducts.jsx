import {
  UserCircleIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { itemContext } from "../util/itemContext";

const ViewProducts = ({ product }) => {
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
        <Link to={`/productDetails/${id}`}>
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${image}`}
            alt={productName}
            className="w-full h-56 object-cover"
          />
        </Link>
        <Link
          to={`/category/${category}`}
          className="mt-3 bg-richChocolate700 text-ivoryWhite text-xs p-2 rounded-lg hover:bg-richChocolate900 transition absolute right-2 top-1 tracking-wider"
        >
          {category}
        </Link>
        <div className="p-5">
          <h2 className="text-normal capitalize font-bold text-gray-800 tracking-wide">
            {shortProductName}
          </h2>
          <p className="text-gray-600 mt-1 text-xs tracking-normal align-baseline">
            {shortDescription}
          </p>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-baseline text-lg space-x-2">
              <span className="text-medium text-green-500 font-semibold">
                $
              </span>
              <span className="text-1xl italic text-richChocolate600 font-bold font-mono">
                {price}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <Link to={`userDetails/${userId}`} className="flex items-center">
            {profile ? (
              <>
                <div>
                  <img
                    src={`${import.meta.env.VITE_IMAGES_URL}/${profile}`}
                    alt={productName}
                    className="w-10 h-10 rounded-full object-cover border-2 mr-1 border-gray-300"
                  />
                </div>
              </>
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-500" />
            )}

            <div className="ml-1">
              <p className="text-sm font-semibold text-gray-800 tracking-wide capitalize">
                {name}
              </p>
              <p className="text-xs text-gray-500 tracking-wider">{date}</p>
            </div>
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={addToCartHandler}
              className="text-richChocolate600 hover:text-richChocolate700 transition"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
            <button className="text-red-500 hover:text-red-700 transition">
              <HeartIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProducts;

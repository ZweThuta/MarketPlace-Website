import {
  UserCircleIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const ViewProducts = ({ product }) => {
  const {
    id,
    userId,
    name,
    productName,
    description,
    image,
    price,
    quality,
    category,
    date,
  } = product;

  const shortProductName =
    productName.length > 30 ? productName.substr(0, 30) + "..." : productName;
  const shortDescription =
    description.length > 80 ? description.substr(0, 80) + "..." : description;
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
        <button className="mt-3 bg-richChocolate700 text-ivoryWhite text-sm  p-2 rounded-lg hover:bg-richChocolate900 transition absolute right-3 top-1 tracking-wider">
          {category}
        </button>
        <div className="p-5">
          <h2 className="text-normal font-bold text-gray-800 tracking-wide">
            {shortProductName}
          </h2>
          <p className="text-gray-600 mt-1 text-xs tracking-normal align-baseline">
            {shortDescription}
          </p>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-1xl text-gray-500 line-through font-mono">
                {parseInt(price)} Ks
              </span>
              <span className="text-1xl italic text-richChocolate600 font-bold font-mono">
                {Math.round(parseInt(price) * 0.7)} Ks
              </span>
              <span className="text-sm text-green-500 font-semibold">
                30% Off!
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <Link to={`userDetails/${userId}`} className="flex items-center">
            <UserCircleIcon className="h-9 w-9 text-gray-500" />
            <div className="ml-1">
              <p className="text-sm font-semibold text-gray-800 tracking-wide capitalize">
                {name}
              </p>
              <p className="text-xs text-gray-500 tracking-wider">{date}</p>
            </div>
          </Link>
          <div className="flex space-x-2">
            <button className="text-richChocolate600 hover:text-richChocolate700 transition">
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

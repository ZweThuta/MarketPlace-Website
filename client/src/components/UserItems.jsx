import {
  CalendarDateRangeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const UserItems = ({ product }) => {
  const {
    id,
    productName,
    description,
    image,
    secondImage,
    thirdImage,
    fourthImage,
    price,
    quality,
    quantity,
    category,
    date,
  } = product;

  const shortProductName =
    productName.length > 100 ? productName.substr(0, 100) + "..." : productName;
  const shortDescription =
    description.length > 150 ? description.substr(0, 150) + "..." : description;

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden transition-transform transform hover:shadow-2xl hover:scale-105">
        <Link
          to={`/userProductDetail/${id}`}
          className="w-full md:w-1/3 h-auto mt-1"
        >
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${image}`}
            alt={productName}
            className="w-full h-52 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none transition-transform transform hover:scale-105"
          />
          <div className="flex flex-row gap-1 pr-1 pt-1">
            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${secondImage}`}
              alt={productName}
              className="w-1/3 object-cover rounded-lg transition-transform transform hover:scale-105"
            />
            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${thirdImage}`}
              alt={productName}
              className="w-1/3 object-cover rounded-lg transition-transform transform hover:scale-105"
            />
            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${fourthImage}`}
              alt={productName}
              className="w-1/3 object-cover rounded-lg transition-transform transform hover:scale-105"
            />
          </div>
        </Link>
        <div className="w-full p-6 bg-white  rounded-lg  transition duration-300 relative">
          {/* Product Name */}
          <h1 className="text-xl font-bold mt-2 mb-3 text-gray-800">
            {shortProductName}
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {shortDescription}
          </p>

          {/* Category Button */}
          <button className="bg-blue-100 text-blue-700 text-sm font-medium py-1 px-4 rounded-md hover:bg-blue-200  top-4 left-4">
            {category}
          </button>

        
      

          {/* Price and Date */}
          <div className="flex justify-between items-center mt-5">
          <div className="mb-10">
            <span className="text-xl text-gray-500 line-through mr-3">
              {parseInt(price)} Ks
            </span>
            <span className="text-2xl font-semibold italic text-red-500">
              {Math.round(parseInt(price) * 0.7)} Ks
            </span>
           
          </div>
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDateRangeIcon width={20} />
              <p className="text-sm">{date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItems;

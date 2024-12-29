import {
  CalendarDateRangeIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import moment from "moment";

const UserItems = ({ product }) => {
  const {
    id,
    productName,
    description,
    image,
    price,
    quality,
    category,
    date,
  } = product;

  const shortProductName =
    productName.length > 100 ? productName.substr(0, 100) + "..." : productName;
  const shortDescription =
    description.length > 150 ? description.substr(0, 150) + "..." : description;

    console.log(product);
    
  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:shadow-2xl hover:scale-[1.03] border border-gray-200">
        <Link
          to={`/userProductDetail/${id}`}
          className="w-full md:w-1/3 h-64 md:h-auto"
        >
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${image}`}
            alt={productName}
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none transition-transform transform hover:scale-105"
          />
        </Link>

        <div className="w-full p-8 bg-white flex flex-col justify-between relative">
          <h1 className="text-2xl capitalize font-extrabold mb-4 text-gray-900 leading-tight">
            {shortProductName}
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {shortDescription}
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <span className="bg-neroBlack500 text-customWhite text-sm font-semibold py-1 px-6 rounded-md">
              {category}
            </span>
           
            <div className="flex items-center gap-1 text-gray-500">
              <CalendarDateRangeIcon width={20} />
              <p className="text-sm">{moment(date).fromNow()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItems;

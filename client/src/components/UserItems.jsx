import { CalendarDateRangeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

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
        <Link to={`/userProductDetail/${id}`} className="w-full md:w-1/4 h-auto mt-1">
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
        <div className="w-full p-4">
         
          <h1 className="text-xl font-semibold mt-2">{shortProductName}</h1>
          <p className="text-sm text-gray-700 mt-1">{shortDescription}</p>
          <button className="mt-2 bg-gray-200 text-gray-800 text-base font-semibold py-1 px-4 rounded-md hover:bg-gray-300 transition absolute right-5">
            {category}
          </button>
          <p className="mt-2 text-lg font-medium text-green-600">{quality}</p>
          <p className="mt-1 text-gray-500">Quantity: {quantity}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-lg font-semibold text-gray-800">{price} Ks</p>
            <div className='flex items-center gap-1 text-gray-600'>
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
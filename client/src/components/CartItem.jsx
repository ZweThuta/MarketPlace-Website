import { useContext } from "react";
import { itemContext } from "../util/itemContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  XCircleIcon as XMarkIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const CartItem = ({ product }) => {
  const { id, productName, image, price, amount, quantity } = product;

  const { addItem, removeItem, removeOneItem } = useContext(itemContext);

  const addAmountHandler = () => {
    if (amount < quantity) {
      addItem({ ...product, amount: 1 });
    } else {
      toast.error(`Maximum quantity of ${quantity} reached.`);
    }
  };

  const removeAmountHandler = () => {
    removeOneItem(id);
  };

  const removeHandler = () => {
    removeItem(id);
    toast.success("Item removed from cart.");
  }

  return (
    <div className="relative flex flex-row md:flex-row items-center justify-between p-6 bg-white shadow-md rounded-lg mb-4">
      <button
        onClick={removeHandler}
        className="absolute top-2 left-2 text-red-500 hover:text-red-700"
      >
        <XMarkIcon className="h-7 w-7" />
      </button>
      <div className="flex items-center w-full md:w-2/3 p-4 rounded-lg">
        <Link to={`/productDetails/${id}`}>
          <img
            src={`${import.meta.env.VITE_IMAGES_URL}/${image}`}
            alt={productName}
            className="w-32 h-32 object-cover rounded-lg shadow-lg"
          />
        </Link>
        <div className="ml-6">
          <h1 className="text-lg font-semibold uppercase text-gray-900">{productName}</h1>
          <span className="text-gray-600 text-lg">${price}</span>
          <div className="mt-3">
            <span className="text-gray-500">Quantity: {amount} / {quantity}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <button
          onClick={addAmountHandler}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
        >
          +
        </button>
        <button
          onClick={removeAmountHandler}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default CartItem;
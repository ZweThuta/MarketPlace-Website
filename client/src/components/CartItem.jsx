import { useContext } from "react";
import { itemContext } from "../util/itemContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartItem = ({ product }) => {
  const { id, productName, image, price, amount, quantity } = product;

  const { addItem, removeItem } = useContext(itemContext);

  const addAmountHandler = () => {
    if (amount < quantity) {
      addItem({ ...product, amount: 1 });
    } else {
      toast.error(`Maximum quantity of ${quantity} reached.`);
    }
  };

  const removeAmountHandler = () => {
    removeItem(id);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <img
          src={`${import.meta.env.VITE_IMAGES_URL}/${image}`}
          alt={productName}
          className="w-24 h-24 object-cover rounded-md shadow-md"
        />
        <div className="ml-4">
          <h1 className="text-lg font-semibold text-gray-800">{productName}</h1>
          <span className="text-gray-600">${price}</span>
          <div className="mt-2">
            <span className="text-gray-600">Quantity: {amount} / {quantity}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={addAmountHandler}
          className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition duration-200"
        >
          +
        </button>
        <button
          onClick={removeAmountHandler}
          className="bg-red-600 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition duration-200"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default CartItem;
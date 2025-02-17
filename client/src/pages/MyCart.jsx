import React, { useContext } from "react";
import { itemContext } from "../util/itemContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import pic from "../logo/Nothing.gif";

const MyCart = () => {
  const { items, totalAmount } = useContext(itemContext);
  const totalPrice = `$${totalAmount.toFixed(2)}`;
  const tax = totalAmount * 0.05;
  const finalTotalPrice = totalAmount + tax;

  return (
    <>
      <section className="container mx-auto p-6 h-full">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-extrabold tracking-wide text-gray-900 mb-3">
            My Cart
          </h1>
          <span className="text-lg text-gray-500">
            {items.length === 0
              ? "Your cart is empty."
              : `You have ${items.length} item${
                  items.length > 1 ? "s" : ""
                } in your cart.`}
          </span>
          {!items.length > 0 && (
            <>
              <div className="flex justify-center mt-6">
                <img src={pic} alt="pic" className="w-64 h-64 object-cover" />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-auto">
          <div className="lg:col-span-2">
            {items.length > 0 && (
              <div>
                {items.map((product) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-white shadow-lg rounded-lg max-h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-gray-700">Subtotal</span>
                <span className="text-lg font-semibold">{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-gray-700">Tax (5%)</span>
                <span className="text-lg font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-xl font-extrabold">
                  ${finalTotalPrice.toFixed(2)}
                </span>
              </div>
              <Link to="/checkout">
                <button className="w-full mt-6 py-3 bg-neroBlack950 capitalize tracking-wider text-white text-lg font-semibold rounded hover:bg-customWhite hover:border-neroBlack950 hover:border hover:text-neroBlack950 transition duration-200">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyCart;

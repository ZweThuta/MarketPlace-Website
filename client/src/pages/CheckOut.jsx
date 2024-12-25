import React, { useContext, useState } from "react";
import { itemContext } from "../util/itemContext";
import { toast } from "react-toastify";

const CheckOut = () => {
  const { items, totalAmount } = useContext(itemContext);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  const deliveryFees = {
    standard: 5.0,
    express: 16.0,
  };

  const tax = totalAmount * 0.05;
  const deliveryFee = deliveryFees[deliveryMethod];
  const finalTotalPrice = totalAmount + tax + deliveryFee;

  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    note: "",
    totalprice: finalTotalPrice,
    productId: items.map((item) => item.id),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Placed:", formData);
    toast.success("Thank you for your order!");
  };

  const clearHandler = () => {
    setFormData({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        country: "",
        phno: "",
        note: "",
        totalprice: finalTotalPrice,
    });
};

  return (
    <section className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
    
    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 uppercase tracking-wider text-gray-800">Billing Details</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-1xl capitalize text-gray-400 font-semibold">Contact Information</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-3 font-bold text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label className="block mb-3 text-gray-700 font-bold">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
            </div>
            <div>
                <label className="block mb-3 text-gray-700 font-bold">Phone Number</label>
                <input
                    type="text"
                    name="phno"
                    value={formData.phno}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>
            <hr />
            <div>
            <h1 className="text-1xl capitalize text-gray-400 font-semibold mb-6">Shipping Information</h1>
                <label className="block mb-3 text-gray-700 font-bold">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your address"
                    className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block mb-3 text-gray-700 font-bold">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your city"
                        className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label className="block mb-3 text-gray-700 font-bold">Zip Code</label>
                    <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your zip code"
                        className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label className="block mb-3 text-gray-700 font-bold">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your country"
                        className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
            </div>
            <hr />
            <div className="mt-6">
                <h3 className="text-1xl capitalize text-gray-400 font-semibold mb-4">Delivery method</h3>
                <div className="flex gap-6">
                    <div
                        className={`p-5 border rounded-lg w-1/2 cursor-pointer ${
                            deliveryMethod === "standard"
                                ? "border-blue-500 ring-1 ring-blue-500"
                                : "border-gray-300"
                        }`}
                        onClick={() => handleDeliveryChange("standard")}
                    >
                        <h4 className="font-medium">Standard</h4>
                        <p className="text-gray-500">4-10 business days</p>
                        <p className="mt-2 font-semibold">${deliveryFees.standard.toFixed(2)}</p>
                    </div>

                    <div
                        className={`p-5 border rounded-lg w-1/2 cursor-pointer ${
                            deliveryMethod === "express"
                                ? "border-blue-500 ring-1 ring-blue-500"
                                : "border-gray-300"
                        }`}
                        onClick={() => handleDeliveryChange("express")}
                    >
                        <h4 className="font-medium">Express</h4>
                        <p className="text-gray-500">2-5 business days</p>
                        <p className="mt-2 font-semibold">${deliveryFees.express.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <hr />
            <div>
            <h1 className="text-1xl capitalize text-gray-400 font-semibold mb-6">Additional Information</h1>

                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    required
                    placeholder="Add a note to your order (optional)"
                    className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>
            <div className="flex justify-between mt-6">
                <button
                    type="submit"
                    className="w-2/3 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-semibold"
                >
                    Place Order
                </button>
                <button
                    type="reset"
                    onClick={clearHandler}
                    className="w-2/3 bg-gray-400 text-white py-4 rounded-lg hover:bg-gray-500 font-semibold"
                >
                    Clear
                </button>
            </div>
        </form>
    </div>
      <div className="bg-white h-fit p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Your Order
        </h1>
        <div className="space-y-6 divide-y divide-gray-300">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
                  alt={product.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h2 className="font-medium text-gray-700">
                    {product.productName}
                  </h2>
                  <p className="text-sm text-gray-500">x{product.amount}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                ${(product.price * product.amount).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Order Total */}
          <div className="mt-10">
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>Tax (5%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-2xl font-bold">
              <span>Total:</span>
              <span>${finalTotalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;

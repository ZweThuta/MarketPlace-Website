import React, { useContext, useEffect, useState } from "react";
import { itemContext } from "../util/itemContext";
import { toast } from "react-toastify";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import googlePay from "../logo/google-pay.png";

const CheckOut = () => {
  const navigation = useNavigate();
  const navigate = useNavigate();
  const { items, totalAmount } = useContext(itemContext);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [orders, setOrders] = useState([]);

  const deliveryFees = {
    standard: 5.0,
    express: 16.0,
  };

  const discount = totalAmount * 0.1;
  const tax = totalAmount * 0.05;
  const deliveryFee = deliveryFees[deliveryMethod];
  const finalTotalPrice =
    orders.length === 0
      ? totalAmount + tax + deliveryFee - discount
      : totalAmount + tax + deliveryFee;

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      setFormData((prev) => ({ ...prev, userId: currentUserId }));
    }
    fetchOrder();
  }, [currentUserId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      delivery: deliveryMethod,
      totalprice: finalTotalPrice,
    }));
  }, [deliveryMethod, totalAmount]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found.");

      const userResponse = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.data?.data?.id) {
        setCurrentUserId(userResponse.data.data.id);
      } else {
        throw new Error("Failed to fetch user ID.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DISCOUNT_URL}?userId=${currentUserId}`
      );
      if (response.data?.data?.length) {
        setOrders(response.data.data);
      } else {
        console.log("No orders found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
    userId: "",
    delivery: deliveryMethod,
    quantity: items.map((item) => item.amount),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.phno) newErrors.phno = "Phone number is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.zip) newErrors.zip = "Zip code is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = axios.post(import.meta.env.VITE_ORDER_URL, formData);
      if (response.status === 0) {
        setErrors({ message: response.data.message });
      } else {
        toast.success("Thank you for your order!");
        navigate("/billingReceipt");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
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
    });
  };

  return (
    <section className="max-w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
        {orders.length === 0 && (
          <div className="mb-10  mt-4">
            <span className="text-green-500 text-xl  font-semibold">
              🎉 Dear customer, enjoy an exclusive 10% discount on your first
              purchase!
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold mb-6 uppercase tracking-wider text-gray-800">
            Billing Details
          </h1>
          <Link
            className="flex items-center gap-2 text-gray-700 cursor-pointer"
            to={"/addToCart"}
          >
            <ArrowUturnLeftIcon className="h-6 w-6 inline-block" />
            <span className="capitalize tracking-wide">Back to cart</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-1xl capitalize text-gray-400 font-semibold">
            Contact Information
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-3 font-bold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full text-sm px-4 py-3 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              />
              {errors.name && (
                <p className="text-red-500 m-3 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block mb-3 text-gray-700 font-bold">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full text-sm px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              />
              {errors.email && (
                <p className="text-red-500 m-3 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-3 text-gray-700 font-bold">
              Phone Number
            </label>
            <input
              type="text"
              name="phno"
              value={formData.phno}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full text-sm px-4 py-3 rounded-lg border ${
                errors.phno ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            />
            {errors.phno && (
              <p className="text-red-500 m-3 text-sm">{errors.phno}</p>
            )}
          </div>
          <hr />
          <div>
            <h1 className="text-1xl capitalize text-gray-400 font-semibold mb-6">
              Shipping Information
            </h1>
            <label className="block mb-3 text-gray-700 font-bold">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className={`w-full text-sm px-4 py-3 rounded-lg border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            />
            {errors.address && (
              <p className="text-red-500 m-3 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-3 text-gray-700 font-bold">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                className={`w-full text-sm px-4 py-3 rounded-lg border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              />
              {errors.city && (
                <p className="text-red-500 m-3 text-sm">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block mb-3 text-gray-700 font-bold">
                Zip Code
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="Enter your zip code"
                className={`w-full text-sm px-4 py-3 rounded-lg border ${
                  errors.zip ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              />
              {errors.zip && (
                <p className="text-red-500 m-3 text-sm">{errors.zip}</p>
              )}
            </div>
            <div>
              <label className="block mb-3 text-gray-700 font-bold">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter your country"
                className={`w-full text-sm px-4 py-3 rounded-lg border ${
                  errors.country ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              />
              {errors.country && (
                <p className="text-red-500 m-3 text-sm">{errors.country}</p>
              )}
            </div>
          </div>
          <hr />
          <div className="mt-6">
            <h3 className="text-1xl capitalize text-gray-400 font-semibold mb-4">
              Delivery method
            </h3>
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
                <p className="mt-2 font-semibold">
                  ${deliveryFees.standard.toFixed(2)}
                </p>
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
                <p className="mt-2 font-semibold">
                  ${deliveryFees.express.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <hr />

          <div>
            <div>
              <h1 className="text-1xl capitalize text-gray-400 font-semibold mb-6">
                Payment Method
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Credit/Debit Card */}
              <label
                className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition duration-300 bg-gray-50"
                htmlFor="creditCard"
              >
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  className="mr-4 accent-blue-500"
                />
                <div className="flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="w-10 h-4 mr-2"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="Mastercard"
                    className="w-10 h-6"
                  />
                </div>
                <span className="ml-4 font-medium text-gray-700">
                  Credit/Debit Card
                </span>
              </label>

              {/* PayPal */}
              <label
                className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition duration-300 bg-gray-50"
                htmlFor="paypal"
              >
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  className="mr-4 accent-blue-500"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/256px-PayPal.svg.png"
                  alt="PayPal"
                  className="w-20 h-6"
                />
                <span className="ml-4 font-medium text-gray-700">PayPal</span>
              </label>

              {/* Google Pay */}
              <label
                className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition duration-300 bg-gray-50"
                htmlFor="googlePay"
              >
                <input
                  type="radio"
                  id="googlePay"
                  name="paymentMethod"
                  value="googlePay"
                  className="mr-4 accent-blue-500"
                />
                <img src={googlePay} alt="Google Pay" className="w-10 h-10" />
                <span className="ml-4 font-medium text-gray-700">
                  Google Pay
                </span>
              </label>

              {/* Cash on Delivery */}
              <label
                className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition duration-300 bg-gray-50"
                htmlFor="cashOnDelivery"
              >
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  className="mr-4 accent-blue-500"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2642/2642729.png"
                  alt="Cash"
                  className="w-8 h-8"
                />
                <span className="ml-4 font-medium text-gray-700">
                  Cash on Delivery
                </span>
              </label>
            </div>
          </div>
          <hr className="mb-6" />

          <div>
            <h1 className="text-1xl capitalize text-gray-400 font-semibold mb-6">
              Additional Information
            </h1>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Add a note to your order (optional)"
              className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-between mt-6 gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-3/4 tracking-wider py-4 rounded-lg font-semibold  bg-neroBlack950 text-white hover:bg-customWhite hover:border-neroBlack950 hover:border hover:text-neroBlack950"
            >
              {isSubmitting
                ? "Submitting..."
                : `Place Order ($${finalTotalPrice.toFixed(2)})`}
            </button>
            <button
              type="reset"
              onClick={clearHandler}
              className="w-1/4 tracking-wider bg-gray-400 text-white py-4 rounded-lg hover:bg-gray-500 font-semibold"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white h-fit p-8 rounded-lg shadow-lg">
        <h1 className="text-xl text-center tracking-wider uppercase font-semibold mb-6 text-gray-800">
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
            <div className="flex justify-between mb-2 mt-5">
              <span className="text-medium tracking-wide">Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-medium tracking-wide">Tax (5%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-medium tracking-wide">Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            {orders.length === 0 && (
              <div className="flex justify-between mb-2 text-green-500 font-semibold">
                <span className="text-medium tracking-wide  ">
                  Discount (10%):
                </span>
                <span>${discount.toFixed(2)}</span>
              </div>
            )}
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

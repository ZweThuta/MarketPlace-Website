import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

import {
  ShoppingCartIcon,
  HeartIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon,
  ReceiptRefundIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

import {
  UserCircleIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

import RatingStars from "../components/RatingStars";
import { itemContext } from "../util/itemContext";
import ReviewsForm from "../components/ReviewsForm";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
const ProductDetails = () => {
  const { productId } = useParams();
  const [showAll, setShowAll] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const navigate = useNavigate();
  const { addItem } = useContext(itemContext);
  const [currentAmount, setCurrentAmount] = useState(1);
  const currentAmountNumber = +currentAmount;

  const addToCartHandler = () => {
    addItem({
      id: product.id,
      productName: product.productName,
      price: product.price,
      image: product.image,
      quantity: product.quantity,
      amount: currentAmountNumber,
    });
  };

  const addToFavouriteHandler = async () => {
    try {
      const payload = {
        userId: currentUserId,
        productId: productId,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_FAVOURITE_URL}`,
        payload
      );
      if (response.data?.status === 1) {
        toast.success("Added to Favourites!");
      } else {
        toast.error("Already added to Favourites!");
      }
    } catch (error) {
      console.error("Error adding to Favourites:", error);
      toast.error("Failed to add to Favourites!");
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_USER_PRODUCT_DETAILS,
          {
            params: { productId },
          }
        );

        if (response.data.status === 1) {
          setProduct(response.data.data);
          setMainImage(response.data.data.image);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center justify-center mt-20">
          <Spinner className="h-16 w-16 text-center text-gray-500/50" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-5 md:p-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 text-medium  transition mb-5"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 overflow-hidden">
          {/* Image Section */}
          <div className="flex flex-col justify-start">
            {/* Main Image */}
            <div className="relative w-full h-[500px]">
              <img
                src={`${import.meta.env.VITE_IMAGES_URL}/${mainImage}`}
                alt={product.productName}
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transition-transform transform"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex justify-between mt-4 space-x-3">
              {[
                product.secondImage,
                product.thirdImage,
                product.fourthImage,
                product.image,
              ].map((img, index) => (
                <div key={index} className="flex-1">
                  <img
                    src={`${import.meta.env.VITE_IMAGES_URL}/${img}`}
                    alt={`${product.productName} - ${index + 2}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer transition-transform transform "
                    onClick={() => handleThumbnailClick(img)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-4 flex flex-col">
            <h1 className="text-3xl font-bold capitalize text-gray-800 mb-1 tracking-wide">
              {product.productName}
            </h1>
            <span className="text-richChocolate600 mb-6 font-semibold text-medium tracking-wide">
              {product.category}
            </span>
            <div className="mb-4">
              <RatingStars productId={productId} isHomePage={false} />
            </div>
            <div className="mb-10">
              <span className="text-3xl font-semibold italic text-red-500">
                ${product.price}
              </span>
            </div>

            <span className="text-medium text-gray-500 underline capitalize mb-2">
              About this item
            </span>

            <div className="text-gray-600 text-medium capitalize text-justify mb-5">
              {showAll
                ? product.description
                : `${product.description.slice(0, 300)}...`}

              {product.description.length > 300 && (
                <div className="mt-2 flex">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className=" text-black rounded-lg underline flex items-center"
                  >
                    {showAll ? (
                      <>
                        <ChevronUpIcon className="h-5 w-5 inline-block mr-2" />
                        Fold Back
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="h-5 w-5 inline-block mr-2" />
                        Read More
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-1 mb-2">
              <span className="text-1xl font-semibold">Product Brand:</span>
              <span className="text-1xl text-green-500 font-semibold">
                {product.quality}
              </span>
            </div>
            <div className="flex gap-1 mb-10">
              <span className="text-1xl font-semibold">Quantity:</span>
              <span className="text-1xl text-yellow-500 font-semibold">
                {product.quantity}
              </span>
              <span className="text-1xl font-normal">in stock</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4  p-4 rounded-lg mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Secure Transaction
                  </p>
                  <p className="text-xs text-gray-500">
                    Your data is protected
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <TruckIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Delivery Available
                  </p>
                  <p className="text-xs text-gray-500">
                    Fast and reliable service
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <ReceiptRefundIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Returns Policy
                  </p>
                  <p className="text-xs text-gray-500">Hassle-free returns</p>
                </div>
              </div>
            </div>

            {localStorage.getItem("authToken") &&
              currentUserId !== product.userId && (
                <div className="flex space-x-4">
                  <input
                    type="number"
                    min={1}
                    max={product.quantity}
                    value={currentAmount}
                    onChange={(e) => {
                      setCurrentAmount(e.target.value);
                    }}
                    className="p-1 text-lg text-center rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  <button
                    onClick={addToCartHandler}
                    className="flex-1 py-2 rounded-lg shadow-md  bg-neroBlack950 text-white hover:bg-customWhite hover:border-neroBlack950 hover:border hover:text-neroBlack950 transition"
                  >
                    <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
                    Add to Bag
                  </button>
                  <button
                    onClick={addToFavouriteHandler}
                    className="flex items-center justify-center w-14 h-14 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                  >
                    <HeartIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            {currentUserId === product.userId && (
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md flex items-center space-x-3">
                <InformationCircleIcon className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">
                    You are the owner of this product.
                  </p>
                  <p className="text-xs">
                    Manage or Edit item from your profile.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="mt-5 border-t-3 border-grey" />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl mx-auto mt-10">
      <h1 className="mb-10 uppercase   font-semibold text-lg tracking-wide text-gray-400">
         Seller Information
        </h1>
        <div className="flex items-center space-x-4 mb-6">
          <Link to={`/userDetail/${product.userId}`}>
          {product.profile ? (
            <img
              src={`${import.meta.env.VITE_IMAGES_URL}/${product.profile}`}
              alt={product.name}
              className="w-20 h-20 rounded-full border-2 border-neroBlack950 shadow-md object-cover"
            />
          ) : (
            <UserCircleIcon className="w-20 h-20 text-gray-400 border-4 border-gray-200 rounded-full" />
          )}
         </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.email}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 space-y-4">
          {product.address && (
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-5 h-5 text-neroBlack500" />
              <span className="text-gray-700">{product.address}</span>
            </div>
          )}

          {product.phno && (
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-neroBlack500" />
              <span className="text-gray-700">{product.phno}</span>
            </div>
          )}

          {product.city && (
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="w-5 h-5 text-neroBlack500" />
              <span className="text-gray-700">{product.city}</span>
            </div>
          )}
        </div>

      </div>
      <hr className="mt-5 border-t-3 border-grey" />

      <ReviewsForm product={product} />
      <RelatedProducts productId={productId} />
    </>
  );
};

export default ProductDetails;

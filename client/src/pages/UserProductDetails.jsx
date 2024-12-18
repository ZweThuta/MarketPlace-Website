import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModel";
import { Spinner } from "@material-tailwind/react";

import {
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import RatingStars from "../components/RatingStars";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const navigate = useNavigate();

  const handleThumbnailClick = (image) => {
    setMainImage(image);
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

  const deleteProduct = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_USER_PRODUCT_DETAILS}?productId=${productId}`
      );

      if (response.data.status === 1) {
        // alert("Product deleted successfully!");
        navigate("/userProduct");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    deleteProduct();
  };

  if (!product) {
    return (
       <div className="flex items-center justify-center mt-20">
                <Spinner className="h-16 w-16 text-center text-gray-500/50" />
        </div>
    );
  }

  return (
    <section className="p-6 bg-gray-50">
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
                product.image
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

          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmDelete}
            message={`Are you sure you want to remove the product "${product.productName}" in the store?`}
          />

          {/* Product Details Section */}
          <div className="p-4 flex flex-col">
            <h1 className="text-3xl font-bold capitalize text-gray-800 mb-1 tracking-wide">
              {product.productName}
            </h1>
            <span className="text-richChocolate600 mb-6 font-semibold text-medium tracking-wide">
              {product.category}
            </span>
            <div className="mb-4">
              <RatingStars />
            </div>
            <div className="mb-10">
              
              <span className="text-3xl font-semibold italic text-red-500">
                ${product.price}
              </span>
             
            </div>

            <span className="text-medium text-gray-500 underline capitalize mb-2">
              About this item
            </span>
            <span className="text-gray-600 capitalize text-medium text-justify mb-5">
              {product.description}
            </span>

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

            <div className="flex flex-col md:flex-row gap-4  p-4 rounded-lg mb-10">
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

            <div className="flex space-x-4">
              <Link
                to={`/editProduct/${productId}`}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105"
                aria-label="Edit Item"
              >
                <PencilSquareIcon className="h-5 w-5 inline-block mr-2" />
                Edit Item
              </Link>

              <button
                className="flex-2 bg-red-600 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                onClick={() => setIsModalOpen(true)}
                aria-label="Remove Item"
              >
                <TrashIcon className="h-5 w-5 inline-block mr-2" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

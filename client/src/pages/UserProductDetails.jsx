import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModel";  

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_USER_PRODUCT_DETAILS, {
          params: { productId },
        });

        if (response.data.status === 1) {
          setProduct(response.data.data);
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
    return <p className="text-center mt-10 text-gray-600">Loading product details...</p>;
  }

  return (
    <section className="p-6 bg-gray-50">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the product "${product.productName}"?`}
      />
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
          alt={product.productName}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="mt-4 text-xl font-semibold">Price: {product.price} MMK</p>
          <p className="mt-2 text-gray-600">Category: {product.category}</p>
          <p className="mt-2 text-gray-600">Quality: {product.quality}</p>
          <p className="mt-2 text-gray-600">Quantity: {product.quantity}</p>
          <p className="mt-2 text-gray-600">
            Date Added: {new Date(product.date).toLocaleDateString()}
          </p>
          <div className="flex flex-row justify-end gap-4">
            <Link
              to={`/editProduct/${productId}`}
              className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-md hover:shadow-lg transition"
            >
              Edit
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}  
              className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md shadow-md hover:shadow-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

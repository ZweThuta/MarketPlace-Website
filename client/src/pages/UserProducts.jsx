import axios from "axios";
import { useState, useEffect } from "react";

const UserProducts = () => {
  const [userId, setUserId] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  const getUserId = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, user may not be logged in.");
        return;
      }

      const response = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 1 && response.data.data) {
        setUserId(response.data.data.id);
      } else {
        console.error("Failed to fetch user ID:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error.message);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_ADD_PRODUCT_URL}`, {
        params: { userId },
      });
      if (response.data.status === 1) {
        setProducts(response.data.data);
      } else {
        console.error("No products found.");
      }
    } catch (error) {
      console.error("Error fetching user products", error);
    }
  };
  

  return (
    <section className="p-6 bg-gray-100">
    <h2 className="text-3xl font-bold text-center mb-6">My Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl relative group" key={product.id}>
            <img src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`} alt={product.productName} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.productName}</h3>
              {/* <p className="text-gray-600 mb-2">{product.description}</p> */}
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-bold">Price: ${product.price}</p>
                <p className="text-gray-500 text-sm">Quality: {product.quality}</p>
              </div>
              <p className="text-gray-700">Category: {product.category}</p>
              <p className="text-gray-500 text-sm">Date Added: {new Date(product.date).toLocaleDateString()}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-0 transition-opacity duration-300 group-hover:opacity-30"></div>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  </section>
  );
};

export default UserProducts;

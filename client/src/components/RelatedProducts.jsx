import axios from "axios";
import React, { useEffect, useState } from "react";
import ViewProducts from "./ViewProducts";

const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [productId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
      if (response.data.status === 1) {
        const relatedProducts = response.data.data
          .filter((product) => product.id !== productId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setProducts(relatedProducts);
      } else {
        response.data.message;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <>
      <div className="p-10 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {products.length > 0 ? (
            products.map((product) => (
              <ViewProducts product={product} key={product.id} />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No product available!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;

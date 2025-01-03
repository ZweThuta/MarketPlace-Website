import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const CategoriesFilter = () => {
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const currentCategory = decodeURIComponent(location.pathname.split('/')[2] || 'All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_PRODUCTS_URL}`);
      const data = response.data.data;

      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <Link
          to="/products"
          className={`px-4 sm:px-6 py-1 sm:py-2 rounded shadow-md transition text-sm sm:text-base ${
            currentCategory === 'All' ? 'bg-black text-white' : 'bg-white text-black border border-black'
          }`}
        >
          All Collections
        </Link>

        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/category/${category}`}
            className={`px-4 sm:px-6 py-1 sm:py-2 rounded shadow-md transition text-sm sm:text-base ${
              currentCategory === category ? 'bg-black text-white' : 'bg-white text-black border border-black'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesFilter;

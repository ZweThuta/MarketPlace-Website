import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fashionIcon from "./categories/Fashion & Apparel.jpg";
import babyIcon from "./categories/Baby & Kids.jpg";
import beautyIcon from "./categories/Beauty & Personal Care.jpg";
import electroIcon from "./categories/Electronics.jpg";
import homeIcon from "./categories/Home & Living.jpg";
import sportIcon from "./categories/Sports & Outdoor.jpg";
import healthIcon from "./categories/Health & Wellness.jpg";
import travelIcon from "./categories/Travel & Luggage.jpg";
import bookIcon from "./categories/Books.jpg";

import { motion } from "framer-motion";

const CategoryCard = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_CATEGORY_URL);
      if (response.data.status === 1) {
        const categoryData = response.data.data;
        setCategories(categoryData);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const categoryIcons = {
    "Fashion & Apparel": (
      <img
        src={fashionIcon}
        alt="Fashion & Apparel"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    "Beauty & Care": (
      <img
        src={beautyIcon}
        alt="Beauty & Care"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    Electronics: (
      <img
        src={electroIcon}
        alt="Electronics"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    "Home & Living": (
      <img
        src={homeIcon}
        alt="Home & Living"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    "Health & Wellness": (
      <img
        src={healthIcon}
        alt="Health & Wellness"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    "Sports & Outdoor": (
      <img
        src={sportIcon}
        alt="Sports & Outdoor"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    "Baby & Kids": (
      <img
        src={babyIcon}
        alt="Baby & Kids"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    "Travel & Luggage": (
      <img
        src={travelIcon}
        alt="Travel & Luggage"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
    Books: (
      <img
        src={bookIcon}
        alt="Books"
        className="w-24 h-24 rounded-xl shadow-md"
      />
    ),
  };

  return (
    <>
      <motion.div
        className="w-full min-h-auto p-8 mb-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="mb-10 uppercase font-semibold text-2xl tracking-wider text-gray-800 text-center">
          Shop by Category
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/category/${category.category}`}
                className="flex flex-col items-center p-5 bg-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-200"
              >
                <div className="mb-4 flex justify-center items-center bg-gradient-to-r from-neroBlack950 to-customWhite rounded-2xl p-2">
                  {categoryIcons[category.category] || (
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-semibold text-gray-500">
                        ?
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-neroBlack950 text-center tracking-wider">
                  {category.category}
                </h2>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <hr className="border-t-2 mx-10 border-neutral-200" />
    </>
  );
};

export default CategoryCard;

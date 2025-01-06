import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import RatingStars from "../RatingStars";
import { motion } from "framer-motion";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowRightCircleIcon
      className={className}
      style={{
        ...style,
        display: "block",
        color: "gray",
        width: "2rem",
        height: "2rem",
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowLeftCircleIcon
      className={className}
      style={{
        ...style,
        display: "block",
        color: "gray",
        width: "2rem",
        height: "2rem",
      }}
      onClick={onClick}
    />
  );
};

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
      if (response.data.status === 1) {
        const limitedProducts = response.data.data
        .filter((product) => {
            const productDate = new Date(product.date);
            const currentDate = new Date();
            const timeDifference = currentDate - productDate;
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            return daysDifference <= 7 && product.quantity >= 2; 
          })
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        setProducts(limitedProducts);

      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-8 py-10 mb-10">
      <h1 className="mb-10 uppercase font-semibold text-2xl tracking-wider text-gray-800 ml-10">
        New Arrivals
      </h1>
      <Slider {...settings}>
        {products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product.id}
              className="px-4 mb-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-2 relative">
                <Link to={`/productDetails/${product.id}`}>
                  <img
                    src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
                    alt={product.productName}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-neroBlack950">
                    {product.productName.length > 15
                      ? product.productName.substr(0, 15) + "..."
                      : product.productName}
                  </h3>
                  <div className="flex space-x-3 items-center justify-center">
                    <p className="text-red-400 text-xl font-semibold mt-2">
                      ${product.price}
                    </p>
                    <div className="mt-2">
                      <RatingStars
                        productId={product.id}
                        isHomepage={true}
                        width={10}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/category/${product.category}`}
                    className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-sm px-4 py-1 rounded-full capitalize"
                  >
                    {product.category}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No product available!
          </p>
        )}
      </Slider>
    </div>
  );
};

export default NewArrivals;

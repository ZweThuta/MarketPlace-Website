import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import banner1 from "./banners/Banner4.jpg";
import banner2 from "./banners/Banner2.jpg"
import banner3 from "./banners/Banner3.jpg";

const banners = [
  {
    image: banner1,
    title: "Unlock Unique Finds",
    description: "Discover one-of-a-kind products crafted by talented local sellers.",
    link: "/products",
    buttonText: "Explore Now",
  },
  {
    image: banner2,
    title: "Start Your Business Journey",
    description: "Turn your passion into profit. Join TrendHaven and reach thousands of buyers today!",
    link: "/register",
    buttonText: "Get Started",
  },
  {
    image: banner3,
    title: "Exclusive Deals Await",
    description: "Limited-time offers on the latest and trendiest products. Grab yours before it's gone!",
    link: "/products",
    buttonText: "Shop Deals",
  },
];

const HomeBanner = () => {
  return (
    <div className="w-full h-[400px] relative overflow-hidden">
      <div className="flex animate-bannerScroll">
        {banners.map((banner, index) => (
          <motion.div
            key={index}
            className="relative w-full min-w-full h-[500px] "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col items-center justify-center text-white p-6">
              <h1
                className="text-5xl font-extrabold mb-4 text-center tracking-wide uppercase leading-tight"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {banner.title}
              </h1>
              <p className="text-lg mb-8 text-center max-w-5xl bg-black/20 p-4 rounded-lg">
                {banner.description}
              </p>
              <Link
                to={banner.link}
                className="px-8 py-3 bg-white text-black text-lg font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                {banner.buttonText}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <style>
        {`
          .animate-bannerScroll {
            animation: scrollBanner 60s linear infinite;
          }
          
          @keyframes scrollBanner {
            0% { transform: translateX(0%); }
            33% { transform: translateX(-100%); }
            66% { transform: translateX(-200%); }
            100% { transform: translateX(0%); }
          }
        `}
      </style>
    </div>
  );
};

export default HomeBanner;

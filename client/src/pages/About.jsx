import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import photo from "../logo/About.jpg";

const About = () => {
  return (
    <div className="min-h-screen  text-neroBlack950 flex items-center justify-center">
      <div className="containe mx-auto px-6 lg:px-20 py-12 bg-customWhite2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold uppercase tracking-widest text-neroBlack900">
            About TrendHaven
          </h1>
          <p className="text-neroBlack500 mt-4 text-lg max-w-3xl mx-auto">
            Welcome to TrendHaven, the premier online marketplace where users
            can buy, sell, and explore unique products. We empower small
            businesses and individuals by providing an intuitive and engaging
            platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.img
            src={photo}
            alt="Marketplace"
            className="rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-neroBlack900">
              Our Mission
            </h2>
            <p className="text-neroBlack500">
              At TrendHaven, we strive to connect buyers and sellers seamlessly,
              fostering a community driven by innovation and creativity. Whether
              you are a buyer looking for unique products or a seller aiming to
              reach a broader audience, TrendHaven is your go-to destination.
            </p>
            </div>
            <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-neroBlack900">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside text-neroBlack500 space-y-2">
              <li>Easy and secure account creation</li>
              <li>Wide range of categories and products</li>
              <li>Intuitive and user-friendly design</li>
              <li>Support for small businesses and independent sellers</li>
            </ul>
            </div>

            {localStorage.getItem("authToken") ? (
              <>
                <Link
                  to="/products"
                  className="inline-block mt-6 uppercase bg-neroBlack900 hover:bg-neroBlack500 transition duration-300 text-customWhite px-6 py-3 rounded-lg font-medium"
                >
                    Explore Products
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-block mt-6 uppercase bg-neroBlack900 hover:bg-neroBlack500 transition duration-300 text-customWhite px-6 py-3 rounded-lg font-medium"
                >
                  Create an Account
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;

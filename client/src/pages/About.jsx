import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import photo from "../logo/About.jpg";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-neroBlack950 flex items-center justify-center">
      <div className="container mx-auto px-6 lg:px-20 py-12 bg-customWhite2 shadow-lg rounded-lg">
        {/* Header Section */}
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

        {/* Main Content Section */}
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
                At TrendHaven, we strive to connect buyers and sellers
                seamlessly, fostering a community driven by innovation and
                creativity. Whether you are a buyer looking for unique products
                or a seller aiming to reach a broader audience, TrendHaven is
                your go-to destination.
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
              <Link
                to="/products"
                className="inline-block mt-6 uppercase bg-neroBlack900 hover:bg-neroBlack500 transition duration-300 text-customWhite px-6 py-3 rounded-lg font-medium"
              >
                Explore Products
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block mt-6 uppercase bg-neroBlack900 hover:bg-neroBlack500 transition duration-300 text-customWhite px-6 py-3 rounded-lg font-medium"
              >
                Create an Account
              </Link>
            )}
          </motion.div>
        </div>

        {/* Contact Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-16 text-center"
        >
          <h2 className="text-4xl font-bold text-neroBlack900 mb-6">
            Contact Us
          </h2>
          <p className="text-neroBlack500 text-lg max-w-2xl mx-auto mb-8">
            We would love to hear from you! If you have any questions, feedback,
            or need support, feel free to reach out to us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Email Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="flex justify-center items-center mb-4 gap-2">
                <EnvelopeIcon className="w-8 h-8 text-neroBlack900" />
                <h3 className="text-2xl font-bold text-neroBlack900">
                  Email Us
                </h3>
              </div>

              <p className="text-neroBlack500">
                Send us an email at{" "}
                <a
                  href="mailto:support@trendhaven.com"
                  className="text-neroBlack900 font-medium underline"
                >
                  support@trendhaven.com
                </a>
              </p>
            </div>

            {/* Phone Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="flex justify-center items-center mb-4 gap-2">
                <PhoneIcon className="w-8 h-8 text-neroBlack900" />
                <h3 className="text-2xl font-bold text-neroBlack900 ">
                  Call Us
                </h3>
              </div>

              <p className="text-neroBlack500">
                Speak to our support team at{" "}
                <a
                  href="tel:+1234567890"
                  className="text-neroBlack900 font-medium underline"
                >
                  +1 234 567 890
                </a>
              </p>
            </div>

            {/* Location Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="flex justify-center items-center mb-4 gap-2">
                <MapPinIcon className="w-8 h-8 text-neroBlack900" />
                <h3 className="text-2xl font-bold text-neroBlack900 ">
                  Visit Us
                </h3>
              </div>

              <p className="text-neroBlack500">
                123 TrendHaven St., Suite 101 Yangon.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from "../logo/logo.png"
const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="container px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
              <img src={logo} alt='TrendHaven Logo' className="w-20 h-20" />
              <h3 className="text-xl font-semibold mb-4">TrendHaven</h3>
            <p className="text-sm">Your ultimate destination for the latest fashion, electronics, and lifestyle products.</p>
          </div>

          {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to={"/about"}  className="hover:underline">About Us</Link></li>
            <li><Link to={"/products"} className="hover:underline">Shop</Link></li>
            <li><Link to={"/"} className="hover:underline">Contact</Link></li>
            <li><Link to={"/"} className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
          <ul className="space-y-2">
            <li><Link to={"/"} className="hover:underline">Returns & Refunds</Link></li>
            <li><Link to={"/"} className="hover:underline">Shipping Policy</Link></li>
            <li><Link to={"/"} className="hover:underline">Privacy Policy</Link></li>
            <li><Link to={"/"} className="hover:underline">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <Link to={"/"} className="hover:text-blue-500"><FaFacebookF /></Link>
            <Link to={"/" }className="hover:text-blue-400"><FaTwitter /></Link>
            <Link to={"/"} className="hover:text-pink-500"><FaInstagram /></Link>
            <Link to={"/"} className="hover:text-blue-600"><FaLinkedinIn /></Link>
          </div>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-gray-700 pt-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} TrendHaven. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

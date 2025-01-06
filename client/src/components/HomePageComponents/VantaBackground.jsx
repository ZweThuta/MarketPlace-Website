import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GLOBES from "vanta/src/vanta.globe";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const effect = GLOBES({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      color: 0x262626,
      color2: 0x4a3b39,
      backgroundColor: 0xf8f8f8,
      speed: 0.2,
      THREE: THREE,
      vertexColors: THREE.NoColors,
    });

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_REGISTER_URL);
      if (response.data.status === 1) {
        const userData = response.data.data;
        const filterUsers = userData
          .filter((user) => user.role === "user")
          // .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        setUsers(filterUsers);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <>
      <div
        ref={vantaRef}
        style={{
          width: "100%",
          height: "95vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#1a1a1a",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            whiteSpace: "wrap",
            speed: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-52 mr-72 bg-transparent opacity-90"
          >
            <h1 className="text-6xl text-nowrap font-extrabold tracking-wider text-neroBlack950 mb-10 uppercase">
              Welcome to TrendHaven
            </h1>
            <p className="text-neroBlack500 mt-4 mb-10 text-md max-w-6xl text-justify mx-auto">
              Start a small business or find unique, handcrafted items from
              talented local sellers. Discover exclusive products that stand out
              from the ordinary, made with passion and precision. At TrendHaven,
              we connect creative entrepreneurs with buyers looking for
              one-of-a-kind goods.
            </p>
            <div className="mt-8 flex space-x-10 uppercase">
              <Link
                to="/register"
                className="px-8 py-3 bg-neroBlack950 text-white rounded-md text-lg hover:border hover:border-neroBlack950 hover:text-neroBlack950 hover:bg-transparent transition"
              >
                Get Started
              </Link>
              <Link
                to="/products"
                className="px-8 py-3 border border-neroBlack950 text-neroBlack950 rounded-md text-lg hover:bg-neroBlack950 hover:text-white transition"
              >
                Explore Items
              </Link>
            </div>
          </motion.div>

          {users.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left absolute bottom-0 left-0"
            >
              <h1 className="text-sm font-semibold tracking-wider text-neroBlack950 uppercase mb-3">
                Trust Sellers
              </h1>
              <p className="text-neroBlack950 text-xs max-w-sm text-justify mb-3 ">
                Meet the talented artisans and designers behind the products you
                love. Connect with them directly to ask questions, request
                custom or personalized items, and make special requests.
              </p>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {users.map((user) => (
                    <img
                      key={user.id}
                      src={`${import.meta.env.VITE_IMAGES_URL}/${user.profile}`}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default VantaBackground;

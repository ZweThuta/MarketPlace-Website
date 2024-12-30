import React, { useState } from "react";
import {
  Squares2X2Icon,
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import DashBoard from "../components/DashBoard";
import Users from "../components/Users";
import AdminProducts from "../components/AdminProducts";
import Orders from "../components/Orders";
import { motion } from "framer-motion";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: Squares2X2Icon,
      content: <DashBoard />,
    },
    {
      label: "Users",
      value: "users",
      icon: UsersIcon,
      content: <Users />,
    },
    {
      label: "Products",
      value: "products",
      icon: CubeIcon,
      content: <AdminProducts />,
    },
    {
      label: "Orders",
      value: "orders",
      icon: ShoppingBagIcon,
      content: <Orders />,
    },
  ];

  return (
    <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 3, x: 0 }}
    transition={{ duration: 0.8 }}
     className="flex">
      {/* Sidebar - Tabs */}
      <div className="w-1/4 bg-neroBlack900 text-customWhite flex flex-col shadow-xl">
        <h1 className="text-sm font-semibold p-4 border-b border-neutral-700 tracking-wider uppercase text-gray-500">Admin Panel</h1>
        <hr className="border-t-3 border-neutral-600" />

        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-3 p-4 text-left ${
              activeTab === tab.value
                ? "bg-neutral-800"
                : "hover:bg-neroBlack500 transition"
            }`}
          >
            {React.createElement(tab.icon, { className: "w-6 h-6" })}
            <span className="text-base">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content - Tab Panel */}
      <div className="w-full p-10">
        {tabs.map((tab) =>
          activeTab === tab.value ? (
            <div key={tab.value}>{tab.content}</div>
          ) : null
        )}
      </div>
    </motion.div>
  );
};

export default Admin;

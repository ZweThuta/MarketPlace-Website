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
    <div className="flex h-screen">
      {/* Sidebar - Tabs */}
      <div className="w-1/4 bg-neroBlack900 text-customWhite flex flex-col shadow-xl">
        <h1 className="text-lg font-semibold p-4 border-b border-neutral-700 tracking-wider uppercase text-gray-500">Admin Panel</h1>
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
      <div className="w-2/3 p-6">
        {tabs.map((tab) =>
          activeTab === tab.value ? (
            <div key={tab.value}>{tab.content}</div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Admin;

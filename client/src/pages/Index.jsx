import React from "react";
import VantaBackground from "../components/HomePageComponents/VantaBackground";
import CategoryCard from "../components/HomePageComponents/CategoryCard";
import CategoriesFilter from "../components/CategoriesFilter";
import LimitedProduct from "../components/HomePageComponents/LimitedProduct";

const Index = () => {
  return (
    <div className="w-full h-auto flex flex-col bg-cover bg-center relative">
      <div className="absolute top-0 left-0 w-full h-screen -z-10">
        <VantaBackground />
      </div>
      <div className="mt-[45%]">
        <CategoryCard />
      </div>
      <LimitedProduct/>
    </div>
  );
};

export default Index;

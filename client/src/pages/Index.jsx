import React from "react";
import VantaBackground from "../components/HomePageComponents/VantaBackground";
import CategoryCard from "../components/HomePageComponents/CategoryCard";
import LimitedProduct from "../components/HomePageComponents/LimitedProduct";
import NewArrivals from "../components/HomePageComponents/NewArrivals";
import HomeBanner from "../components/HomePageComponents/HomeBanner";

const Index = () => {
  return (
    <div className="w-full h-auto flex flex-col bg-cover bg-center relative">
      <div className="absolute top-4 left-0 w-full h-screen">
        <VantaBackground />
      </div>
      <div className="mt-[44%]">
        {""}
      </div>
        <CategoryCard />
      <LimitedProduct/>
      <NewArrivals/>
      <HomeBanner/>
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import discount from "./banners/Discount.mp4";
import vid from "./banners/vid.mp4";
import axios from "axios";

const Discount = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
      if (response.data.status === 1) {
        const filterPoducts = response.data.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 1);
        setProducts(filterPoducts);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <section className="m-10 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="lg:w-1/3 h-fit">
        <video
          src={discount}
          className="w-full object-cover rounded-xl shadow-lg"
          autoPlay
          loop
          muted
          playsInline
        ></video>
      </div>
      <div className="lg:w-2/3 h-fit ">
        <video
          src={vid}
          className="w-full object-cover rounded-xl shadow-lg"
          autoPlay
          loop
          muted
          playsInline
        ></video>
      </div>
    </section>
  );
};

export default Discount;

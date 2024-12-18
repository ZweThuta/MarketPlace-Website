import axios from "axios";
import {useLoaderData } from "react-router-dom";
import ViewProducts from "../components/ViewProducts";
const Category = () => {
    const products = useLoaderData();
  return (
   <>
    <div className="p-10 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.length > 0 ? (
            products.map((product) => (
              <ViewProducts product={product} key={product.id} />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No product available!
            </p>
          )}
        </div>
      </div>
   </>
  )
}

export default Category;

export async function categoryLoader({params}) {
    try {
      const {category} = params;
      const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
      if (response.data.status === 1) {
        const data =  response.data.data;
        const filteredProducts = data.filter(product => product.category === category);
        return filteredProducts;
      } else {
        response.data.message;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
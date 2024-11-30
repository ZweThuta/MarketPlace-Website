import axios from "axios"
import { useLoaderData } from "react-router-dom"
import UserItems from "../components/UserItems";

const UserProducts = () => {
    const products = useLoaderData();
  return (
    <>
    <section className="p-6 bg-gray-50">
  <div className="mb-4">
    <h2 className="text-3xl font-bold text-center">My Products</h2>
  </div>
  <div className="flex flex-col md:flex-row gap-5">
    <div className="w-full md:w-1/3">
      {/* Optional sidebar or additional content can go here */}
    </div>
    <div className="w-full bg-gray-100 p-4 rounded-lg">
      {products.length > 0 ? (
        products.map((product) => (
          <UserItems product={product} key={product.id} />
        ))
      ) : (
        <p className="text-center text-gray-600">No product available!</p>
      )}
    </div>
  </div>
</section>
    </>
  )
}

export default UserProducts

export async function userProductsLoader() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      // Fetch user ID
      const userIdResponse = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userId = userIdResponse.data.data.id;
  
      // Fetch user products
      const productsResponse = await axios.get(import.meta.env.VITE_ADD_PRODUCT_URL, {
        params: { userId },
      });
  
      if (productsResponse.data.status === 1) {
        return productsResponse.data.data;  
      } else {
        return [];  
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];  
    }
  }
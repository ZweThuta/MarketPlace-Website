import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import UserItems from "../components/UserItems";
import logo from "../logo/me.jpg";
import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { use } from "react";
const UserProducts = () => {
  const products = useLoaderData();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const userResponse = await axios.get(import.meta.env.VITE_LOGIN_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <section className="p-6 bg-gray-50">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-center">My Products</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-1">
          {/* additional content*/}
          <div className="w-full md:w-1/2 shadow-lg rounded-lg overflow-hidden">
            <div className="relative bg-richChocolate200 h-32 w-full">
              <Link>
                <PencilSquareIcon className="w-7 h-7 text-blue-700 hover:text-blue-900 absolute top-4 right-4 transition-transform transform hover:scale-110" />
              </Link>
              <div className="absolute top-16 left-6 w-40 h-40 border-4 border-white rounded-full overflow-hidden shadow-md">
                <img
                  src={logo}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {user ? (
              <div className="p-6">
                {/* User Info */}
                <div className="text-center mt-16">
                  <h1 className="text-2xl font-bold capitalize text-gray-800">
                    {user.name}
                  </h1>
                  <span className="text-sm text-gray-500">
                    Joined: {user.date}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mt-6 grid grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.phno ? user.phno : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <HomeIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.address ? user.address : "N/A"}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.city ? user.city : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Loading user data...
              </div>
            )}
          </div>

          {/* View USer Product */}
          <div className="w-full p-4 rounded-lg">
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
  );
};

export default UserProducts;

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
    const productsResponse = await axios.get(
      import.meta.env.VITE_ADD_PRODUCT_URL,
      {
        params: { userId },
      }
    );

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

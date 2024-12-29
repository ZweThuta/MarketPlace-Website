import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import UserItems from "../components/UserItems";
import logo from "../logo/cat.png";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import pic from "../logo/addProduct.gif";

import {
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  MapPinIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";
import ProfileEdit from "../components/ProfileEdit";
const UserProducts = () => {
  const products = useLoaderData();
  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;

  const pageCount = Math.ceil(products.length / productsPerPage);

  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

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
  }, [user]);

  return (
    <>
      <section className="p-8 bg-gray-50">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-center text-gray-800">
            My Profile
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Manage your profile and view your products
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <div className="relative w-full md:w-1/2 h-fit bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Profile Header */}
            <div
              className={`relative h-40 w-full ${
                user && user.banner
                  ? ""
                  : "bg-gray-200"
              }`}
              style={{
                backgroundImage:
                  user && user.banner
                    ? `url(${import.meta.env.VITE_IMAGES_URL}/${user.banner})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Link onClick={() => setIsModalOpen(true)}>
                <PencilSquareIcon className="w-8 h-8 text-neroBlack900 font-bold hover:text-richChocolate900 absolute top-4 right-4 transition-transform transform hover:scale-110" />
              </Link>
              <div className="absolute top-24 left-6 w-40 h-40 border-4 border-white rounded-full overflow-hidden shadow-md">
                {user && user.profile ? (
                  <img
                    src={`${import.meta.env.VITE_IMAGES_URL}/${user.profile}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={logo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Add New Product Button */}
            <Link
              to={"/addProduct"}
              className="absolute top-44 right-5 bg-neroBlack900 text-customWhite py-2 px-4 rounded-lg shadow-lg flex items-center hover:bg-neroBlack950 transition duration-300"
            >
              <SquaresPlusIcon className="h-5 w-5 inline-block mr-2" />
              Add New Product
            </Link>

            {/* Profile Info */}
            <div className="p-6">
              {user ? (
                <>
                  {/* Name and Join Date */}
                  <div className="text-center mt-16">
                    <h1 className="text-2xl font-bold capitalize text-gray-800">
                      {user.name}
                    </h1>
                    <span className="text-sm text-gray-500 block">
                      Member since: {user.date}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <EnvelopeIcon className="w-6 h-6 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <PhoneIcon className="w-6 h-6 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {user.phno ? user.phno : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <HomeIcon className="w-6 h-6 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {user.address ? user.address : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPinIcon className="w-6 h-6 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {user.city ? user.city : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* About Me Section */}
                  <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      About Me
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {user.note ? user.note : "You can describe yourself here"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Loading user data...
                </div>
              )}
            </div>
          </div>

          {/* User Products */}
          <div className="w-full bg-white shadow-lg rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mt-5 uppercase tracking-wide text-center">
              My Products
            </h3>
            {displayedProducts.length > 0 ? (
              <div className="space-y-4">
                {displayedProducts.map((product) => (
                  <UserItems product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-500">No products available</p>
                <div className="flex justify-center mt-6">
                  <img src={pic} alt="No products" className="w-64 h-64 object-cover" />
                </div>
                <Link
                  to={"/addProduct"}
                  className="mt-0 inline-block  text-neroBlack950 py-2 px-4 rounded-lg shadow-lg transition duration-300"
                >
                  Add Your First Product!
                </Link>
              </div>
            )}
          </div>
        </div>
        {products.length > productsPerPage && (
          <div className="flex justify-center mt-10">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={
                "flex items-center space-x-2 text-sm bg-white rounded-lg shadow-md p-3"
              }
              activeClassName={"bg-neroBlack950 text-white rounded-full"}
              pageLinkClassName={
                "px-3 py-1 rounded-lg hover:bg-gray-200 transition"
              }
              previousLinkClassName={
                "px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              }
              nextLinkClassName={
                "px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              }
              breakClassName={"px-3 py-2"}
              disabledClassName={"text-gray-300 cursor-not-allowed"}
            />
          </div>
        )}
        <ProfileEdit
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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

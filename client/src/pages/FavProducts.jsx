import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import FavItems from "../components/FavItems";

const FavProducts = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [favProducts, setFavProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8;

  const pageCount = Math.ceil(favProducts.length / productsPerPage);

  const displayedProducts = favProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (currentUserId) {
      fetchFavProducts();
    }
  }, [currentUserId]); 
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found.");

      const userResponse = await axios.get(import.meta.env.VITE_LOGIN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.data?.data?.id) {
        setCurrentUserId(userResponse.data.data.id);
      } else {
        throw new Error("Failed to fetch user ID.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFavProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_FAVOURITE_URL}?userId=${currentUserId}`
      );

      setFavProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching favourite products:", error);
    }
  };
  return (
    <>
      <div className="p-10 ">
        <h1 className="text-center text-2xl font-semibold tracking-widest text-gray-600 col-span-full mb-10">My Whistlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <FavItems
                product={product}
                key={product.id}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No product available!
            </p>
          )}
        </div>
        {favProducts.length > productsPerPage && (
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
              activeClassName={"bg-richChocolate700 text-white rounded-full"}
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
      </div>
    </>
  );
};

export default FavProducts;

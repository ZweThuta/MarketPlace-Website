import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import ViewProducts from "../components/ViewProducts";
import ReactPaginate from "react-paginate";
import CategoriesFilter from "../components/CategoriesFilter";
const Category = () => {
  const products = useLoaderData();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const productsPerPage = 12;

  const pageCount = Math.ceil(products.length / productsPerPage);

  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

  return (
    <>
      <div className="p-10 bg-gray-100">
        <CategoriesFilter />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ViewProducts
                product={product}
                currentUserId={currentUserId}
                key={product.id}
              />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full h-screen">
              No product available!
            </p>
          )}
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
      </div>
    </>
  );
};

export default Category;

export async function categoryLoader({ params }) {
  try {
    const { category } = params;
    const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
    if (response.data.status === 1) {
      const data = response.data.data;
      const filteredProducts = data.filter(
        (product) => product.category === category
      );
      return filteredProducts;
    } else {
      response.data.message;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

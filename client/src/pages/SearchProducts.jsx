import { Spinner } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ViewProducts from "../components/ViewProducts";
import ReactPaginate from "react-paginate";

const SearchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 12;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError("");
    setProducts([]);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SEARCH_URL}?query=${encodeURIComponent(query)}`
      );

      if (response.data && response.data.status === 1 && response.data.data) {
        setProducts(response.data.data);
      } else {
        setError("No products found for. Please try a different search.");
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("An error occurred while fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        Search Results for:{" "}
        <span className="text-blue-600">&quot;{query}&quot;</span>
      </h1>

      {/* Loading State */}

      {loading && (
        <div className="flex items-center justify-center mt-20">
          <Spinner className="h-16 w-16 text-center text-gray-500/50" />
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Results */}
      {!loading && !error && displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ViewProducts key={product.id} product={product} />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-gray-500 text-center">No products found.</p>
        )
      )}

      {/* Pagination */}
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
  );
};

export default SearchProducts;

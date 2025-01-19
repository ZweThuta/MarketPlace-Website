import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import ViewProducts from "../components/ViewProducts";
import ReactPaginate from "react-paginate";
import CategoriesFilter from "../components/CategoriesFilter";

const Products = () => {
  const products = useLoaderData();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    category: "all",
    quality: "all",
  });

  const productsPerPage = 12;

  const uniqueBrands = Array.from(
    new Set(products.map((product) => product.quality))
  );

  const filteredProducts = products.filter((product) => {
    const isWithinPriceRange =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];

    const isCategoryMatch =
      filters.category === "all" || product.category === filters.category;

    const isBrandMatch =
      filters.quality === "all" || product.quality === filters.quality;

    return isWithinPriceRange && isCategoryMatch && isBrandMatch;
  });

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
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

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    setCurrentPage(0);
  };

  return (
    <>
      <section className="flex flex-row bg-customWhite2">
        <div>{/* side Bar */}</div>
        <div className="p-10">
          {/* Categories Filter */}
          <CategoriesFilter
            onCategoryChange={(category) =>
              handleFilterChange("category", category)
            }
          />

          <div className="flex flex-row justify-between items-center mb-5">
            {/* Price Range Filter on the Left */}
            <div className="flex-1 max-w-xs">
              <label className="block text-gray-700 font-medium mb-1">
                Price Range:
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [
                    filters.priceRange[0],
                    Number(e.target.value),
                  ])
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>

            {/* Spacer for Proper Alignment */}
            <div className="flex-grow"></div>

            {/* Brand Filter on the Right */}
            <div className="flex gap-2 max-w-xs text-right">
              <label className="block text-gray-700 font-medium mt-2">
                Brand:
              </label>
              <select
                value={filters.quality}
                onChange={(e) => handleFilterChange("quality", e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-neroBlack950"
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ViewProducts
                  product={product}
                  key={product.id}
                  currentUserId={currentUserId}
                />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full h-screen">
                No product available!
              </p>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
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
      </section>
    </>
  );
};

export default Products;

export async function productsLoader() {
  try {
    const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
    if (response.data.status === 1) {
      return response.data.data;
    } else {
      response.data.message;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

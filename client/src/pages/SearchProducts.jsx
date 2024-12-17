import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ViewProducts from "../components/ViewProducts";

const SearchProducts = () => {
  const [products, setProducts] = useState([]);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState("");  
  const location = useLocation();  

 
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
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Results */}
      {!loading && !error && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ViewProducts key={product.id} product={product} />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-gray-500 text-center">No products found.</p>
        )
      )}
    </div>
  );
};

export default SearchProducts;

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  TrashIcon,
  PencilIcon,
  CubeIcon,
  InboxStackIcon,
  CurrencyDollarIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;

  const pageCount = Math.ceil(products.length / productsPerPage);

  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
      if (response.data.status === 1) {
        setProducts(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    axios
      .delete(`${import.meta.env.VITE_USER_PRODUCT_DETAILS}?productId=${id}`)
      .then(() => toast.success("Product removed successfully!"))
      .catch(() => toast.error("Error deleting product:"));
  };

  const categoryCount = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const totalPrice = products.reduce(
    (acc, product) => acc + (Number(product.price) || 0),
    0
  );
  const totalAmount = products.reduce(
    (acc, product) => acc + (Number(product.quantity) || 0),
    0
  );
  const finalTotalPrice = totalPrice * totalAmount;
  return (
    <div className="w-full">
      <h1 className="text-2xl mb-3 font-extrabold uppercase tracking-wide text-neroBlack500 border-b-2 border-gray-200 pb-4">
        Products Dashboard
      </h1>
      <span className="text-sm text-gray-400">
        Visualize and manage the entire product catalog here.
      </span>
      {/* Product DashBoard */}
      <div className="flex gap-5">
        <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gray-100 p-3 rounded-lg">
              <CubeIcon className="w-8 h-8 text-neroBlack950" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{products.length}</p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <span className="text-gray-500">...</span>
          </button>
        </div>

        <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gray-100 p-3 rounded-lg">
              <InboxStackIcon className="w-8 h-8 text-neroBlack950" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">By Category</p>
              {Object.entries(categoryCount).map(([category, count]) => (
                <div
                  key={category}
                  className="flex flex-row justify-between text-sm py-1 gap-4"
                >
                  <span>{category}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <span className="text-gray-500">...</span>
          </button>
        </div>

        <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gray-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-semibold">
                ${finalTotalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <span className="text-gray-500">...</span>
          </button>
        </div>

        <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Square3Stack3DIcon className="w-8 h-8 text-neroBlack500" />
            </div>
            <div>
              <p className="text-sm text-gray-500"> Product Amount</p>
              <p className="text-2xl font-semibold">{totalAmount}</p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <span className="text-gray-500">...</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full border-collapse shadow-lg">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-neroBlack500 hover:bg-gray-100"
              >
                <td className="py-3 px-6 flex items-center gap-4">
                  <Link to={`/userProductDetail/${product.id}`}>
                    <img
                      src={`${import.meta.env.VITE_IMAGES_URL}/${
                        product.image
                      }`}
                      alt={product.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </Link>

                  {product.productName}
                </td>
                <td className="py-3 px-6">{product.category}</td>
                <td className="py-3 px-6">${product.price}</td>
                <td className="py-3 px-6">{product.quantity}</td>
                <td className="py-3 px-6">{product.quality}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 mr-5"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                  <Link
                    to={`/editProduct/${product.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  );
};

export default AdminProducts;

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
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setselectedProductId] = useState(null);
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

  const handleDelete = async () => {
    try {
      const updatedProducts = products.filter(
        (product) => product.id !== selectedProductId
      );
      setProducts(updatedProducts);
      await axios.delete(
        `${
          import.meta.env.VITE_USER_PRODUCT_DETAILS
        }?productId=${selectedProductId}`
      );
      toast.success("Product removed successfully!");
      navigate(0);
      setShowModal(false);
    } catch (error) {
      toast.error("Error deleting product:");
      setShowModal(false);
    }
  };

  const confirmDelete = (id) => {
    setselectedProductId(id);
    setShowModal(true);
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
      {/* Header */}
      <h1 className="text-2xl mb-3 font-extrabold uppercase tracking-wide text-neroBlack500 border-b-2 border-gray-200 pb-4">
        Products Manager
      </h1>
      <span className="text-sm text-gray-400">
        Visualize and manage the entire product catalog here.
      </span>

      {/* Product DashBoard */}
      <div className="flex gap-5">
        {/* Product Count */}
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

        {/* Category Count */}
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

        {/* Total Price */}
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

        {/* Total Product Amount */}
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
                    onClick={() => confirmDelete(product.id)}
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

      {/* Pagination */}
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

      {/* Confim Model */}
      {showModal && (
        <div className="fixed inset-0 bg-neroBlack950 bg-opacity-50 flex items-center justify-center border-collapse">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-3">Confirm Deletion!</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

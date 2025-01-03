import axios from "axios";
import { useEffect, useState } from "react";
import {
  PhoneIcon,
  HomeIcon,
  NewspaperIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import moment from "moment";

const Orders = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 3;

  const pageCount = Math.ceil(orders.length / ordersPerPage);

  const displayedOrders = orders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_ADMIN_ORDER_URL);
      if (response.data.status === 1) {
        const ordersData = response.data.data;

        // Group orders by orderId
        const groupedOrders = groupOrders(ordersData);

        setOrders(groupedOrders);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const updatedOrders = orders.filter(
        (order) => order.id !== selectedOrderId
      );
      setOrders(updatedOrders);
      const response = await axios.delete(
        `${import.meta.env.VITE_ADMIN_ORDER_URL}?orderId=${selectedOrderId}`
      );
      if (response.data.status === 1) {
        toast.success("Order deleted successfully");
        setShowModal(false);
        navigate(0);
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("Error removing order:");
      setShowModal(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedOrderId(id);
    setShowModal(true);
  };

  const groupOrders = (ordersData) => {
    const grouped = {};

    ordersData.forEach((order) => {
      const {
        orderId,
        name,
        email,
        profile,
        totalprice,
        delivery,
        order_date,
        phno,
        address,
        city,
        country,
        zip,
        note,
        productName,
        image,
        quantity,
      } = order;

      if (!grouped[orderId]) {
        grouped[orderId] = {
          orderId,
          name,
          email,
          profile,
          totalprice,
          delivery,
          order_date,
          phno,
          address,
          city,
          country,
          zip,
          note,
          products: [],
        };
      }

      // Add product to the specific order
      grouped[orderId].products.push({ productName, image, quantity });
    });

    return Object.values(grouped);
  };

  return (
    <>
      {/* Header */}
      <h1 className="text-2xl mb-3 font-extrabold uppercase tracking-wide text-neroBlack500 border-b-2 border-gray-200 pb-4">
        Orders Control
      </h1>
      <span className="text-sm text-gray-400">
        Easily manage all orders from this dashboard.
      </span>

      {/* Order Displayed */}
      <div className="grid grid-cols-1 gap-6 mt-10 ">
        {displayedOrders.length > 0 ? (
          <>
            {displayedOrders.map((order) => (
              // Order Card
              <div
                key={order.orderId}
                className="p-6 bg-white rounded-xl shadow-md border-2 border-neutral-200"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    {order && order.profile ? (
                      <>
                        <img
                          src={`${import.meta.env.VITE_IMAGES_URL}/${
                            order.profile
                          }`}
                          alt={order.name}
                          className="w-16 h-16 object-cover rounded-full border-2 border-neroBlack950"
                        />
                      </>
                    ) : (
                      <>
                        <UserCircleIcon className="w-16 h-16 object-cover rounded-full border-2 border-neroBlack950" />
                      </>
                    )}

                    <div>
                      <p className="text-xl font-semibold">{order.name}</p>
                      <p className="text-sm text-gray-400">{order.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm flex gap-2 bg-gray-100 px-2 py-3 rounded-lg border-2 border-neroBlack500">
                      <span className="text-neroBlack950 capitalize tracking-widest">
                        {order.delivery} Delivery
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="flex items-center gap-2 mb-3">
                    <PhoneIcon className="w-5 h-5 text-neroBlack500" />
                    <span className="font-medium">Phone Number:</span>
                    <span className="text-gray-700">{order.phno}</span>
                  </p>

                  <p className="flex items-center gap-2 mb-3">
                    <HomeIcon className="w-5 h-5 text-neroBlack500" />
                    <span className="font-medium">Address:</span>
                    <span className="text-gray-700">
                      {order.address}, {order.city}, {order.country} -{" "}
                      {order.zip}
                    </span>
                  </p>

                  <p className="flex items-center gap-2 mb-8">
                    <NewspaperIcon className="w-5 h-5 text-neroBlack500" />
                    <span className="font-medium">Note:</span>
                    <span className="text-gray-700">{order.note}</span>
                  </p>
                </div>
                <hr className="mt-5 mb-5 border-t-3 border-grey" />

                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold text-gray-500 tracking-wider uppercase mb-5">
                    Order Products
                  </h1>
                  <div className="text-lg font-semibold tracking-wider uppercase">
                    <span className="text-gray-500">Total Price: </span>
                    <span className="text-green-500 tracking-widest">
                      ${order.totalprice}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {order.products.map((product, index) => (
                    <div
                      key={`${product.productName}-${index}`}
                      className="flex items-center gap-4 p-2 bg-gray-100 rounded-lg"
                    >
                      <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${
                          product.image
                        }`}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <p className="text-lg">
                        {product.productName.length > 20
                          ? product.productName.slice(0, 20) + "..."
                          : product.productName}
                      </p>
                      <p className="text-md">x {product.quantity}</p>
                    </div>
                  ))}
                </div>
                <hr className="mt-5 border-t-3 border-grey" />

                <div className="flex mt-3 justify-between">
                  <p className="text-sm font-semibold text-gray-400">
                    <span>Order Date - </span>
                    <span>
                      {moment(order.order_date).format("MMMM Do YYYY")}
                    </span>
                  </p>
                  <button
                    onClick={() => confirmDelete(order.orderId)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span>Cancel Order</span>
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-lg text-gray-500">No orders found.</p>
        )}

        {/* Pagination */}
        {orders.length > ordersPerPage && (
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
              <p>Are you sure you want to remove this order?</p>
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
    </>
  );
};

export default Orders;

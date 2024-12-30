import axios from "axios";
import { useEffect, useState } from "react";
import {
  PhoneIcon,
  HomeIcon,
  NewspaperIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
const Orders = () => {
  const [orders, setOrders] = useState([]);

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
        {orders.length > 0 ? (
          <>
            {orders.map((order) => (
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
                      <p className="text-lg">{product.productName}</p>
                      <p className="text-md">x {product.quantity}</p>
                    </div>
                  ))}
                </div>
                <hr className="mt-5 border-t-3 border-grey" />

                <div className="flex mt-3 justify-between">
                  <p className="text-sm font-semibold text-gray-400">
                    <span>Order Date - </span>
                    <span>{order.order_date}</span>
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
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
      </div>
    </>
  );
};

export default Orders;

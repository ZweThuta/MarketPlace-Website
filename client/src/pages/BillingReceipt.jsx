import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", backgroundColor: "#f9f9f9" },
  header: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1px solid #ddd",
  },
  text: { fontSize: 12, marginBottom: 5 },
  total: { fontSize: 14, fontWeight: "bold", marginTop: 10, color: "#d9534f" },
  productImage: { width: 100, height: 100, marginBottom: 10 },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "2px solid #ddd",
    marginTop: 30,
    paddingBottom: 8,
    backgroundColor: "#e9ecef",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    borderBottom: "1px solid #ddd",
  },
  boldText: { fontWeight: "bold", marginBottom: 5, fontSize: 18 },
  note: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 10,
    color: "#555",
    textAlign: "center",
  },
});

const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.header}>Invoice No. {order.orderId}</Text>
      </View>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        BILLING RECEIPT
      </Text>
      <Text style={{ fontSize: 10, marginBottom: 20 }}>
        Date: {order.order_date}
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={styles.boldText}>Billed to:</Text>
          <Text style={styles.text}>{order.name}</Text>
          <Text style={styles.text}>{order.address}</Text>
          <Text style={styles.text}>
            {order.city}, {order.zip}
          </Text>
          <Text style={styles.text}>{order.email}</Text>
        </View>
        <View>
          <Text style={styles.boldText}>From:</Text>
          <Text style={styles.text}>TrendHaven Market Place</Text>
          <Text style={styles.text}>123 E-commerce St.</Text>
          <Text style={styles.text}>Online City, 10101</Text>
          <Text style={styles.text}>support@trendhaven.com</Text>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={{ width: "40%", fontSize: 12 }}>Item</Text>
        <Text style={{ width: "20%", textAlign: "center", fontSize: 12 }}>
          Quantity
        </Text>
        <Text style={{ width: "20%", textAlign: "center", fontSize: 12 }}>
          Price
        </Text>
        <Text style={{ width: "20%", textAlign: "right", fontSize: 12 }}>
          Amount
        </Text>
      </View>

      {/* Table Rows */}
      {order.products.map((product, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={{ width: "40%", fontSize: 12 }}>
            {product.productName}
          </Text>
          <Text style={{ width: "20%", textAlign: "center", fontSize: 12 }}>
            1
          </Text>
          <Text style={{ width: "20%", textAlign: "center", fontSize: 12 }}>
            ${product.price}
          </Text>
          <Text style={{ width: "20%", textAlign: "right", fontSize: 12 }}>
            ${product.price}
          </Text>
        </View>
      ))}

      <View
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.boldText}>Total</Text>
        <Text style={styles.boldText}>
          ${parseFloat(order.totalprice).toFixed(2)}
        </Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.boldText}>Note:</Text>
        <Text style={styles.note}>Thank you for shooping with us!</Text>
      </View>
    </Page>
  </Document>
);
const BillingReceipt = ({ order }) => (
  <div className="text-center mt-8">
    <PDFDownloadLink
      document={<InvoicePDF order={order} />}
      fileName={`order-receipt-${order.orderId}.pdf`}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      {({ loading }) =>
        loading ? (
          "Generating Receipt..."
        ) : (
          <>
            <ArrowDownOnSquareIcon className="h-5 w-5 inline-block -mt-1 mr-1" />{" "}
            Download Billing Receipt
          </>
        )
      }
    </PDFDownloadLink>
  </div>
);

const CheckOut = () => {
  const [groupedOrders, setGroupedOrders] = useState({});

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
        fetchOrderData(userResponse.data.data.id);
      } else {
        throw new Error("Failed to fetch user ID.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  console.log(groupedOrders);

  const fetchOrderData = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ORDER_URL}?userId=${userId}`
      );
      if (response.data?.status === 1) {
        const grouped = groupOrdersById(response.data.data);
        setGroupedOrders(grouped);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      toast.error("Failed to fetch order details.");
    }
  };

  const groupOrdersById = (orders) => {
    const grouped = {};

    orders.forEach((order) => {
      if (!grouped[order.orderId]) {
        grouped[order.orderId] = {
          ...order,
          products: [],
          totalprice: 0,
        };
      }
      grouped[order.orderId].products.push({
        productName: order.productName,
        image: order.image,
        price: order.price,
      });
      grouped[order.orderId].totalprice += parseFloat(order.totalprice);
    });

    return grouped;
  };

  return (
    <section className="text-center mt-12">
      <h1 className="text-3xl font-semibold uppercase tracking-wider mb-6">
        Order Confirmation
      </h1>
      {Object.values(groupedOrders).length > 0 ? (
        Object.values(groupedOrders).map((order, index) => (
          <div key={index} className="mb-10">
            <p className="text-1xl text-gray-800">
              Thank you, {order.name}. Your order has been placed successfully!
            </p>
            <BillingReceipt order={order} />
          </div>
        ))
      ) : (
        <p>Loading order details...</p>
      )}
    </section>
  );
};

export default CheckOut;

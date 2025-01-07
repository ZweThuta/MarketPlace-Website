import { Card } from "@tremor/react";
import {
    BanknotesIcon,
} from "@heroicons/react/24/solid";

const OrderCard = ({ orders }) => {

  const groupOrders = (orders) => {
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
        quantity: order.quantity,
        price: order.price,
      });
      grouped[order.orderId].totalprice += parseFloat(order.totalprice);
    });

    return grouped;
  };
      const groupedOrders = groupOrders(orders);

      const totalSales = Object.values(groupedOrders).reduce((acc, order) => acc + parseFloat(order.totalprice), 0);
      
  return (
    <Card
      className=" max-w-xs flex items-center justify-between"
      decoration="top"
      decorationColor="black"
    >
      <div>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Total Sales
        </p>
        <p className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          ${totalSales.toFixed(2)}
        </p>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg">
        <BanknotesIcon className="w-8 h-8 text-green-500" />
      </div>
    </Card>
  );
};
export default OrderCard;

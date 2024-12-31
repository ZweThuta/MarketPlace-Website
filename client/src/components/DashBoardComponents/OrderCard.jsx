import { Card, Metric, Text } from "@tremor/react";
import {
    BanknotesIcon,
} from "@heroicons/react/24/solid";

const OrderCard = ({ orders }) => {

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
          grouped[orderId].products.push({ productName, image, quantity });
        });
    
        return Object.values(grouped);
      };
      const groupedOrders = groupOrders(orders);

      // Calculate total sales
      const totalSales = groupedOrders.reduce((acc, order) => acc + parseFloat(order.totalprice), 0);
      
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

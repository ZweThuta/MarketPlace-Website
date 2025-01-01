import { BarList, Card } from "@tremor/react";

const TopBuyers = ({ orders }) => {
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

  const userOrderCount = {};

  groupedOrders.forEach((order) => {
    const { name } = order;
    if (!userOrderCount[name]) {
      userOrderCount[name] = 0;
    }
    userOrderCount[name] += 1;
  });

  const userData = Object.entries(userOrderCount).map(([name, value]) => ({
    name,
    value,
  }));

  const topFiveUsers = userData.sort((a, b) => b.value - a.value).slice(0, 5);
  
  return (
    <Card className="max-w-lg">
      <h3 className="text-tremor-title text-center font-medium">
        Top Buyers by Orders
      </h3>
      <BarList data={topFiveUsers} className="mt-4" />
    </Card>
  );
};

export default TopBuyers;

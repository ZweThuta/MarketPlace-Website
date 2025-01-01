import { DonutChart, Card, Legend } from "@tremor/react";

const UserDistributionChart = ({ orders }) => {

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

  const cityCount = {};

  groupedOrders.forEach((order) => {
    const city = order.city;
    if (!cityCount[city]) {
      cityCount[city] = 0;
    }
    cityCount[city] += 1;
  });

  const userDistribution = Object.entries(cityCount).map(([city, users]) => ({
    city,
    users,
  }));

  return (
    <Card className="max-w-xl">
      <h3 className="text-tremor-title font-medium mb-4">Order Distribution by City</h3>
      <DonutChart
        data={userDistribution}
        category="users"
        index="city"
        colors={["blue", "cyan", "amber", "rose", "green"]}
        className="mt-6"
      />
      <Legend
          categories={userDistribution.map((data) => data.city)}
          colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
          className="max-w-xs mt-6"
        />

    </Card>
  );
};

export default UserDistributionChart;

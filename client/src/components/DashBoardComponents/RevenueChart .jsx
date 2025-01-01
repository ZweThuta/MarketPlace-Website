import { AreaChart, Card } from "@tremor/react";

const RevenueChart = ({ orders }) => {
  const salesData = orders.map((order) => ({
    date: order.order_date,
    totalprice: Number(order.totalprice).toFixed(2),
  }));

  const aggregatedData = salesData.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing.totalprice = (Number(existing.totalprice) + Number(curr.totalprice));
    } else {
      acc.push({ date: curr.date, totalprice: curr.totalprice });
    }
    return acc;
  }, []);

  aggregatedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card>
      <h3 className="text-tremor-title font-medium mb-4">Revenue Growth Over Time</h3>
      <AreaChart
        data={aggregatedData}
        index="date"
        categories={["totalprice"]}
        colors={["blue-600"]}
        yAxisWidth={60}
        curveType="monotone"
      />
    </Card>
  );
};

export default RevenueChart;

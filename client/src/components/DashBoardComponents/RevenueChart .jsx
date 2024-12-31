import { AreaChart, Card } from "@tremor/react";

const RevenueChart = ({ orders }) => {
  // Process orders to aggregate revenue by date
  const salesData = orders.map((order) => ({
    date: order.order_date,
    totalprice: order.totalprice,
  }));

  const aggregatedData = salesData.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing.totalprice += curr.totalprice;
    } else {
      acc.push({ date: curr.date, totalprice: curr.totalprice });
    }
    return acc;
  }, []);

  // Sort by date (ascending order)
  aggregatedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Revenue Growth Over Time</h3>
      <AreaChart
        data={aggregatedData}
        index="date"
        categories={["totalprice"]}
        colors={["cyan"]}
        yAxisWidth={60}
        curveType="monotone"
      />
    </Card>
  );
};

export default RevenueChart;

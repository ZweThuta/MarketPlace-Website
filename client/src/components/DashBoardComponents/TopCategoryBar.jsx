import { BarChart, Card } from "@tremor/react";

const TopCategoryBar = ({ products }) => {
  const categoryCount = {};

  products.forEach((product) => {
    const { category, quantity } = product;

    const qty = Number(quantity);
    if (!categoryCount[category]) {
      categoryCount[category] = 0;
    }
    categoryCount[category] += qty;
  });

  const chartData = Object.entries(categoryCount).map(([name, amount]) => ({
    name,
    amount,
  }));

  return (
    <Card className="max-w-full mx-auto ">
      <h3 className="text-tremor-title font-medium mb-4">
        Top Selling Categories
      </h3>
      <BarChart
        data={chartData}
        index="name"
        categories={["amount"]}
        colors={["blue-300"]}
        yAxisWidth={60}
      />
    </Card>
  );
};

export default TopCategoryBar;

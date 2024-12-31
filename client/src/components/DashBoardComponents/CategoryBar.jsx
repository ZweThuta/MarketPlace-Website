import { BarList, Card } from "@tremor/react";

const CategoryBar = ({ products }) => {
  const categoryCount = {};

  products.forEach((product) => {
    const productCategory = product.category;

    if (!categoryCount[productCategory]) {
      categoryCount[productCategory] = 0;
    }
    categoryCount[productCategory] += 1;
  });
  

  const data = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  return (
    <Card className="max-w-full">
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Product Categories
      </h3>
      <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
        <span>Category</span>
        <span>Count</span>
      </p>
      <BarList data={data} className="mt-2" color="blue" />
    </Card>
  );
};

export default CategoryBar;

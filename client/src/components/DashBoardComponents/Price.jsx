import { Card, Metric, Text } from "@tremor/react";
import {
    CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

const Price = ({ products }) => {
    const totalPrice = products.reduce(
        (acc, product) => acc + (Number(product.price) || 0),
        0
      );
      const totalAmount = products.reduce(
        (acc, product) => acc + (Number(product.quantity) || 0),
        0
      );
  const finalTotalPrice = totalPrice * totalAmount;

  return (
    <Card
      className=" max-w-xs flex items-center justify-between"
      decoration="top"
      decorationColor="black"
    >
      <div>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Total Prices
        </p>
        <p className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
        ${finalTotalPrice.toFixed(2)}
        </p>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
      </div>
    </Card>
  );
};
export default Price;

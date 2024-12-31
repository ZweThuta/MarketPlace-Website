import { Card, Metric, Text } from "@tremor/react";
import {
  CubeIcon,
} from "@heroicons/react/24/solid";

const ProductCard = ({ products }) => {
  return (
    <Card
      className=" max-w-xs flex items-center justify-between"
      decoration="top"
      decorationColor="black"
    >
      <div>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Total Products
        </p>
        <p className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          {products.length}
        </p>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg">
        <CubeIcon className="w-8 h-8 text-neroBlack950" />
      </div>
    </Card>
  );
};
export default ProductCard;

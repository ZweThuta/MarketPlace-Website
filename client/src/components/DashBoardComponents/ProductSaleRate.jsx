import { Card, Title, LineChart } from "@tremor/react";
import { format } from "date-fns";

const ProductSaleRate = ({ products }) => {
    const currentDate = new Date(); 
    const last1Year = new Date();
    last1Year.setFullYear(currentDate.getFullYear() - 1);

    const productMonthlySellRate = {};

    products.forEach((product) => {
        const productSellDate = new Date(product.date);

        if (productSellDate <= currentDate && productSellDate >= last1Year) {
            const formattedSellDate = format(new Date(productSellDate), "MM/yyyy");
            if (!productMonthlySellRate[formattedSellDate]) {
                productMonthlySellRate[formattedSellDate] = 0;
            }
            productMonthlySellRate[formattedSellDate] += 1;
        }
    });

    const chartdata = Object.entries(productMonthlySellRate).map(([key, val]) => ({
        date: key,
        "Product Sell Rate": val,
    }));

    return (
        <Card>
            <Title>Product Sell Rates Per Month</Title>
            <LineChart
                className="mt-6"
                data={chartdata}
                index="date"
                categories={["Product Sell Rate"]}
                colors={["blue"]}
                yAxisWidth={40}
            />
        </Card>
    );
};

export default ProductSaleRate;
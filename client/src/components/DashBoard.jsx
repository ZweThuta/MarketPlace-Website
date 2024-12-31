import  { useEffect, useState } from 'react'
import CategoryBar from './DashBoardComponents/CategoryBar';
import axios from 'axios';
import ProductCard from './DashBoardComponents/ProductCard';
import UserCard from './DashBoardComponents/UserCard';
import Price from './DashBoardComponents/Price';
import OrderCard from './DashBoardComponents/OrderCard';
import RevenueChart from './DashBoardComponents/RevenueChart ';
import ProductSaleRate from './DashBoardComponents/ProductSaleRate';
import UserDistributionChart from './DashBoardComponents/UserDistributionChart ';
import TopBuyers from './DashBoardComponents/TopBuyers';

const DashBoard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    fetchProducts();
    fetchUsers();
    fetchOrders();
  },[])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_PRODUCTS_URL);
      if (response.data.status === 1) {
        setProducts(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_REGISTER_URL);
      if (response.data.status === 1) {
        const userData = response.data.data;
        setUsers(userData);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_ADMIN_ORDER_URL);
      if (response.data.status === 1) {
        const ordersData = response.data.data;

        setOrders(ordersData);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <section>
      {/* Header */}
      <h1 className="text-2xl mb-3 font-extrabold uppercase tracking-wide text-neroBlack500 border-b-2 border-gray-200 pb-4">
        Admin Dashboard
      </h1>
      <span className="text-sm text-gray-400">
        Easily track and manage all users from this dashboard.
      </span>

      {/* DashBoard Components */}
      <div className='mt-10 flex flex-col gap-4'>
        {/* Card */}
        <div className='mb-4 flex justify-between gap-4'>     
        <ProductCard products={products}/>
        <UserCard users={users}/>
        <Price products={products}/>
        <OrderCard orders={orders}/>
        </div>
        <div className='flex justify-between gap-4'>
        <UserDistributionChart orders={orders}/>
        <TopBuyers orders={orders}/>
        </div>
        <CategoryBar products={products}/>
        <ProductSaleRate products={products}/>
        {/* <RevenueChart orders={orders}/> */}
      </div>
    </section>
  )
}

export default DashBoard;
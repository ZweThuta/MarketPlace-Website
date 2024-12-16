import React, { useContext } from 'react'
import { itemContext } from '../util/itemContext';
import CartItem from '../components/CartItem';

const MyCart = () => {
  const {items, totalAmount} = useContext(itemContext);
  const totalPrice = `$${totalAmount.toFixed(2)}`;
  return (
    <>
    <section>
      <h1>My Cart</h1>
      <div>
        {
          items.length < 1 ? <h1>Your Cart is empty.</h1> : <>
          <div>
            {
              items.map((product)=>(
                <CartItem key={product.id} product={product} />
              ))
            }
          </div>
          </>
        }
      </div>
      <div>
        <h2>Total Price: {totalPrice}</h2>
      </div>
    </section>
    </>
  )
}

export default MyCart;
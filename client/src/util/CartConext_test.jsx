// import React, { createContext, useReducer, useContext } from "react";
// import axios from "axios";

// // Reducer to handle cart actions
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_CART":
//       return { ...state, items: action.payload };

//     case "ADD_TO_CART":
//       return { ...state, items: [...state.items, action.payload] };

//     case "REMOVE_FROM_CART":
//       return {
//         ...state,
//         items: state.items.filter(
//           (item) => item.productId !== action.payload.productId
//         ),
//       };

//     default:
//       throw new Error(`Unhandled action type: ${action.type}`);
//   }
// };

// // Initial state for the cart
// const initialState = {
//   items: [], // Array of cart items
// };

// // Create the CartContext
// const CartContext = createContext();

// // CartProvider to manage the cart state
// const CartProvider = ({ children }) => {
//   const [cartState, dispatch] = useReducer(cartReducer, initialState);

//   // Fetch the cart items from the backend
// const fetchProductDetails = async (productId) => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_PRODUCT_URL}/${productId}`);
//     return response.data.data; // Assume backend returns product details
//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     return null;
//   }
// };

// const fetchCart = async (userId) => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_CART_URL}?userId=${userId}`);
//     if (response.data.status === 1) {
//       const enrichedCart = await Promise.all(
//         response.data.data.map(async (item) => {
//           const productDetails = await fetchProductDetails(item.productId);
//           return { ...item, ...productDetails }; // Merge cart item with product details
//         })
//       );
//       dispatch({
//         type: "SET_CART",
//         payload: enrichedCart,
//       });
//     } else {
//       console.log("Cart is empty:", response.data.message);
//     }
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//   }
// };


//   // Add an item to the cart
//   const addToCart = async (userId, productId, quantity) => {
//     try {
//       const response = await axios.post(import.meta.env.VITE_CART_URL, {
//         userId: userId,
//         productId: productId,
//         quantity,
//       });
//       if (response.data.status === 1) {
//         dispatch({
//           type: "ADD_TO_CART",
//           payload: { productId: productId, quantity, ...response.data.data },
//         });
//       } else {
//         console.error("Failed to add item:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   // Remove an item from the cart
//   const removeFromCart = async (userId, productId) => {
//     try {
//       const response = await axios.delete(import.meta.env.VITE_CART_URL, {
//         data: { userId: userId, productId: productId },
//       });
//       if (response.data.status === 1) {
//         dispatch({
//           type: "REMOVE_FROM_CART",
//           payload: { productId: productId },
//         });
//       } else {
//         console.error("Failed to remove item:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   };

//   const updateCartItem = async (userId, productId, quantity) => {
//     try {
//       const response = await axios.put(import.meta.env.VITE_CART_URL, {
//         userId,
//         productId,
//         quantity,
//       });
//       if (response.data.status === 1) {
//         dispatch({
//           type: "SET_CART",
//           payload: response.data.data, // Assume the updated cart is returned from the backend
//         });
//       }
//     } catch (error) {
//       console.error("Error updating cart item:", error);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartState, fetchCart, addToCart, removeFromCart, updateCartItem }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use the cart context
// const useCart = () => useContext(CartContext);

// export { CartProvider, useCart };

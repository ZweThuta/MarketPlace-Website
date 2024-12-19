import { createContext, useReducer } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initialState = {
  items: [],
  totalAmount: 0,
};

const itemReducer = (state, action) => {
  if (action.type === "ADD_ITEM") {
    const existItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existItem = state.items[existItemIndex];

    let updatedItems;
    let updatedTotalAmount;

    if (existItem) {
      const newAmount = existItem.amount + action.item.amount;

      if (newAmount > action.item.quantity) {
        toast.error(`This item has only ${action.item.quantity} in stock at the market.`);
        return state; 
      }

      const updatedItem = {
        ...existItem,
        amount: newAmount,
      };
      updatedItems = [...state.items];
      updatedItems[existItemIndex] = updatedItem;
    } else {
     
      if (action.item.amount > action.item.quantity) {
        toast.error(`This item has only ${action.item.quantity} in stock at the market.`);
        return state;
      }

      updatedItems = state.items.concat(action.item);
    }

    updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE_ITEM") {
    const existItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existItem = state.items[existItemIndex];
    const updatedTotalAmount = state.totalAmount - existItem.price;

    let updatedItems;
    if (existItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existItem, amount: existItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  return state; 
};

export const itemContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
});

export const ItemContextProvider = (props) => {
  const [itemState, dispatchItem] = useReducer(itemReducer, initialState);

  const addItemHandler = (item) => {
    dispatchItem({ type: "ADD_ITEM", item });
  };

  const removeItemHandler = (id) => {
    dispatchItem({ type: "REMOVE_ITEM", id });
  };

  const itemCtx = {
    items: itemState.items,
    totalAmount: itemState.totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
  };

  return (
    <itemContext.Provider value={itemCtx}>
      {props.children}
    </itemContext.Provider>
  );
};

export default ItemContextProvider;
import { createContext, useReducer } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  items: [],
  totalAmount: 0,
};

const message = (
  <span className="text-sm text-ivoryWhite tracking-wide">
    Great Choice! Added to Your Cart!
  </span>
);

const itemReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
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

      updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };

    case "REMOVE_ITEM":
      const removeItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const removedItem = state.items[removeItemIndex];
      const newTotalAmount = state.totalAmount - removedItem.price * removedItem.amount;

      const newItems = state.items.filter((item) => item.id !== action.id);

      return {
        items: newItems,
        totalAmount: newTotalAmount,
      };

    case "REMOVE_ONE_ITEM":
      const decreaseItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const decreasedItem = state.items[decreaseItemIndex];
      const updatedAmount = state.totalAmount - decreasedItem.price;

      let decreasedItems;
      if (decreasedItem.amount === 1) {
        decreasedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        const updatedDecreasedItem = { ...decreasedItem, amount: decreasedItem.amount - 1 };
        decreasedItems = [...state.items];
        decreasedItems[decreaseItemIndex] = updatedDecreasedItem;
      }

      return {
        items: decreasedItems,
        totalAmount: updatedAmount,
      };

    default:
      return state;
  }
};

export const itemContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  removeOneItem: (id) => {},
});

export const ItemContextProvider = (props) => {
  const [itemState, dispatchItem] = useReducer(itemReducer, initialState);

  const addItemHandler = (item) => {
    dispatchItem({ type: "ADD_ITEM", item });
    toast.success(message); 
  };

  const removeItemHandler = (id) => {
    dispatchItem({ type: "REMOVE_ITEM", id });
  };

  const removeOneItemHandler = (id) => {
    dispatchItem({ type: "REMOVE_ONE_ITEM", id });
  };

  const itemCtx = {
    items: itemState.items,
    totalAmount: itemState.totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    removeOneItem: removeOneItemHandler,
  };

  return (
    <itemContext.Provider value={itemCtx}>
      {props.children}
    </itemContext.Provider>
  );
};

export default ItemContextProvider;

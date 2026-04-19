import { createContext, useContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.find((i) => i._id === action.item._id);
      if (exists) {
        return state.map((i) =>
          i._id === action.item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i._id !== action.id);
    case 'UPDATE_QTY':
      if (action.qty < 1) return state.filter((i) => i._id !== action.id);
      return state.map((i) =>
        i._id === action.id ? { ...i, quantity: action.qty } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      return JSON.parse(localStorage.getItem('bh-cart')) || [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem('bh-cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', item });
    toast.success(`${item.name} added to cart`, { icon: '☕' });
  };

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });

  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

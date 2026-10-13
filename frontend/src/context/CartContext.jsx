import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // Load the cart whenever the logged-in user changes
  useEffect(() => {
    if (!user) return setItems([]);
    api("/cart").then((c) => setItems(c.items)).catch(() => setItems([]));
  }, [user]);

  const addToCart = async (productId, quantity = 1) =>
    setItems((await api("/cart", { method: "POST", body: { productId, quantity } })).items);

  const updateQuantity = async (productId, quantity) =>
    setItems((await api(`/cart/${productId}`, { method: "PUT", body: { quantity } })).items);

  const removeItem = async (productId) =>
    setItems((await api(`/cart/${productId}`, { method: "DELETE" })).items);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.quantity * (i.product?.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, count, total, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const [error, setError] = useState("");

  const run = async (fn) => {
    setError("");
    try { await fn(); } catch (err) { setError(err.message); }
  };

  if (items.length === 0)
    return (
      <div className="page empty">
        <h1>Your cart is empty</h1>
        <p className="muted">Add a few things and they will show up here.</p>
        <Link to="/" className="btn btn-primary">Browse products</Link>
      </div>
    );

  return (
    <div className="page">
      <h1>Your cart</h1>
      {error && <p className="error">{error}</p>}

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map(({ product, quantity }) => (
            <li key={product._id} className="cart-row">
              <img src={product.image} alt={product.name} />
              <div className="cart-info">
                <h3>{product.name}</h3>
                <p className="muted small">{inr(product.price)} each</p>
                <button className="link-btn" onClick={() => run(() => removeItem(product._id))}>
                  Remove
                </button>
              </div>
              <div className="qty">
                <button
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => run(() => updateQuantity(product._id, quantity - 1))}
                >−</button>
                <span>{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => run(() => updateQuantity(product._id, quantity + 1))}
                >+</button>
              </div>
              <strong className="line-total">{inr(product.price * quantity)}</strong>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>{inr(total)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>Free</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{inr(total)}</span></div>
          <button className="btn btn-accent btn-block" onClick={() => alert("Checkout is not built yet")}>
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

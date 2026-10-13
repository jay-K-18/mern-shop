import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [state, setState] = useState("idle"); // idle | adding | added | error
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!user) return navigate("/login");
    setState("adding");
    setError("");
    try {
      await addToCart(product._id);
      setState("added");
      setTimeout(() => setState("idle"), 1500);
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  };

  const soldOut = product.stock === 0;

  return (
    <article className="card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="card-body">
        <p className="muted small">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="muted desc">{product.description}</p>
        <div className="card-foot">
          <strong className="price">₹{product.price.toLocaleString("en-IN")}</strong>
          <button
            className={`btn ${state === "added" ? "btn-done" : "btn-primary"}`}
            onClick={handleAdd}
            disabled={soldOut || state === "adding"}
          >
            {soldOut ? "Sold out" : state === "adding" ? "Adding…" : state === "added" ? "Added" : "Add to cart"}
          </button>
        </div>
        {state === "error" && <p className="error small">{error}</p>}
      </div>
    </article>
  );
}

import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Clothing", "Accessories", "Home", "Electronics"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-fetch when the filter changes (search is debounced by 300 ms)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const qs = new URLSearchParams({ category, search }).toString();
      api(`/products?${qs}`)
        .then((data) => { setProducts(data); setError(""); })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [category, search]);

  return (
    <div className="page">
      <section className="hero">
        <h1>Find something you will use every day.</h1>
        <input
          className="search"
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
      </section>

      <div className="chips" role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${c === category ? "chip-active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading products…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="muted">No products match. Try a different search or category.</p>
      )}

      <div className="grid">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}

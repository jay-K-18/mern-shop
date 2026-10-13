import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">haat</Link>
      <nav className="nav-links">
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">
          Cart {count > 0 && <span className="badge">{count}</span>}
        </NavLink>
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">Log in</Link>
        )}
      </nav>
    </header>
  );
}

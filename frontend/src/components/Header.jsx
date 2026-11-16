
import { Link } from "react-router-dom";

function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">QR</span>
          <span>Market MP</span>
        </Link>

        <nav className="header-nav">
          <Link to="/">Inicio</Link>
          <span className="cart-indicator">
            Carrito ({cartCount})
          </span>
        </nav>
      </div>
    </header>
  );
}

export default Header;

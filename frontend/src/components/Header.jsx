
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

          <Link to="/carrito" className="cart-indicator">
            Carrito ({cartCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

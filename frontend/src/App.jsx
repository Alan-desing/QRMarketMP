
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import "./styles/global.css";
import "./styles/catalog.css";
import "./styles/product.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product, quantity) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  product.stock,
                  item.quantity + quantity
                )
              }
            : item
        );
      }

      return [...currentItems, { ...product, quantity }];
    });
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<CatalogPage />} />

        <Route
          path="/productos/:id"
          element={<ProductPage onAddToCart={addToCart} />}
        />
      </Routes>

      <footer className="footer">
        <p>QRMarket MP © 2026. Todos los derechos reservados.</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;

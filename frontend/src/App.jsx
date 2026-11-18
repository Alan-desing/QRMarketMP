
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import "./styles/global.css";
import "./styles/catalog.css";
import "./styles/product.css";
import "./styles/cart.css";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./styles/login.css";
import "./styles/dashboard.css";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

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

      return [
        ...currentItems,
        { ...product, quantity }
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.stock, quantity))
            }
          : item
      )
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
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

        <Route
          path="/carrito"
          element={
            <CartPage
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          }
        />
        <Route path="/vendedor/login" element={<LoginPage />} />

        <Route
          path="/vendedor/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <footer className="footer">
        <p>QRMarket MP © 2026. Todos los derechos reservados.</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;

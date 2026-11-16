
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductById,
  getProductQR
} from "../services/productService.js";
import QRDisplay from "../components/QRDisplay.jsx";

function ProductPage({ onAddToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const [productData, qrResponse] = await Promise.all([
          getProductById(id),
          getProductQR(id)
        ]);

        setProduct(productData);
        setQrData(qrResponse);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    setQuantity(1);
    setMessage("");
  }, [id]);

  if (loading) {
    return <main className="page-container">Cargando producto...</main>;
  }

  if (error || !product) {
    return (
      <main className="page-container">
        <h2>Producto no encontrado</h2>
        <p>{error}</p>
        <Link to="/">Volver al catálogo</Link>
      </main>
    );
  }

  const outOfStock = product.stock === 0;

  const formattedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  function handleAddToCart() {
    onAddToCart(product, quantity);
    setMessage("Producto agregado correctamente.");
  }

  return (
    <main className="page-container">
      <Link to="/" className="back-link">
        ← Volver al catálogo
      </Link>

      <section className="product-detail">
        <div className="detail-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="detail-image"
          />
        </div>

        <div className="detail-information">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="detail-price">{formattedPrice}</p>

          <p className="detail-description">
            {product.description}
          </p>

          <p className={`stock-status ${outOfStock ? "out" : ""}`}>
            {outOfStock
              ? "Sin stock"
              : `${product.stock} unidades disponibles`}
          </p>

          {!outOfStock && (
            <>
              <label className="quantity-label" htmlFor="quantity">
                Cantidad
              </label>

              <div className="quantity-control">
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                className="add-cart-button"
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </button>

              {message && (
                <p className="success-message">{message}</p>
              )}
            </>
          )}

          <div className="detail-extra">
            <span>Compra segura con MercadoPago</span>
            <span>Producto identificado con QR único</span>
          </div>
        </div>
      </section>

      <QRDisplay qrData={qrData} />
    </main>
  );
}

export default ProductPage;

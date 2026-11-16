
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  validateCoupon,
  calculateShipping
} from "../services/purchaseService.js";

function CartPage({ cartItems, onUpdateQuantity, onRemove }) {
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shipping, setShipping] = useState(null);
  const [shippingError, setShippingError] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount = coupon
  ? Math.round(subtotal * coupon.percentage / 100)
  : 0;
  const shippingCost = shipping?.cost || 0;
  const total = subtotal - discount + shippingCost;

  useEffect(() => {
    setShipping(null);
    setShippingError("");
  }, [subtotal]);

  async function handleApplyCoupon(event) {
    event.preventDefault();

    setLoadingCoupon(true);
    setCouponError("");
    setCoupon(null);

    try {
      const result = await validateCoupon(couponCode, subtotal);
      setCoupon(result);
    } catch (error) {
      setCouponError(error.message);
    } finally {
      setLoadingCoupon(false);
    }
  }

  async function handleCalculateShipping(event) {
    event.preventDefault();

    setLoadingShipping(true);
    setShippingError("");
    setShipping(null);

    try {
      const result = await calculateShipping(postalCode, subtotal);
      setShipping(result);
    } catch (error) {
      setShippingError(error.message);
    } finally {
      setLoadingShipping(false);
    }
  }

  function formatPrice(price) {
    return price.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    });
  }

  if (cartItems.length === 0) {
    return (
      <main className="page-container empty-cart">
        <h1>Tu carrito está vacío</h1>
        <p>Explorá nuestro catálogo y encontrá lo que estás buscando.</p>
        <Link to="/" className="cart-primary-button">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="cart-heading">
        <h1>Mi carrito</h1>
        <p>Revisá tus productos antes de continuar.</p>
      </div>

      <div className="cart-layout">
        <section className="cart-products">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-information">
                <Link
                  to={`/productos/${item.id}`}
                  className="cart-item-name"
                >
                  {item.name}
                </Link>

                <p>{formatPrice(item.price)}</p>

                <span className="cart-stock">
                  Stock disponible: {item.stock}
                </span>

                <div className="cart-quantity">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-actions">
                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>

                <button
                  className="remove-item"
                  onClick={() => onRemove(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Resumen de compra</h2>

          <form onSubmit={handleApplyCoupon} className="cart-form">
            <label htmlFor="coupon">Cupón de descuento</label>

            <div className="cart-input-group">
              <input
                id="coupon"
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Ej: QR10"
                required
              />

              <button disabled={loadingCoupon}>
                {loadingCoupon ? "..." : "Aplicar"}
              </button>
            </div>

            {coupon && (
              <p className="form-success">
                Cupón aplicado: {coupon.percentage}% de descuento.
              </p>
            )}

            {couponError && (
              <p className="form-error">{couponError}</p>
            )}
          </form>

          <form onSubmit={handleCalculateShipping} className="cart-form">
            <label htmlFor="postalCode">Código postal</label>

            <div className="cart-input-group">
              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="Ej: 1638"
                maxLength={4}
                pattern="[0-9]{4}"
                required
              />

              <button disabled={loadingShipping}>
                {loadingShipping ? "..." : "Calcular"}
              </button>
            </div>

            {shipping && (
              <p className="form-success">{shipping.message}</p>
            )}

            {shippingError && (
              <p className="form-error">{shippingError}</p>
            )}
          </form>

          <div className="summary-divider" />

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="summary-row discount-row">
            <span>Descuento</span>
            <strong>- {formatPrice(discount)}</strong>
          </div>

          <div className="summary-row">
            <span>Envío</span>
            <strong>
              {shipping
                ? formatPrice(shippingCost)
                : "A calcular"}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <p className="checkout-notice">
            El proceso de pago se habilitará en el siguiente grupo.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default CartPage;

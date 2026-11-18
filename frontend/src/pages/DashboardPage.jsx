import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboard,
  logoutSeller
} from "../services/authService.js";
import "../styles/dashboard.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(amount);

const statusLabels = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  EXPIRED: "Expirado",
  ACTION_REQUIRED: "Requiere acción"
};

function DashboardPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handleLogout() {
    logoutSeller();
    navigate("/vendedor/login");
  }

  if (loading) {
    return (
      <main className="dashboard-container">
        <p>Cargando dashboard...</p>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="dashboard-container">
        <p className="dashboard-error">
          {error || "No se pudo cargar el dashboard."}
        </p>

        <button onClick={() => navigate("/vendedor/login")}>
          Volver al login
        </button>
      </main>
    );
  }

  const { seller, summary, products, orders } = dashboard;

  return (
    <main className="dashboard-container">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Panel de administración</p>
          <h1>Dashboard de vendedor</h1>
          <p>Bienvenido, {seller.username}</p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </section>

      <section className="dashboard-summary">
        <article className="summary-card">
          <span>Productos</span>
          <strong>{summary.totalProducts}</strong>
        </article>

        <article className="summary-card">
          <span>Órdenes recibidas</span>
          <strong>{summary.totalOrders}</strong>
        </article>

        <article className="summary-card">
          <span>Ventas realizadas</span>
          <strong>{summary.completedSales}</strong>
        </article>

        <article className="summary-card">
          <span>Ingresos por ventas</span>
          <strong>{formatPrice(summary.totalRevenue)}</strong>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Productos</h2>
          <span>{products.length} productos registrados</span>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image} alt={product.name} />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={product.stock > 0 ? "stock-available" : "stock-empty"}>
                      {product.stock > 0
                        ? `${product.stock} unidades`
                        : "Sin stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Órdenes recibidas</h2>
          <span>{orders.length} órdenes registradas</span>
        </div>

        {orders.length === 0 ? (
          <p className="dashboard-empty">
            Todavía no hay órdenes registradas.
          </p>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td title={order.id}>
                      {order.id.slice(0, 8)}...
                    </td>
                    <td>
                      {new Date(
                        `${order.created_at.replace(" ", "T")}Z`
                      ).toLocaleString("es-AR")}
                    </td>
                    <td>
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <span className={`order-status status-${order.status.toLowerCase()}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
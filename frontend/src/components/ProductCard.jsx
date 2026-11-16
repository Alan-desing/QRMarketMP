
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const outOfStock = product.stock === 0;

  return (
    <article className="product-card">
      <Link
        to={`/productos/${product.id}`}
        className="product-image-link"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-card-content">
        <span className="product-category">
          {product.category}
        </span>

        <Link
          to={`/productos/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <p className="product-price">
          {product.price.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
          })}
        </p>

        <span className={`stock-status ${outOfStock ? "out" : ""}`}>
          {outOfStock ? "Sin stock" : `${product.stock} disponibles`}
        </span>

        <Link
          to={`/productos/${product.id}`}
          className="product-link"
        >
          Ver producto
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;

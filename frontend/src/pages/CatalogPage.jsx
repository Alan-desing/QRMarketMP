
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import ProductCard from "../components/ProductCard.jsx";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <main className="page-container">Cargando productos...</main>;
  }

  if (error) {
    return <main className="page-container error-message">{error}</main>;
  }

  return (
    <main className="page-container">
      <section className="catalog-hero">
        <span className="hero-label">QRMarket MP</span>
        <h1>Encontrá lo que necesitás</h1>
        <p>
          Explorá nuestros productos y descubrí una nueva forma de comprar.
        </p>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <h2>Nuestros productos</h2>
            <p>{products.length} productos disponibles en el catálogo</p>
          </div>
        </div>

        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CatalogPage;

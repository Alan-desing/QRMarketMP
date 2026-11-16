
import products from "../database/products.js";

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

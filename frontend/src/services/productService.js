
const API_URL = "http://localhost:3000/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo encontrar el producto");
  }

  return response.json();
}

export async function getProductQR(id) {
  const response = await fetch(`${API_URL}/products/${id}/qr`);

  if (!response.ok) {
    throw new Error("No se pudo generar el código QR");
  }

  return response.json();
}

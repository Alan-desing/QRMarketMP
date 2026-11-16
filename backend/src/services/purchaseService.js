
const API_URL = "http://localhost:3000/api/purchase";

export async function validateCoupon(code, subtotal) {
  const response = await fetch(`${API_URL}/coupons/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code, subtotal })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo validar el cupón.");
  }

  return data;
}

export async function calculateShipping(postalCode, subtotal) {
  const response = await fetch(`${API_URL}/shipping/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ postalCode, subtotal })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo calcular el envío.");
  }

  return data;
}

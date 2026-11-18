
const API_URL = "http://localhost:3000/api/orders";

export async function createOrder(orderData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo crear el pedido.");
  }

  return data.order;
}

export async function startOrderPayment(orderId) {
  const response = await fetch(`${API_URL}/${orderId}/payment`, {
    method: "POST"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar el pago.");
  }

  return data;
}

export function getOrderPaymentQrUrl(orderId) {
  return `${API_URL}/${orderId}/payment/qr`;
}

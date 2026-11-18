const API_URL = "http://localhost:3000/api";

export async function loginSeller(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar sesión");
  }

  localStorage.setItem("sellerToken", data.token);

  return data.seller;
}

export async function getDashboard() {
  const token = localStorage.getItem("sellerToken");

  const response = await fetch(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("sellerToken");
    }

    throw new Error(data.message || "No se pudo cargar el dashboard");
  }

  return data;
}

export function logoutSeller() {
  localStorage.removeItem("sellerToken");
}
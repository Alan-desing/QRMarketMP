import { getSellerDashboard } from "../services/dashboardService.js";

export function getDashboard(req, res) {
  try {
    const dashboard = getSellerDashboard();

    return res.json({
      seller: {
        id: req.seller.id,
        username: req.seller.username
      },
      ...dashboard
    });
  } catch (error) {
    console.error("Error al obtener el dashboard:", error);

    return res.status(500).json({
      message: "No se pudo obtener la información del dashboard"
    });
  }
}
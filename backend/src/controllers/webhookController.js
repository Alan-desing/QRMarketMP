import {
  getOrderById,
  updateOrderStatus,
  updateOrderMpStatus
} from "../database/orderRepository.js";

import {
  validateWebhookSignature,
  getMercadoPagoOrder,
  mapMercadoPagoStatus
} from "../services/mercadoPagoWebhookService.js";

export async function handleMercadoPagoWebhook(req, res) {
  try {
    const eventType = req.query.type || req.body.type;
    const dataId = req.query["data.id"] || req.body.data?.id;

    if (eventType !== "order" || !dataId) {
      return res.sendStatus(200);
    }

    const isValid = validateWebhookSignature({
      xSignature: req.headers["x-signature"],
      xRequestId: req.headers["x-request-id"],
      dataId,
      secret: process.env.MP_WEBHOOK_SECRET
    });

    if (!isValid) {
      return res.status(401).json({
        message: "Firma de notificación inválida."
      });
    }

    const mpOrder = await getMercadoPagoOrder(dataId);

    const localOrder = getOrderById(mpOrder.external_reference);

    if (!localOrder || localOrder.mp_order_id !== mpOrder.id) {
      return res.sendStatus(404);
    }

    const localStatus = mapMercadoPagoStatus(mpOrder.status);

    updateOrderMpStatus(localOrder.id, mpOrder.status);

    if (localStatus) {
      updateOrderStatus(localOrder.id, localStatus);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error al procesar webhook:", error.message);

    return res.status(500).json({
      message: "No se pudo procesar la notificación."
    });
  }
}
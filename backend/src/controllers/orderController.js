
import { createPurchaseOrder } from "../services/orderService.js";
import { createMercadoPagoOrder } from "../services/mercadoPagoService.js";
import {
  getOrderById,
  updateOrderPayment
} from "../database/orderRepository.js";
import QRCode from "qrcode";

export function createOrder(req, res) {
  try {
    const order = createPurchaseOrder(req.body);

    res.status(201).json({
      message: "Pedido creado correctamente.",
      order
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

export function getOrder(req, res) {
  const order = getOrderById(req.params.id);

  if (!order) {
    return res.status(404).json({
      message: "Pedido no encontrado."
    });
  }

  res.json(order);
}

export async function startOrderPayment(req, res) {
  try {
    const order = getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado."
      });
    }

    if (order.mp_order_id && order.checkout_url) {
      return res.json({
        message: "El pedido ya tiene una orden de pago.",
        checkoutUrl: order.checkout_url
      });
    }

    const mpOrder = await createMercadoPagoOrder(order);

    if (!mpOrder.id || !mpOrder.checkout_url) {
      throw new Error(
        "Mercado Pago no devolvió los datos necesarios para continuar."
      );
    }

    const updatedOrder = updateOrderPayment(order.id, {
      mpOrderId: mpOrder.id,
      mpStatus: mpOrder.status,
      checkoutUrl: mpOrder.checkout_url
    });

    res.status(201).json({
      message: "Orden de pago creada correctamente.",
      checkoutUrl: mpOrder.checkout_url,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error al iniciar el pago:", error.message);

    res.status(502).json({
      message: "No se pudo iniciar el pago con Mercado Pago."
    });
  }
}

export async function getOrderPaymentQr(req, res) {
  const order = getOrderById(req.params.id);

  if (!order) {
    return res.status(404).json({
      message: "Pedido no encontrado."
    });
  }

  if (!order.checkout_url) {
    return res.status(409).json({
      message: "El pedido todavía no tiene un enlace de pago."
    });
  }

  try {
    const qrImage = await QRCode.toBuffer(order.checkout_url, {
      type: "png",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300
    });

    res.type("png").send(qrImage);
  } catch (error) {
    console.error("Error al generar el QR:", error.message);

    res.status(500).json({
      message: "No se pudo generar el código QR."
    });
  }
}
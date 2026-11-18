import crypto from "node:crypto";

export function validateWebhookSignature({
  xSignature,
  xRequestId,
  dataId,
  secret
}) {
  if (!xSignature || !xRequestId || !dataId || !secret) {
    return false;
  }

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => {
      const [key, value] = part.trim().split("=");
      return [key, value];
    })
  );

  const timestamp = parts.ts;
  const receivedHash = parts.v1;

  if (!timestamp || !receivedHash) {
    return false;
  }

  const manifest =
    `id:${dataId};request-id:${xRequestId};ts:${timestamp};`;

  const calculatedHash = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  const receivedBuffer = Buffer.from(receivedHash, "hex");
  const calculatedBuffer = Buffer.from(calculatedHash, "hex");

  if (
    receivedBuffer.length !== calculatedBuffer.length ||
    receivedBuffer.length === 0
  ) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, calculatedBuffer);
}

export async function getMercadoPagoOrder(orderId) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mercado Pago respondió con el estado ${response.status}.`
    );
  }

  return response.json();
}

export function mapMercadoPagoStatus(status) {
  const statusMap = {
    created: "PENDING_PAYMENT",
    processed: "PAID",
    canceled: "CANCELLED",
    refunded: "REFUNDED",
    expired: "EXPIRED",
    action_required: "ACTION_REQUIRED"
  };

  return statusMap[status] || null;
}
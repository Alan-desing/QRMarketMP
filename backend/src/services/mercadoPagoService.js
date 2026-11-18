
import { MercadoPagoConfig, Order } from "mercadopago";

export async function createMercadoPagoOrder(localOrder) {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("No está configurado MP_ACCESS_TOKEN.");
  }

  const client = new MercadoPagoConfig({
    accessToken
  });

  const orderClient = new Order(client);

  const body = {
    type: "online",
    processing_mode: "manual",
    capture_mode: "automatic_async",
    total_amount: localOrder.total.toFixed(2),
    external_reference: localOrder.id,
    description: `Compra QRMarketMP - Pedido ${localOrder.id}`,
    items: [
      {
        title: `Compra QRMarketMP - ${localOrder.items.length} producto(s)`,
        quantity: 1,
        unit_price: localOrder.total.toFixed(2)
      }
    ]
  };

  return orderClient.create({
    body,
    requestOptions: {
      idempotencyKey: localOrder.id
    }
  });
}


import db from "./connection.js";

const insertOrder = db.prepare(`
  INSERT INTO orders (
    id,
    subtotal,
    discount,
    shipping_cost,
    total,
    coupon_code,
    postal_code
  )
  VALUES (
    @id,
    @subtotal,
    @discount,
    @shippingCost,
    @total,
    @couponCode,
    @postalCode
  )
`);

const insertOrderItem = db.prepare(`
  INSERT INTO order_items (
    order_id,
    product_id,
    product_name,
    unit_price,
    quantity,
    line_total
  )
  VALUES (
    @orderId,
    @productId,
    @productName,
    @unitPrice,
    @quantity,
    @lineTotal
  )
`);

const saveOrderTransaction = db.transaction((order) => {
  insertOrder.run(order);

  for (const item of order.items) {
    insertOrderItem.run({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.unitPrice * item.quantity
    });
  }
});

export function createOrder(order) {
  saveOrderTransaction(order);
  return getOrderById(order.id);
}

export function getOrderById(id) {
  const order = db.prepare(`
    SELECT *
    FROM orders
    WHERE id = ?
  `).get(id);

  if (!order) {
    return null;
  }

  const items = db.prepare(`
    SELECT
      product_id AS productId,
      product_name AS productName,
      unit_price AS unitPrice,
      quantity,
      line_total AS lineTotal
    FROM order_items
    WHERE order_id = ?
  `).all(id);

  return {
    ...order,
    items
  };
}

export function updateOrderPayment(id, payment) {
  const result = db.prepare(`
    UPDATE orders
    SET
      mp_order_id = @mpOrderId,
      mp_status = @mpStatus,
      checkout_url = @checkoutUrl,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    id,
    mpOrderId: payment.mpOrderId,
    mpStatus: payment.mpStatus,
    checkoutUrl: payment.checkoutUrl
  });

  return result.changes > 0 ? getOrderById(id) : null;
}

export function updateOrderStatus(id, status) {
  const result = db.prepare(`
    UPDATE orders
    SET
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, id);

  return result.changes > 0 ? getOrderById(id) : null;
}

export function updateOrderMpStatus(id, mpStatus) {
  const result = db.prepare(`
    UPDATE orders
    SET mp_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(mpStatus, id);

  return result.changes > 0 ? getOrderById(id) : null;
}

export function getAllOrders() {
  const orders = db.prepare(`
    SELECT *
    FROM orders
    ORDER BY created_at DESC
  `).all();

  const getItems = db.prepare(`
    SELECT
      product_id AS productId,
      product_name AS productName,
      unit_price AS unitPrice,
      quantity,
      line_total AS lineTotal
    FROM order_items
    WHERE order_id = ?
  `);

  return orders.map((order) => ({
    ...order,
    items: getItems.all(order.id)
  }));
}
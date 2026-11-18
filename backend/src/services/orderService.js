
import { randomUUID } from "node:crypto";
import products from "../database/products.js";
import { validateCoupon } from "./couponService.js";
import { calculateShipping } from "./shippingService.js";
import { createOrder } from "../database/orderRepository.js";

export function createPurchaseOrder(data) {
  const { items, couponCode, postalCode } = data;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  const orderItems = [];

  for (const item of items) {
    const product = products.find(
      (product) => product.id === String(item.productId)
    );

    const quantity = Number(item.quantity);

    if (!product) {
      throw new Error(`El producto ${item.productId} no existe.`);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("La cantidad de un producto no es válida.");
    }

    if (quantity > product.stock) {
      throw new Error(
        `No hay stock suficiente para ${product.name}.`
      );
    }

    orderItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity
    });
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const couponResult = validateCoupon(couponCode, subtotal);

    if (!couponResult.valid) {
      throw new Error(couponResult.message);
    }

    discount = couponResult.discount;
    appliedCoupon = couponResult.code;
  }

  if (typeof postalCode !== "string") {
    throw new Error("El código postal es obligatorio.");
  }

  const shippingResult = calculateShipping(postalCode.trim(), subtotal);

  if (!shippingResult.valid) {
    throw new Error(shippingResult.message);
  }

  const total = subtotal - discount + shippingResult.cost;

  if (total <= 0) {
    throw new Error("El total de la compra no es válido.");
  }

  const order = {
    id: randomUUID(),
    subtotal,
    discount,
    shippingCost: shippingResult.cost,
    total,
    couponCode: appliedCoupon,
    postalCode: postalCode.trim(),
    items: orderItems
  };

  return createOrder(order);
}

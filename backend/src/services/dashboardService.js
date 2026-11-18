import { getAllProducts } from "./productService.js";
import { getAllOrders } from "../database/orderRepository.js";

export function getSellerDashboard() {
  const products = getAllProducts();
  const orders = getAllOrders();

  const paidOrders = orders.filter(
    (order) => order.status === "PAID"
  );

  const totalSales = paidOrders.reduce(
    (total, order) => total + order.total,
    0
  );

  return {
    summary: {
      totalProducts: products.length,
      totalOrders: orders.length,
      completedSales: paidOrders.length,
      totalRevenue: totalSales
    },
    products,
    orders
  };
}
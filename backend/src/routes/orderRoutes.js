import { Router } from "express";
import {
  createOrder,
  getOrder,
  startOrderPayment,
  getOrderPaymentQr
} from "../controllers/orderController.js";

const router = Router();

router.post("/", createOrder);
router.post("/:id/payment", startOrderPayment);
router.get("/:id/payment/qr", getOrderPaymentQr);
router.get("/:id", getOrder);

export default router;
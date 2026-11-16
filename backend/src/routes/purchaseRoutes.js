
import { Router } from "express";
import {
  checkCoupon,
  checkShipping
} from "../controllers/purchaseController.js";

const router = Router();

router.post("/coupons/validate", checkCoupon);
router.post("/shipping/calculate", checkShipping);

export default router;

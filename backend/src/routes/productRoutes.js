
import { Router } from "express";
import {
  getProducts,
  getProduct,
  getProductQR
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id/qr", getProductQR);
router.get("/:id", getProduct);

export default router;

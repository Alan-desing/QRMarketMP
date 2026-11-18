import { Router } from "express";
import {
  registerSeller,
  login
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerSeller);
router.post("/login", login);
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    seller: req.seller
  });
});

export default router;
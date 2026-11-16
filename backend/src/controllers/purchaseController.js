
import { validateCoupon } from "../services/couponService.js";
import { calculateShipping } from "../services/shippingService.js";

export function checkCoupon(req, res) {
  const { code, subtotal } = req.body;

  if (typeof code !== "string") {
    return res.status(400).json({
      message: "El código del cupón es obligatorio."
    });
  }

  const result = validateCoupon(code, Number(subtotal));

  if (!result.valid) {
    return res.status(400).json(result);
  }

  res.json(result);
}

export function checkShipping(req, res) {
  const { postalCode, subtotal } = req.body;

  if (typeof postalCode !== "string") {
    return res.status(400).json({
      message: "El código postal es obligatorio."
    });
  }

  const result = calculateShipping(postalCode.trim(), Number(subtotal));

  if (!result.valid) {
    return res.status(400).json(result);
  }

  res.json(result);
}

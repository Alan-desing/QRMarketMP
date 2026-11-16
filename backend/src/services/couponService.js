
const coupons = {
  QR10: {
    code: "QR10",
    percentage: 10,
    active: true
  },
  QR20: {
    code: "QR20",
    percentage: 20,
    active: true
  }
};

export function validateCoupon(code, subtotal) {
  const coupon = coupons[code.trim().toUpperCase()];

  if (!coupon || !coupon.active) {
    return {
      valid: false,
      message: "El cupón ingresado no es válido."
    };
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return {
      valid: false,
      message: "El subtotal no es válido."
    };
  }

  const discount = Math.round(subtotal * coupon.percentage / 100);

  return {
    valid: true,
    code: coupon.code,
    percentage: coupon.percentage,
    discount
  };
}

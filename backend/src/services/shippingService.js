
const FREE_SHIPPING_MINIMUM = 100000;

const shippingZones = [
  {
    name: "Zona cercana",
    postalCodes: ["1638", "1636", "1602"],
    cost: 3500
  },
  {
    name: "Zona intermedia",
    postalCodes: ["1000", "1425", "1406"],
    cost: 5000
  },
  {
    name: "Zona extendida",
    postalCodes: ["2000", "3000", "4000"],
    cost: 8000
  }
];

export function calculateShipping(postalCode, subtotal) {
  if (!/^\d{4}$/.test(postalCode)) {
    return {
      valid: false,
      message: "Ingresá un código postal de 4 dígitos."
    };
  }

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return {
      valid: false,
      message: "El subtotal no es válido."
    };
  }

  if (subtotal >= FREE_SHIPPING_MINIMUM) {
    return {
      valid: true,
      zone: null,
      cost: 0,
      freeShipping: true,
      message: "¡Tu compra tiene envío gratis!"
    };
  }

  const zone = shippingZones.find((item) =>
    item.postalCodes.includes(postalCode)
  );

  if (!zone) {
    return {
      valid: false,
      message: "Todavía no tenemos tarifas configuradas para ese código postal."
    };
  }

  return {
    valid: true,
    zone: zone.name,
    cost: zone.cost,
    freeShipping: false,
    message: `Envío correspondiente a ${zone.name}.`
  };
}

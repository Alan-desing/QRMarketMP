
import QRCode from "qrcode";
import {
  getAllProducts,
  getProductById
} from "../services/productService.js";

export function getProducts(req, res) {
  const products = getAllProducts();

  res.json(products);
}

export function getProduct(req, res) {
  const product = getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Producto no encontrado"
    });
  }

  res.json(product);
}

export async function getProductQR(req, res) {
  try {
    const product = getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const productUrl = `${frontendUrl}/productos/${product.id}`;

    const qrCode = await QRCode.toDataURL(productUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });

    res.json({
      productId: product.id,
      productUrl,
      qrCode
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el código QR"
    });
  }
}

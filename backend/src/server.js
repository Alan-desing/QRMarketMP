
import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", webhookRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "QRMarket MP API funcionando"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import productsRoute from "./routes/products.js";
import leadsRoute from "./routes/leads.js";
import pdfRoute from "./routes/pdf.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/products", productsRoute);
app.use("/leads", leadsRoute);
app.use("/pdf", pdfRoute);

// root
app.get("/", (req, res) => res.send("Inventory API running"));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Failed to connect DB:", err);
  });

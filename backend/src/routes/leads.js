// backend/src/routes/leads.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Update only leads (sales page uses this)
router.put("/:id", async (req, res) => {
  try {
    const { green, yellow, red } = req.body;
    // merge with existing leads to avoid overwriting with undefined
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.leads.green = typeof green === "number" ? green : product.leads.green;
    product.leads.yellow = typeof yellow === "number" ? yellow : product.leads.yellow;
    product.leads.red = typeof red === "number" ? red : product.leads.red;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

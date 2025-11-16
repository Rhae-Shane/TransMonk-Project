// backend/src/routes/pdf.js
import express from "express";
import PDFDocument from "pdfkit";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });

    const doc = new PDFDocument({
      size: "A4",
      margin: 40
    });

    // response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=inventory.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Inventory Report", { align: "center" });
    doc.moveDown(1);

    // small meta
    const now = new Date().toLocaleString();
    doc.fontSize(9).text(`Generated: ${now}`, { align: "right" });
    doc.moveDown(0.5);

    // iterate products: compact vertical block for each
    products.forEach((p, idx) => {
      // product title line (number + name)
      doc.fontSize(12).text(`${idx + 1}. ${p.name}`, { underline: false });
      doc.moveDown(0.15);

      // one line small description (wraps if long)
      if (p.description) {
        doc.fontSize(10).text(`${p.description}`, { continued: false });
        doc.moveDown(0.15);
      }

      // small detail lines (compact)
      const details = 
        `Ready: ${p.ready} | Production: ${p.production} | UnderShipment: ${p.underShipment}`;
      doc.fontSize(9).text(details);

      const details2 =
        `Shipment: ${p.shipmentType || "N/A"} | Shipment Date: ${p.expectedShipmentDate || "N/A"}`;
      doc.fontSize(9).text(details2);

      const leads = `Leads → Green: ${p.leads.green}, Yellow: ${p.leads.yellow}, Red: ${p.leads.red}`;
      doc.fontSize(9).text(leads);

      // divider
      doc.moveDown(0.5);
      const y = doc.y;
      doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).strokeColor("#dddddd").stroke();
      doc.moveDown(0.6);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

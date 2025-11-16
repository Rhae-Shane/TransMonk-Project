
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // optional description field
  description: { type: String, default: "" },

  ready: { type: Number, default: 0 },
  production: { type: Number, default: 0 },
  underShipment: { type: Number, default: 0 },

  expectedShipmentDate: { type: String, default: "" }, // store as ISO date string or empty
  shipmentType: { type: String, enum: ["air", "water", ""], default: "" },

  leads: {
    green: { type: Number, default: 0 },
    yellow: { type: Number, default: 0 },
    red: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

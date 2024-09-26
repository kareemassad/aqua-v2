import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serial_number: { type: String },
  cost_price: { type: Number, required: true },
  sell_price: { type: Number, required: true },
  image: { type: String },
  inventory: { type: Number, default: 0 },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  logo: String,
  active_links: { type: Number, default: 0 },
  pending_orders: { type: Number, default: 0 },
  total_sales: { type: Number, default: 0 },
  // ... other existing fields
}, { timestamps: true });

export default mongoose.models.Store || mongoose.model("Store", StoreSchema);
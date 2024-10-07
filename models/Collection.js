import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    unique_link: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
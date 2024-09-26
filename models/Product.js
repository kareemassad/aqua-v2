import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const ProductSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    sell_price: {
      type: Number,
      required: true,
    },
    inventory: {
      type: Number,
      default: 0,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    // Add other necessary fields
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ProductSchema.plugin(toJSON);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
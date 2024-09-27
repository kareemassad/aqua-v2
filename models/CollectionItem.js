import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// SHARED LIST ITEM SCHEMA
const collectionItemSchema = mongoose.Schema(
  {
    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    custom_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts mongoose to json
collectionItemSchema.plugin(toJSON);

export default mongoose.models.CollectionItem || mongoose.model("CollectionItem", collectionItemSchema);
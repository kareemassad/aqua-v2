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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts mongoose to json
collectionItemSchema.plugin(toJSON);

// Ensure a product is unique within a collection
collectionItemSchema.index({ collection_id: 1, product_id: 1 }, { unique: true });

export default mongoose.models.CollectionItem || mongoose.model("CollectionItem", collectionItemSchema);
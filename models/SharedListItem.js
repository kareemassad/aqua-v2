import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// SHARED LIST ITEM SCHEMA
const sharedListItemSchema = mongoose.Schema(
  {
    shared_list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SharedList",
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
sharedListItemSchema.plugin(toJSON);

export default mongoose.models.SharedListItem || mongoose.model("SharedListItem", sharedListItemSchema);
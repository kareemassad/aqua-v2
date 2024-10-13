import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// PAYMENT SCHEMA
const paymentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },
    payment_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

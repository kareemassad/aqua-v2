import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    stripeId: { type: String }, // New Field for Stripe's profile.sub
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add pre-save hook to check if the associated account exists
userSchema.pre('save', async function(next) {
  if (this.isNew && this.account) {
    const Account = mongoose.model('Account');
    const accountExists = await Account.exists({ _id: this.account });
    if (!accountExists) {
      next(new Error('Associated account does not exist'));
    }
  }
  next();
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model('User', userSchema);
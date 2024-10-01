import mongoose from "mongoose";
import bcrypt from "bcrypt";

const CollectionSchema = new mongoose.Schema(
  {
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true },
    unique_share_url: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    expiration_date: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
CollectionSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare password
CollectionSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
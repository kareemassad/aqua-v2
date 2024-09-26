import mongoose from "mongoose";

const ContactInfoSchema = new mongoose.Schema({
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
});

const StoreSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  contact_info: { type: ContactInfoSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.models.Store || mongoose.model('Store', StoreSchema);
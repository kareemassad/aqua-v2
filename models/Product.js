import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    name: { type: String, required: true },
    sell_price: { type: Number, required: true },
    cost_price: { type: Number, required: true },
    inventory: { type: Number, default: 0 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema)

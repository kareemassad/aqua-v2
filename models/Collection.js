import mongoose from 'mongoose'

const UniqueLinkSchema = new mongoose.Schema({
  linkId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  clickCount: { type: Number, default: 0 },
  lastClickedAt: Date
})

const CollectionSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    uniqueLinks: [UniqueLinkSchema]
  },
  { timestamps: true }
)

export default mongoose.models.Collection ||
  mongoose.model('Collection', CollectionSchema)

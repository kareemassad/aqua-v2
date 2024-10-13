import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  linkId: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: false },
  clickCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastClickedAt: { type: Date }
})

export default mongoose.models.Link || mongoose.model('Link', LinkSchema)

import mongoose from 'mongoose'
import toJSON from './plugins/toJSON'

// SUBSCRIPTION SCHEMA
const subscriptionSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    billing_cycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true
    },
    features: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
)

// Add plugin that converts mongoose to json
subscriptionSchema.plugin(toJSON)

export default mongoose.models.Subscription ||
  mongoose.model('Subscription', subscriptionSchema)

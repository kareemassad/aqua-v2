import mongoose from 'mongoose'

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    provider: String,
    providerAccountId: String
    // Add other fields as necessary
  },
  { timestamps: true }
)

const Account =
  mongoose.models.Account || mongoose.model('Account', AccountSchema)

export default Account

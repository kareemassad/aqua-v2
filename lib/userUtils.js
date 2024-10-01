import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";
import User from "@/models/User"; // Ensure User is imported

export async function createStoreForUser(userId, userName) {
  await connectMongo();
  
  const newStore = await Store.create({
    user_id: userId,
    name: `${userName}'s Store`,
    description: 'Welcome to my store!'
  });

  // Update the user document with the storeId
  await User.findOneAndUpdate(
    { email: userId },
    { $set: { storeId: newStore._id } }
  );

  return newStore;
}
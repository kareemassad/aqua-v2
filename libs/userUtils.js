import connectMongo from "@/libs/mongoose";
import Store from "@/models/Store";
import { v4 as uuidv4 } from "uuid";

export async function createStoreForUser(userId, userName) {
  await connectMongo();
  
  // Check if a store already exists for this user
  const existingStore = await Store.findOne({ user_id: userId });
  if (existingStore) {
    return existingStore;
  }

  // Create a new store
  const newStore = await Store.create({
    user_id: userId,
    name: `${userName}'s Store`,
    description: 'Welcome to my store!',
    store_id: uuidv4(), // Generate a unique store ID
  });

  return newStore;
}
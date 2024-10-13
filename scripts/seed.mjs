// npx tsx scripts/seed.mjs

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient, ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()

    // Clear existing data
    const collections = ['users', 'accounts', 'stores', 'products']
    for (const collectionName of collections) {
      await db.collection(collectionName).deleteMany({})
      console.log(`Cleared ${collectionName} collection`)
    }

    // Seed Users
    /*
		const userId = "clhrlpinp0000qxkahsiu3m83"; // Use a consistent ID
		const user = {
			_id: userId,
			name: "Kareem Assad",
			email: "kareemassad5@gmail.com",
			image: "https://lh3.googleusercontent.com/a-/AOh14Gh...",
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.collection('users').insertOne(user);
		console.log("Seeded Users");

		// Seed Accounts
		const account = {
			userId: userId,
			type: "oauth",
			provider: "google",
			providerAccountId: "123456789",
			access_token: "ya29.a0AfH6SMBx...",
			expires_at: 1234567890,
			scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
			token_type: "Bearer",
			id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6I...",
		};
		await db.collection('accounts').insertOne(account);
		console.log("Seeded Accounts");

		// Seed Stores
		const store = {
			user_id: userId,
			name: `Store of ${user.name}`,
			description: 'Default store description',
			logo: '',
			contact_info: {
				phone: '',
				email: '',
			},
			createdAt: new Date(),
			updatedAt: new Date()
		};
		const storeResult = await db.collection('stores').insertOne(store);
		console.log("Seeded Stores");

		// Seed Products
		const products = [
			{
				product_id: uuidv4(),
				name: "Product 1",
				description: "Description for Product 1",
				price: 19.99,
				store_id: storeResult.insertedId,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				product_id: uuidv4(),
				name: "Product 2",
				description: "Description for Product 2",
				price: 29.99,
				store_id: storeResult.insertedId,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		];

		await db.collection('products').insertMany(products);
		console.log("Seeded Products");

		console.log("Database seeding completed successfully");
		*/
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
    process.exit()
  }
}

seedDatabase()

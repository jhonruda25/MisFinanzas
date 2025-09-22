const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const users = [
  {
    userId: "user_001",
    name: "Ana García",
    email: "ana.garcia@example.com",
    // In a real application, you should hash passwords with bcrypt
    passwordHash: "password123", // Storing plain text for demonstration
    role: "admin",
    createdAt: new Date("2025-09-22T08:30:00Z")
  }
];

async function connectWithRetry(client, maxRetries = 5, retryDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed. Retrying in ${retryDelay / 1000}s...`);
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
  throw new Error("Could not connect to MongoDB after multiple retries.");
}

async function seedDB() {
  const uri = 'mongodb://localhost:27017/mis-finanzas';
  const client = new MongoClient(uri);

  try {
    await connectWithRetry(client);

    const database = client.db();

    // Clear existing data
    await database.collection('users').deleteMany({});

    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.passwordHash, 10);
      return { ...user, passwordHash };
    }));

    // Insert new data
    await database.collection('users').insertMany(usersWithHashedPasswords);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

seedDB();

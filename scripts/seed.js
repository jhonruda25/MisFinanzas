const { MongoClient } = require('mongodb');

const users = [
  {
    _id: "user_001", // Use _id for MongoDB's default primary key
    name: "Ana García",
    email: "ana.garcia@example.com",
    // In a real application, you should hash passwords with bcrypt
    passwordHash: "password123", // Storing plain text for demonstration
    role: "admin",
    createdAt: new Date("2025-09-22T08:30:00Z")
  }
];

async function seedDB() {
  const uri = 'mongodb://localhost:27017/mis-finanzas';
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db();

    // Clear existing data
    await database.collection('users').deleteMany({});

    // Insert new data
    await database.collection('users').insertMany(users);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

seedDB();

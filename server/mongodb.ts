import { MongoClient, Db } from "mongodb";

// Initialize MongoDB connection
let client: MongoClient | null = null;
let db: Db | null = null;

if (process.env.DATABASE_URL) {
  try {
    client = new MongoClient(process.env.DATABASE_URL);
    // Don't connect immediately, connect lazily when needed
    console.log("✅ MongoDB client initialized");
  } catch (error) {
    console.error("❌ Failed to initialize MongoDB client:", error);
  }
} else {
  console.log(
    "ℹ️ DATABASE_URL not provided - database operations will be unavailable"
  );
}

// Get database instance
export async function getDatabase(): Promise<Db | null> {
  if (!client) {
    console.log("ℹ️ No MongoDB client available");
    return null;
  }

  if (!db) {
    try {
      await client.connect();
      db = client.db("a2s_db"); // Use specific database name
      console.log("✅ Connected to MongoDB database");
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB:", error);
      return null;
    }
  }

  return db;
}

// Export the client for use in other files
export { client };

// Database connection test function
export async function testDatabaseConnection(): Promise<boolean> {
  if (!client) {
    console.log("ℹ️ No MongoDB connection available to test");
    return false;
  }

  try {
    // Test connection by pinging the database
    const database = await getDatabase();
    if (database) {
      await database.command({ ping: 1 });
      console.log("✅ MongoDB connection successful");
      return true;
    } else {
      console.error("❌ Failed to get database instance");
      return false;
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

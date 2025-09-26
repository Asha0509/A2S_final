import { drizzle } from "drizzle-orm/neon-serverless";
import {
  users,
  properties,
  roomDesigns,
  consultants,
  bookings,
  aiChats,
  savedProperties,
  furnitureItems,
  cartItems,
  orders,
} from "@shared/schema";

// Initialize database connection only if DATABASE_URL is available
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    db = drizzle(process.env.DATABASE_URL);
    console.log("✅ Database client initialized");
  } catch (error) {
    console.error("❌ Failed to initialize database client:", error);
  }
} else {
  console.log(
    "ℹ️ DATABASE_URL not provided - database operations will be unavailable"
  );
}

// Export the database instance (may be null)
export { db };

// Export all table schemas for easy access
export {
  users,
  properties,
  roomDesigns,
  consultants,
  bookings,
  aiChats,
  savedProperties,
  furnitureItems,
  cartItems,
  orders,
};

// Database connection test function
export async function testDatabaseConnection() {
  if (!db) {
    console.log("ℹ️ No database connection available to test");
    return false;
  }

  try {
    // Simple query to test connection
    const result = await db.select().from(users).limit(1);
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

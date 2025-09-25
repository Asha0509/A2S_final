import { getDatabase } from "./mongodb";
import { log } from "./vite";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    log("🌱 Starting MongoDB database seeding...");

    const db = await getDatabase();
    if (!db) {
      log("No database connection available for seeding");
      return;
    }

    // Check if data already exists
    const existingProperties = await db.collection("properties").findOne();
    if (existingProperties) {
      log("Database already seeded, skipping...");
      return;
    }

    // Seed demo users
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.collection("users").insertMany([
      {
        username: "demo_user",
        email: "demo@example.com",
        fullName: "Demo User",
        phone: "+91 98765 43210",
        password: hashedPassword,
        createdAt: new Date(),
      },
      {
        username: "john_doe",
        email: "john@example.com",
        fullName: "John Doe",
        phone: "+91 98765 43211",
        password: hashedPassword,
        createdAt: new Date(),
      },
    ]);

    // Seed properties
    await db.collection("properties").insertMany([
      {
        title: "3BHK Apartment",
        description: "Spacious 3BHK apartment with modern amenities",
        purpose: "buy",
        propertyType: "3BHK",
        price: 8500000,
        location: "HSR Layout, Bangalore",
        facing: "East",
        sqft: 1250,
        amenities: ["Gym", "Swimming Pool", "Security", "Parking"],
        tags: ["Verified", "New"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
          "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800&q=80",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        ],
        ownerName: "Prestige Builders",
        ownerContact: "+91 98765 43210",
        isVerified: true,
        isNew: true,
        createdAt: new Date(),
      },
      {
        title: "2BHK Semi-Furnished",
        description: "Beautiful 2BHK apartment with semi-furnished interiors",
        purpose: "rent",
        propertyType: "2BHK",
        price: 18000,
        location: "Jubilee Hills, Hyderabad",
        facing: "North",
        sqft: 950,
        furnishing: "Semi-Furnished",
        tenantPreference: "Family",
        amenities: ["Security", "Parking", "Balcony"],
        tags: ["Owner Posted", "Pet Friendly"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        ],
        ownerName: "Rajesh Kumar",
        ownerContact: "+91 98765 43211",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        title: "Luxury Villa",
        description: "Stunning villa with pool and garden",
        purpose: "buy",
        propertyType: "Villa",
        price: 12000000,
        location: "Candolim, Goa",
        facing: "West",
        sqft: 2800,
        amenities: ["Swimming Pool", "Garden", "Security", "Clubhouse"],
        tags: ["Premium", "Pool"],
        images: [
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&q=80",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        ],
        ownerName: "Coastal Properties",
        ownerContact: "+91 98765 43213",
        isPremium: true,
        isVerified: true,
        createdAt: new Date(),
      },
    ]);

    // Seed consultants
    await db.collection("consultants").insertMany([
      {
        name: "Rajesh Sharma",
        type: "vastu",
        experience: 15,
        rating: 49,
        reviewCount: 125,
        specializations: ["Residential", "Commercial", "Land Analysis"],
        price: 2500,
        availability: "Available Today",
        bio: "Specializes in residential and commercial Vastu analysis. Expert in traditional principles with modern applications.",
        createdAt: new Date(),
      },
      {
        name: "Priya Menon",
        type: "vastu",
        experience: 12,
        rating: 48,
        reviewCount: 89,
        specializations: ["Apartments", "Remedies", "Home Office"],
        price: 2000,
        availability: "Available Tomorrow",
        bio: "Focus on modern living spaces and apartment layouts. Known for practical and affordable Vastu solutions.",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b4e21b04?w=80&h=80&fit=crop&crop=face",
        createdAt: new Date(),
      },
      {
        name: "Arjun Reddy",
        type: "interior",
        experience: 10,
        rating: 49,
        reviewCount: 156,
        specializations: ["Modern", "Sustainable", "Space Planning"],
        price: 4000,
        availability: "Available Today",
        bio: "Contemporary and minimalist designs. Specializes in space optimization and sustainable design solutions.",
        createdAt: new Date(),
      },
    ]);

    // Seed furniture items
    await db.collection("furnitureItems").insertMany([
      {
        name: "Modern L-Shaped Sofa",
        category: "living_room",
        subcategory: "sofa",
        price: 45000,
        description: "Comfortable 6-seater L-shaped sofa with premium fabric",
        dimensions: "240cm x 160cm x 85cm",
        material: "Premium Fabric",
        color: "Charcoal Grey",
        imageUrl:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        installationTime: "2-3 hours",
        roomTypes: ["living_room"],
        createdAt: new Date(),
      },
      {
        name: "Glass Coffee Table",
        category: "living_room",
        subcategory: "table",
        price: 18000,
        description: "Elegant tempered glass coffee table with metal legs",
        dimensions: "120cm x 70cm x 45cm",
        material: "Tempered Glass & Metal",
        color: "Clear Glass",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "1 hour",
        roomTypes: ["living_room"],
        createdAt: new Date(),
      },
      {
        name: "Queen Size Bed",
        category: "bedroom",
        subcategory: "bed",
        price: 38000,
        description: "Upholstered queen size bed with storage",
        dimensions: "160cm x 200cm x 120cm",
        material: "Engineered Wood & Fabric",
        color: "Beige",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "2-3 hours",
        roomTypes: ["bedroom"],
        createdAt: new Date(),
      },
    ]);

    log("✅ Database seeded successfully with sample data");
  } catch (error) {
    log("❌ Database seeding failed:");
    console.error(error);
  }
}

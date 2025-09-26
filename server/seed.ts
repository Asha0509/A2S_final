import { db } from "./db";
import { users, properties, consultants, furnitureItems } from "@shared/schema";
import { log } from "./vite";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    log("🌱 Starting database seeding...");

    // Check if data already exists
    const existingProperties = await db.select().from(properties).limit(1);
    if (existingProperties.length > 0) {
      log("Database already seeded, skipping...");
      return;
    }

    // Seed demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.insert(users).values([
      {
        username: "demo_user",
        email: "demo@example.com",
        fullName: "Demo User",
        phone: "+91 98765 43210",
        password: hashedPassword,
      },
      {
        username: "john_doe",
        email: "john@example.com",
        fullName: "John Doe",
        phone: "+91 98765 43211",
        password: hashedPassword,
      },
    ]);

    // Seed properties
    await db.insert(properties).values([
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
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        ],
        ownerName: "Prestige Builders",
        ownerContact: "+91 98765 43210",
        isVerified: true,
        isNew: true,
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
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
          "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&q=80",
          "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&q=80",
        ],
        ownerName: "Rajesh Kumar",
        ownerContact: "+91 98765 43211",
        isVerified: true,
      },
      {
        title: "Commercial Land",
        description: "Prime commercial land near beach area",
        purpose: "land",
        price: 4500000,
        location: "Near Vizag Beach",
        facing: "South",
        sqft: 6000,
        landPurpose: "commercial",
        amenities: ["Road Access", "Water Supply"],
        tags: ["Prime Location"],
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
          "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
        ],
        ownerName: "Coastal Developers",
        ownerContact: "+91 98765 43212",
        isVerified: true,
      },
    ]);

    // Seed consultants
    await db.insert(consultants).values([
      {
        name: "Dr. Rajesh Sharma",
        type: "vastu",
        experience: 15,
        rating: 45, // 4.5 * 10
        reviewCount: 127,
        specializations: [
          "Residential Vastu",
          "Commercial Vastu",
          "Industrial Vastu",
        ],
        price: 2500,
        availability: "Mon-Fri: 9AM-6PM",
        bio: "Expert Vastu consultant with 15+ years of experience in residential and commercial projects.",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      },
      {
        name: "Priya Mehta",
        type: "interior",
        experience: 8,
        rating: 48, // 4.8 * 10
        reviewCount: 89,
        specializations: ["Modern Design", "Minimalist", "Luxury Interiors"],
        price: 3000,
        availability: "Tue-Sat: 10AM-7PM",
        bio: "Creative interior designer specializing in modern and luxury home designs.",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616c2c0cc49?w=400&q=80",
      },
    ]);

    // Seed furniture items
    await db.insert(furnitureItems).values([
      {
        name: "Modern Sofa Set",
        category: "living_room",
        subcategory: "sofa",
        price: 45000,
        description: "3-seater modern sofa with premium fabric",
        dimensions: "200cm x 90cm x 80cm",
        material: "Premium Fabric",
        color: "Gray",
        imageUrl:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
        installationTime: "2-3 days",
        roomTypes: ["living_room"],
      },
      {
        name: "Queen Size Bed",
        category: "bedroom",
        subcategory: "bed",
        price: 35000,
        description: "Elegant queen size bed with storage",
        dimensions: "160cm x 200cm x 120cm",
        material: "Solid Wood",
        color: "Walnut",
        imageUrl:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
        installationTime: "1-2 days",
        roomTypes: ["bedroom"],
      },
      {
        name: "Dining Table Set",
        category: "dining",
        subcategory: "table",
        price: 28000,
        description: "6-seater dining table with chairs",
        dimensions: "180cm x 90cm x 75cm",
        material: "Engineered Wood",
        color: "Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&q=80",
        installationTime: "1 day",
        roomTypes: ["dining"],
      },
    ]);

    log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

// Auto-run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

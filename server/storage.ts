import { 
  type User, type InsertUser,
  type Property, type InsertProperty,
  type RoomDesign, type InsertRoomDesign,
  type Consultant, type InsertConsultant,
  type Booking, type InsertBooking,
  type AiChat, type InsertAiChat,
  type SavedProperty, type InsertSavedProperty
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Properties
  getProperties(filters?: {
    purpose?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    propertyType?: string;
    facing?: string;
    amenities?: string[];
  }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;

  // Room Designs
  getRoomDesignsByUser(userId: string): Promise<RoomDesign[]>;
  getRoomDesign(id: string): Promise<RoomDesign | undefined>;
  createRoomDesign(design: InsertRoomDesign): Promise<RoomDesign>;
  updateRoomDesign(id: string, design: Partial<RoomDesign>): Promise<RoomDesign | undefined>;

  // Consultants
  getConsultants(type?: string): Promise<Consultant[]>;
  getConsultant(id: string): Promise<Consultant | undefined>;

  // Bookings
  getBookingsByUser(userId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // AI Chats
  getChatsByUser(userId: string): Promise<AiChat[]>;
  getChat(id: string): Promise<AiChat | undefined>;
  createChat(chat: InsertAiChat): Promise<AiChat>;
  updateChat(id: string, messages: any[]): Promise<AiChat | undefined>;

  // Saved Properties
  getSavedPropertiesByUser(userId: string): Promise<SavedProperty[]>;
  saveProperty(userId: string, propertyId: string): Promise<SavedProperty>;
  unsaveProperty(userId: string, propertyId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private properties: Map<string, Property> = new Map();
  private roomDesigns: Map<string, RoomDesign> = new Map();
  private consultants: Map<string, Consultant> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private aiChats: Map<string, AiChat> = new Map();
  private savedProperties: Map<string, SavedProperty> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed properties
    const sampleProperties: InsertProperty[] = [
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
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"],
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
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"],
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
        amenities: ["Highway Access", "Clear Title"],
        tags: ["Commercial", "Prime Location"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"],
        ownerName: "Coastal Properties",
        ownerContact: "+91 98765 43212",
        isVerified: true,
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
        images: ["https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400"],
        ownerName: "Coastal Properties",
        ownerContact: "+91 98765 43213",
        isPremium: true,
        isVerified: true,
      },
      {
        title: "1BHK Studio",
        description: "Modern studio apartment perfect for bachelors",
        purpose: "rent",
        propertyType: "1BHK",
        price: 22000,
        location: "Koramangala, Bangalore",
        facing: "East",
        sqft: 600,
        furnishing: "Fully Furnished",
        tenantPreference: "Bachelor",
        amenities: ["Gym", "Security", "WiFi"],
        tags: ["Fully Furnished", "Bachelor Friendly"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
        ownerName: "Priya Sharma",
        ownerContact: "+91 98765 43214",
        isVerified: true,
      },
      {
        title: "Residential Plot",
        description: "Clear title residential plot in prime location",
        purpose: "land",
        price: 7500000,
        location: "Whitefield, Bangalore",
        facing: "North",
        sqft: 4800,
        landPurpose: "residential",
        amenities: ["Clear Title", "Road Access"],
        tags: ["Residential", "Clear Title"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"],
        ownerName: "Metro Properties",
        ownerContact: "+91 98765 43215",
        isVerified: true,
      }
    ];

    sampleProperties.forEach(property => {
      this.createProperty(property);
    });

    // Seed consultants
    const sampleConsultants: InsertConsultant[] = [
      {
        name: "Dr. Rajesh Sharma",
        type: "vastu",
        experience: 15,
        rating: 49,
        reviewCount: 125,
        specializations: ["Residential", "Commercial", "Land Analysis"],
        price: 2500,
        availability: "Available Today",
        bio: "Specializes in residential and commercial Vastu analysis. Expert in traditional principles with modern applications.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
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
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b4e21b04?w=80&h=80&fit=crop&crop=face",
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
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      }
    ];

    sampleConsultants.forEach(consultant => {
      const id = randomUUID();
      const consultantWithId: Consultant = {
        ...consultant,
        id,
        createdAt: new Date(),
      };
      this.consultants.set(id, consultantWithId);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(filters?: {
    purpose?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    propertyType?: string;
    facing?: string;
    amenities?: string[];
  }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (filters) {
      if (filters.purpose) {
        properties = properties.filter(p => p.purpose === filters.purpose);
      }
      if (filters.minPrice !== undefined) {
        properties = properties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.location) {
        properties = properties.filter(p => 
          p.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.propertyType) {
        properties = properties.filter(p => p.propertyType === filters.propertyType);
      }
      if (filters.facing) {
        properties = properties.filter(p => p.facing === filters.facing);
      }
      if (filters.amenities && filters.amenities.length > 0) {
        properties = properties.filter(p => 
          filters.amenities!.some(amenity => p.amenities?.includes(amenity))
        );
      }
    }

    return properties;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: new Date() 
    };
    this.properties.set(id, property);
    return property;
  }

  // Room Design methods
  async getRoomDesignsByUser(userId: string): Promise<RoomDesign[]> {
    return Array.from(this.roomDesigns.values()).filter(design => design.userId === userId);
  }

  async getRoomDesign(id: string): Promise<RoomDesign | undefined> {
    return this.roomDesigns.get(id);
  }

  async createRoomDesign(insertDesign: InsertRoomDesign): Promise<RoomDesign> {
    const id = randomUUID();
    const design: RoomDesign = { 
      ...insertDesign, 
      id, 
      createdAt: new Date() 
    };
    this.roomDesigns.set(id, design);
    return design;
  }

  async updateRoomDesign(id: string, updates: Partial<RoomDesign>): Promise<RoomDesign | undefined> {
    const existing = this.roomDesigns.get(id);
    if (!existing) return undefined;

    const updated: RoomDesign = { ...existing, ...updates };
    this.roomDesigns.set(id, updated);
    return updated;
  }

  // Consultant methods
  async getConsultants(type?: string): Promise<Consultant[]> {
    let consultants = Array.from(this.consultants.values());
    if (type) {
      consultants = consultants.filter(c => c.type === type);
    }
    return consultants;
  }

  async getConsultant(id: string): Promise<Consultant | undefined> {
    return this.consultants.get(id);
  }

  // Booking methods
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  // AI Chat methods
  async getChatsByUser(userId: string): Promise<AiChat[]> {
    return Array.from(this.aiChats.values()).filter(chat => chat.userId === userId);
  }

  async getChat(id: string): Promise<AiChat | undefined> {
    return this.aiChats.get(id);
  }

  async createChat(insertChat: InsertAiChat): Promise<AiChat> {
    const id = randomUUID();
    const chat: AiChat = { 
      ...insertChat, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiChats.set(id, chat);
    return chat;
  }

  async updateChat(id: string, messages: any[]): Promise<AiChat | undefined> {
    const existing = this.aiChats.get(id);
    if (!existing) return undefined;

    const updated: AiChat = { 
      ...existing, 
      messages, 
      updatedAt: new Date() 
    };
    this.aiChats.set(id, updated);
    return updated;
  }

  // Saved Properties methods
  async getSavedPropertiesByUser(userId: string): Promise<SavedProperty[]> {
    return Array.from(this.savedProperties.values()).filter(sp => sp.userId === userId);
  }

  async saveProperty(userId: string, propertyId: string): Promise<SavedProperty> {
    const id = randomUUID();
    const savedProperty: SavedProperty = {
      id,
      userId,
      propertyId,
      createdAt: new Date()
    };
    this.savedProperties.set(id, savedProperty);
    return savedProperty;
  }

  async unsaveProperty(userId: string, propertyId: string): Promise<boolean> {
    const savedProperty = Array.from(this.savedProperties.values())
      .find(sp => sp.userId === userId && sp.propertyId === propertyId);
    
    if (savedProperty) {
      this.savedProperties.delete(savedProperty.id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();

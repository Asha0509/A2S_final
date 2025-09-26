import {
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type RoomDesign,
  type InsertRoomDesign,
  type Consultant,
  type InsertConsultant,
  type Booking,
  type InsertBooking,
  type AiChat,
  type InsertAiChat,
  type SavedProperty,
  type InsertSavedProperty,
  type FurnitureItem,
  type InsertFurnitureItem,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
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
  updateRoomDesign(
    id: string,
    design: Partial<RoomDesign>
  ): Promise<RoomDesign | undefined>;

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

  // Furniture Items
  getFurnitureByRoom(roomType: string): Promise<FurnitureItem[]>;
  getFurnitureItem(id: string): Promise<FurnitureItem | undefined>;

  // Cart Items
  getCartByUser(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Orders
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private properties: Map<string, Property> = new Map();
  private roomDesigns: Map<string, RoomDesign> = new Map();
  private consultants: Map<string, Consultant> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private aiChats: Map<string, AiChat> = new Map();
  private savedProperties: Map<string, SavedProperty> = new Map();
  private furnitureItems: Map<string, FurnitureItem> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();

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
        amenities: ["Highway Access", "Clear Title"],
        tags: ["Commercial", "Prime Location"],
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
          "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
        ],
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
        images: [
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&q=80",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
          "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        ],
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
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
          "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&q=80",
          "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80",
        ],
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
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
          "https://images.unsplash.com/photo-1597047084897-51e81819e8c3?w=800&q=80",
          "https://images.unsplash.com/photo-1552588041-6dd7c8e3e0f7?w=800&q=80",
        ],
        ownerName: "Metro Properties",
        ownerContact: "+91 98765 43215",
        isVerified: true,
      },
      {
        title: "Penthouse Suite",
        description:
          "Luxury penthouse with panoramic city views and private terrace",
        purpose: "buy",
        propertyType: "Penthouse",
        price: 25000000,
        location: "Bandra West, Mumbai",
        facing: "North",
        sqft: 3500,
        amenities: [
          "Terrace Garden",
          "Gym",
          "Swimming Pool",
          "Valet Parking",
          "Concierge",
        ],
        tags: ["Luxury", "City View", "Premium"],
        images: [
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
          "https://images.unsplash.com/photo-1600607688960-e095ff8ab456?w=800&q=80",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
          "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&q=80",
        ],
        ownerName: "Elite Properties",
        ownerContact: "+91 98765 43216",
        isPremium: true,
        isVerified: true,
      },
      {
        title: "4BHK Family Home",
        description: "Spacious family home with garden and parking for 2 cars",
        purpose: "rent",
        propertyType: "4BHK",
        price: 35000,
        location: "Hitech City, Hyderabad",
        facing: "East",
        sqft: 1800,
        furnishing: "Semi-Furnished",
        tenantPreference: "Family",
        amenities: ["Garden", "Parking", "Security", "Power Backup"],
        tags: ["Spacious", "Family Friendly", "Garden"],
        images: [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
          "https://images.unsplash.com/photo-1594736797933-d0ed2c1ee4c2?w=800&q=80",
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        ],
        ownerName: "Arvind Reddy",
        ownerContact: "+91 98765 43217",
        isVerified: true,
      },
    ];

    sampleProperties.forEach((property) => {
      this.createProperty(property);
    });

    // Seed furniture items
    const sampleFurniture: InsertFurnitureItem[] = [
      // Living Room Furniture
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
      },
      {
        name: "Entertainment Unit",
        category: "living_room",
        subcategory: "storage",
        price: 32000,
        description: "Wall-mounted TV unit with storage compartments",
        dimensions: "180cm x 40cm x 35cm",
        material: "MDF with Laminate",
        color: "Walnut Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "3-4 hours",
        roomTypes: ["living_room"],
      },
      // Bedroom Furniture
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
      },
      {
        name: "Wardrobe 3-Door",
        category: "bedroom",
        subcategory: "storage",
        price: 55000,
        description: "3-door wardrobe with mirror and drawers",
        dimensions: "180cm x 60cm x 200cm",
        material: "Engineered Wood",
        color: "White & Brown",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "4-5 hours",
        roomTypes: ["bedroom"],
      },
      {
        name: "Bedside Table",
        category: "bedroom",
        subcategory: "table",
        price: 12000,
        description: "Compact bedside table with drawer",
        dimensions: "40cm x 35cm x 60cm",
        material: "Solid Wood",
        color: "Natural Oak",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "30 minutes",
        roomTypes: ["bedroom"],
      },
      // Kitchen Furniture
      {
        name: "Dining Table Set",
        category: "kitchen",
        subcategory: "table",
        price: 42000,
        description: "6-seater dining table with chairs",
        dimensions: "180cm x 90cm x 75cm",
        material: "Solid Wood",
        color: "Mahogany",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "2-3 hours",
        roomTypes: ["kitchen", "dining"],
      },
      {
        name: "Kitchen Island",
        category: "kitchen",
        subcategory: "storage",
        price: 68000,
        description: "Modular kitchen island with granite top",
        dimensions: "120cm x 60cm x 90cm",
        material: "Granite & Wood",
        color: "Black Granite",
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        installationTime: "4-6 hours",
        roomTypes: ["kitchen"],
      },
    ];

    sampleFurniture.forEach((furniture) => {
      const id = Math.random().toString(36).substring(2, 15);
      this.furnitureItems.set(id, { id, ...furniture, createdAt: new Date() });
    });

    // Seed consultants
    const sampleConsultants: InsertConsultant[] = [
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
      },
    ];

    sampleConsultants.forEach((consultant) => {
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
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
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
        properties = properties.filter((p) => p.purpose === filters.purpose);
      }
      if (filters.minPrice !== undefined) {
        properties = properties.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        properties = properties.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.location) {
        properties = properties.filter((p) =>
          p.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.propertyType) {
        properties = properties.filter(
          (p) => p.propertyType === filters.propertyType
        );
      }
      if (filters.facing) {
        properties = properties.filter((p) => p.facing === filters.facing);
      }
      if (filters.amenities && filters.amenities.length > 0) {
        properties = properties.filter((p) =>
          filters.amenities!.some((amenity) => p.amenities?.includes(amenity))
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
      createdAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  // Room Design methods
  async getRoomDesignsByUser(userId: string): Promise<RoomDesign[]> {
    return Array.from(this.roomDesigns.values()).filter(
      (design) => design.userId === userId
    );
  }

  async getRoomDesign(id: string): Promise<RoomDesign | undefined> {
    return this.roomDesigns.get(id);
  }

  async createRoomDesign(insertDesign: InsertRoomDesign): Promise<RoomDesign> {
    const id = randomUUID();
    const design: RoomDesign = {
      ...insertDesign,
      id,
      createdAt: new Date(),
    };
    this.roomDesigns.set(id, design);
    return design;
  }

  async updateRoomDesign(
    id: string,
    updates: Partial<RoomDesign>
  ): Promise<RoomDesign | undefined> {
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
      consultants = consultants.filter((c) => c.type === type);
    }
    return consultants;
  }

  async getConsultant(id: string): Promise<Consultant | undefined> {
    return this.consultants.get(id);
  }

  // Booking methods
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  // AI Chat methods
  async getChatsByUser(userId: string): Promise<AiChat[]> {
    return Array.from(this.aiChats.values()).filter(
      (chat) => chat.userId === userId
    );
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
      updatedAt: new Date(),
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
      updatedAt: new Date(),
    };
    this.aiChats.set(id, updated);
    return updated;
  }

  // Saved Properties methods
  async getSavedPropertiesByUser(userId: string): Promise<SavedProperty[]> {
    return Array.from(this.savedProperties.values()).filter(
      (sp) => sp.userId === userId
    );
  }

  async saveProperty(
    userId: string,
    propertyId: string
  ): Promise<SavedProperty> {
    const id = randomUUID();
    const savedProperty: SavedProperty = {
      id,
      userId,
      propertyId,
      createdAt: new Date(),
    };
    this.savedProperties.set(id, savedProperty);
    return savedProperty;
  }

  async unsaveProperty(userId: string, propertyId: string): Promise<boolean> {
    const savedProperty = Array.from(this.savedProperties.values()).find(
      (sp) => sp.userId === userId && sp.propertyId === propertyId
    );

    if (savedProperty) {
      this.savedProperties.delete(savedProperty.id);
      return true;
    }
    return false;
  }

  // Furniture Items
  async getFurnitureByRoom(roomType: string): Promise<FurnitureItem[]> {
    return Array.from(this.furnitureItems.values()).filter(
      (item) => item.roomTypes?.includes(roomType) ?? false
    );
  }

  async getFurnitureItem(id: string): Promise<FurnitureItem | undefined> {
    return this.furnitureItems.get(id);
  }

  // Cart Items
  async getCartByUser(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const newCartItem: CartItem = {
      id,
      ...cartItem,
      createdAt: new Date(),
    };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(
    id: string,
    quantity: number
  ): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
    userCartItems.forEach((item) => this.cartItems.delete(item.id));
    return true;
  }

  // Orders
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      id,
      ...order,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

// Import database storage if available
import { mongoStorage } from "./mongoStorage";

// For development, create a simple fallback that provides empty data rather than using MemStorage
class SimpleMemStorage implements IStorage {
  async getUser(_id: string) {
    return undefined;
  }
  async getUserByUsername(_username: string) {
    return undefined;
  }
  async createUser(_user: InsertUser): Promise<User> {
    throw new Error("Database required");
  }
  async getProperties() {
    return [];
  }
  async getProperty(_id: string) {
    return undefined;
  }
  async createProperty(_property: InsertProperty): Promise<Property> {
    throw new Error("Database required");
  }
  async getRoomDesignsByUser(_userId: string) {
    return [];
  }
  async getRoomDesign(_id: string) {
    return undefined;
  }
  async createRoomDesign(_design: InsertRoomDesign): Promise<RoomDesign> {
    throw new Error("Database required");
  }
  async updateRoomDesign(_id: string, _design: Partial<RoomDesign>) {
    return undefined;
  }
  async getConsultants() {
    return [];
  }
  async getConsultant(_id: string) {
    return undefined;
  }
  async getBookingsByUser(_userId: string) {
    return [];
  }
  async createBooking(_booking: InsertBooking): Promise<Booking> {
    throw new Error("Database required");
  }
  async getChatsByUser(_userId: string) {
    return [];
  }
  async getChat(_id: string) {
    return undefined;
  }
  async createChat(_chat: InsertAiChat): Promise<AiChat> {
    throw new Error("Database required");
  }
  async updateChat(_id: string, _messages: any[]) {
    return undefined;
  }
  async getSavedPropertiesByUser(_userId: string) {
    return [];
  }
  async saveProperty(
    _userId: string,
    _propertyId: string
  ): Promise<SavedProperty> {
    throw new Error("Database required");
  }
  async unsaveProperty(_userId: string, _propertyId: string) {
    return false;
  }
  async getFurnitureByRoom(_roomType: string) {
    return [];
  }
  async getFurnitureItem(_id: string) {
    return undefined;
  }
  async getCartByUser(_userId: string) {
    return [];
  }
  async addToCart(_cartItem: InsertCartItem): Promise<CartItem> {
    throw new Error("Database required");
  }
  async updateCartItem(_id: string, _quantity: number) {
    return undefined;
  }
  async removeFromCart(_id: string) {
    return false;
  }
  async clearCart(_userId: string) {
    return false;
  }
  async getOrdersByUser(_userId: string) {
    return [];
  }
  async createOrder(_order: InsertOrder): Promise<Order> {
    throw new Error("Database required");
  }
  async getOrder(_id: string) {
    return undefined;
  }
}

// Export the storage instance - prefer database storage, fallback to memory
console.log("DATABASE_URL configured:", !!process.env.DATABASE_URL);

let storageToUse: IStorage;
try {
  if (process.env.DATABASE_URL) {
    console.log("Storage type: Database (MongoDB)");
    storageToUse = mongoStorage;
  } else {
    console.log(
      "Storage type: Memory (Development only - data will not persist)"
    );
    storageToUse = new MemStorage(); // Use full memory storage with sample data for development
  }
} catch (error) {
  console.warn("⚠️ Database storage failed, falling back to memory storage");
  console.warn("Error:", error);
  storageToUse = new MemStorage();
}

export const storage = storageToUse;

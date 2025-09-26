import { eq, and, sql, desc, asc, ilike, inArray, or } from "drizzle-orm";
import { db } from "./db";
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
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private checkDb() {
    if (!db) {
      throw new Error("Database not available - please configure DATABASE_URL");
    }
    return db;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const database = this.checkDb();
    const result = await database.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const database = this.checkDb();
    const result = await database
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Properties
  async getProperties(filters?: {
    purpose?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    propertyType?: string;
    facing?: string;
    amenities?: string[];
  }): Promise<Property[]> {
    let query = db.select().from(properties);
    const conditions = [];

    if (filters) {
      if (filters.purpose) {
        conditions.push(eq(properties.purpose, filters.purpose));
      }

      if (filters.minPrice) {
        conditions.push(sql`${properties.price} >= ${filters.minPrice}`);
      }

      if (filters.maxPrice) {
        conditions.push(sql`${properties.price} <= ${filters.maxPrice}`);
      }

      if (filters.location) {
        conditions.push(ilike(properties.location, `%${filters.location}%`));
      }

      if (filters.propertyType) {
        conditions.push(eq(properties.propertyType, filters.propertyType));
      }

      if (filters.facing) {
        conditions.push(eq(properties.facing, filters.facing));
      }

      if (filters.amenities && filters.amenities.length > 0) {
        conditions.push(sql`${properties.amenities} && ${filters.amenities}`);
      }
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(properties)
        .where(and(...conditions))
        .orderBy(desc(properties.createdAt));
    }

    return await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return result[0];
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await db.insert(properties).values(property).returning();
    return result[0];
  }

  // Room Designs
  async getRoomDesignsByUser(userId: string): Promise<RoomDesign[]> {
    return await db
      .select()
      .from(roomDesigns)
      .where(eq(roomDesigns.userId, userId))
      .orderBy(desc(roomDesigns.createdAt));
  }

  async getRoomDesign(id: string): Promise<RoomDesign | undefined> {
    const result = await db
      .select()
      .from(roomDesigns)
      .where(eq(roomDesigns.id, id));
    return result[0];
  }

  async createRoomDesign(design: InsertRoomDesign): Promise<RoomDesign> {
    const result = await db.insert(roomDesigns).values(design).returning();
    return result[0];
  }

  async updateRoomDesign(
    id: string,
    design: Partial<RoomDesign>
  ): Promise<RoomDesign | undefined> {
    const result = await db
      .update(roomDesigns)
      .set(design)
      .where(eq(roomDesigns.id, id))
      .returning();
    return result[0];
  }

  // Consultants
  async getConsultants(type?: string): Promise<Consultant[]> {
    if (type) {
      return await db
        .select()
        .from(consultants)
        .where(eq(consultants.type, type))
        .orderBy(desc(consultants.rating), desc(consultants.reviewCount));
    }

    return await db
      .select()
      .from(consultants)
      .orderBy(desc(consultants.rating), desc(consultants.reviewCount));
  }

  async getConsultant(id: string): Promise<Consultant | undefined> {
    const result = await db
      .select()
      .from(consultants)
      .where(eq(consultants.id, id));
    return result[0];
  }

  // Bookings
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  // AI Chats
  async getChatsByUser(userId: string): Promise<AiChat[]> {
    return await db
      .select()
      .from(aiChats)
      .where(eq(aiChats.userId, userId))
      .orderBy(desc(aiChats.updatedAt));
  }

  async getChat(id: string): Promise<AiChat | undefined> {
    const result = await db.select().from(aiChats).where(eq(aiChats.id, id));
    return result[0];
  }

  async createChat(chat: InsertAiChat): Promise<AiChat> {
    const result = await db.insert(aiChats).values(chat).returning();
    return result[0];
  }

  async updateChat(id: string, messages: any[]): Promise<AiChat | undefined> {
    const result = await db
      .update(aiChats)
      .set({
        messages,
        updatedAt: sql`NOW()`,
      })
      .where(eq(aiChats.id, id))
      .returning();
    return result[0];
  }

  // Saved Properties
  async getSavedPropertiesByUser(userId: string): Promise<SavedProperty[]> {
    return await db
      .select()
      .from(savedProperties)
      .where(eq(savedProperties.userId, userId))
      .orderBy(desc(savedProperties.createdAt));
  }

  async saveProperty(
    userId: string,
    propertyId: string
  ): Promise<SavedProperty> {
    const result = await db
      .insert(savedProperties)
      .values({ userId, propertyId })
      .returning();
    return result[0];
  }

  async unsaveProperty(userId: string, propertyId: string): Promise<boolean> {
    const result = await db
      .delete(savedProperties)
      .where(
        and(
          eq(savedProperties.userId, userId),
          eq(savedProperties.propertyId, propertyId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }

  // Furniture Items
  async getFurnitureByRoom(roomType: string): Promise<FurnitureItem[]> {
    return await db
      .select()
      .from(furnitureItems)
      .where(sql`${roomType} = ANY(${furnitureItems.roomTypes})`)
      .orderBy(asc(furnitureItems.price));
  }

  async getFurnitureItem(id: string): Promise<FurnitureItem | undefined> {
    const result = await db
      .select()
      .from(furnitureItems)
      .where(eq(furnitureItems.id, id));
    return result[0];
  }

  // Cart Items
  async getCartByUser(userId: string): Promise<CartItem[]> {
    return await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .orderBy(desc(cartItems.createdAt));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(cartItem).returning();
    return result[0];
  }

  async updateCartItem(
    id: string,
    quantity: number
  ): Promise<CartItem | undefined> {
    const result = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(eq(cartItems.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Orders
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }
}

// Create and export the database storage instance
export const databaseStorage = new DatabaseStorage();

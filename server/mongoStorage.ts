import { ObjectId, Collection } from "mongodb";
import { getDatabase } from "./mongodb";
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

export class MongoStorage implements IStorage {
  private async getCollection<T>(
    collectionName: string
  ): Promise<Collection<T> | null> {
    const db = await getDatabase();
    if (!db) {
      throw new Error("Database not available - please configure DATABASE_URL");
    }
    return db.collection<T>(collectionName);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const collection = await this.getCollection<User>("users");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const collection = await this.getCollection<User>("users");
    if (!collection) return undefined;

    const result = await collection.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const collection = await this.getCollection<any>("users");
    if (!collection) throw new Error("Database not available");

    const userDoc = {
      ...insertUser,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(userDoc);

    return {
      ...userDoc,
      id: result.insertedId.toString(),
    } as User;
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
    const collection = await this.getCollection<any>("properties");
    if (!collection) return [];

    let query: any = {};

    if (filters) {
      if (filters.purpose) query.purpose = filters.purpose;
      if (filters.minPrice !== undefined)
        query.price = { ...query.price, $gte: filters.minPrice };
      if (filters.maxPrice !== undefined)
        query.price = { ...query.price, $lte: filters.maxPrice };
      if (filters.location)
        query.location = { $regex: filters.location, $options: "i" };
      if (filters.propertyType) query.propertyType = filters.propertyType;
      if (filters.facing) query.facing = filters.facing;
      if (filters.amenities && filters.amenities.length > 0) {
        query.amenities = { $in: filters.amenities };
      }
    }

    const results = await collection.find(query).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as Property[];
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const collection = await this.getCollection<any>("properties");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as Property;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const collection = await this.getCollection<any>("properties");
    if (!collection) throw new Error("Database not available");

    const propertyDoc = {
      ...insertProperty,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(propertyDoc);

    return {
      ...propertyDoc,
      id: result.insertedId.toString(),
    } as Property;
  }

  // Room Designs
  async getRoomDesignsByUser(userId: string): Promise<RoomDesign[]> {
    const collection = await this.getCollection<any>("roomDesigns");
    if (!collection) return [];

    const results = await collection.find({ userId }).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as RoomDesign[];
  }

  async getRoomDesign(id: string): Promise<RoomDesign | undefined> {
    const collection = await this.getCollection<any>("roomDesigns");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as RoomDesign;
  }

  async createRoomDesign(insertDesign: InsertRoomDesign): Promise<RoomDesign> {
    const collection = await this.getCollection<any>("roomDesigns");
    if (!collection) throw new Error("Database not available");

    const designDoc = {
      ...insertDesign,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(designDoc);

    return {
      ...designDoc,
      id: result.insertedId.toString(),
    } as RoomDesign;
  }

  async updateRoomDesign(
    id: string,
    updates: Partial<RoomDesign>
  ): Promise<RoomDesign | undefined> {
    const collection = await this.getCollection<any>("roomDesigns");
    if (!collection) return undefined;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as RoomDesign;
  }

  // Consultants
  async getConsultants(type?: string): Promise<Consultant[]> {
    const collection = await this.getCollection<any>("consultants");
    if (!collection) return [];

    const query = type ? { type } : {};
    const results = await collection.find(query).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as Consultant[];
  }

  async getConsultant(id: string): Promise<Consultant | undefined> {
    const collection = await this.getCollection<any>("consultants");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as Consultant;
  }

  // Bookings
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const collection = await this.getCollection<any>("bookings");
    if (!collection) return [];

    const results = await collection.find({ userId }).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as Booking[];
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const collection = await this.getCollection<any>("bookings");
    if (!collection) throw new Error("Database not available");

    const bookingDoc = {
      ...insertBooking,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(bookingDoc);

    return {
      ...bookingDoc,
      id: result.insertedId.toString(),
    } as Booking;
  }

  // AI Chats
  async getChatsByUser(userId: string): Promise<AiChat[]> {
    const collection = await this.getCollection<any>("aiChats");
    if (!collection) return [];

    const results = await collection.find({ userId }).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as AiChat[];
  }

  async getChat(id: string): Promise<AiChat | undefined> {
    const collection = await this.getCollection<any>("aiChats");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as AiChat;
  }

  async createChat(insertChat: InsertAiChat): Promise<AiChat> {
    const collection = await this.getCollection<any>("aiChats");
    if (!collection) throw new Error("Database not available");

    const chatDoc = {
      ...insertChat,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(chatDoc);

    return {
      ...chatDoc,
      id: result.insertedId.toString(),
    } as AiChat;
  }

  async updateChat(id: string, messages: any[]): Promise<AiChat | undefined> {
    const collection = await this.getCollection<any>("aiChats");
    if (!collection) return undefined;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { messages, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as AiChat;
  }

  // Saved Properties
  async getSavedPropertiesByUser(userId: string): Promise<SavedProperty[]> {
    const collection = await this.getCollection<any>("savedProperties");
    if (!collection) return [];

    const results = await collection.find({ userId }).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as SavedProperty[];
  }

  async saveProperty(
    userId: string,
    propertyId: string
  ): Promise<SavedProperty> {
    const collection = await this.getCollection<any>("savedProperties");
    if (!collection) throw new Error("Database not available");

    const savedDoc = {
      userId,
      propertyId,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(savedDoc);

    return {
      ...savedDoc,
      id: result.insertedId.toString(),
    } as SavedProperty;
  }

  async unsaveProperty(userId: string, propertyId: string): Promise<boolean> {
    const collection = await this.getCollection<any>("savedProperties");
    if (!collection) return false;

    const result = await collection.deleteOne({ userId, propertyId });
    return result.deletedCount > 0;
  }

  // Furniture Items
  async getFurnitureByRoom(roomType: string): Promise<FurnitureItem[]> {
    const collection = await this.getCollection<any>("furnitureItems");
    if (!collection) return [];

    const results = await collection
      .find({ roomTypes: { $in: [roomType] } })
      .toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as FurnitureItem[];
  }

  async getFurnitureItem(id: string): Promise<FurnitureItem | undefined> {
    const collection = await this.getCollection<any>("furnitureItems");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as FurnitureItem;
  }

  // Cart Items
  async getCartByUser(userId: string): Promise<CartItem[]> {
    const collection = await this.getCollection<any>("cartItems");
    if (!collection) return [];

    const results = await collection.find({ userId }).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as CartItem[];
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const collection = await this.getCollection<any>("cartItems");
    if (!collection) throw new Error("Database not available");

    const cartDoc = {
      ...cartItem,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(cartDoc);

    return {
      ...cartDoc,
      id: result.insertedId.toString(),
    } as CartItem;
  }

  async updateCartItem(
    id: string,
    quantity: number
  ): Promise<CartItem | undefined> {
    const collection = await this.getCollection<any>("cartItems");
    if (!collection) return undefined;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { quantity } },
      { returnDocument: "after" }
    );

    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as CartItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const collection = await this.getCollection<any>("cartItems");
    if (!collection) return false;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async clearCart(userId: string): Promise<boolean> {
    const collection = await this.getCollection<any>("cartItems");
    if (!collection) return false;

    const result = await collection.deleteMany({ userId });
    return result.deletedCount > 0;
  }

  // Orders
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const collection = await this.getCollection<any>("orders");
    if (!collection) return [];

    const results = await collection.find({ userId }).toArray();
    return results.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as Order[];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const collection = await this.getCollection<any>("orders");
    if (!collection) throw new Error("Database not available");

    const orderDoc = {
      ...order,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(orderDoc);

    return {
      ...orderDoc,
      id: result.insertedId.toString(),
    } as Order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const collection = await this.getCollection<any>("orders");
    if (!collection) return undefined;

    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return undefined;

    return {
      ...result,
      id: result._id.toString(),
    } as Order;
  }
}

// Create and export the MongoDB storage instance
export const mongoStorage = new MongoStorage();

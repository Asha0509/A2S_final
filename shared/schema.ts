import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  purpose: text("purpose").notNull(), // 'buy', 'rent', 'land'
  propertyType: text("property_type"), // '1BHK', '2BHK', etc.
  price: integer("price").notNull(),
  location: text("location").notNull(),
  facing: text("facing"),
  sqft: integer("sqft"),
  furnishing: text("furnishing"), // for rent properties
  tenantPreference: text("tenant_preference"), // for rent properties
  landPurpose: text("land_purpose"), // for land properties - 'commercial', 'residential'
  amenities: text("amenities").array().default([]),
  tags: text("tags").array().default([]),
  images: text("images").array().default([]),
  ownerName: text("owner_name").notNull(),
  ownerContact: text("owner_contact"),
  isVerified: boolean("is_verified").default(false),
  isNew: boolean("is_new").default(false),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomDesigns = pgTable("room_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  roomType: text("room_type").notNull(), // 'living_room', 'bedroom', 'kitchen'
  designType: text("design_type").notNull(), // 'empty', 'semi', 'renovate'
  theme: text("theme"),
  elements: jsonb("elements").default({}), // furniture, colors, materials
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultants = pgTable("consultants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'vastu', 'interior'
  experience: integer("experience").notNull(),
  rating: integer("rating").default(0), // out of 50 (4.5 * 10)
  reviewCount: integer("review_count").default(0),
  specializations: text("specializations").array().default([]),
  price: integer("price").notNull(),
  availability: text("availability").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  consultantId: varchar("consultant_id").references(() => consultants.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyType: text("property_type").notNull(),
  consultationType: text("consultation_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  requirements: text("requirements"),
  status: text("status").default("pending"), // 'pending', 'confirmed', 'completed', 'cancelled'
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiChats = pgTable("ai_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  messages: jsonb("messages").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedProperties = pgTable("saved_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  propertyId: varchar("property_id").references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const furnitureItems = pgTable("furniture_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'living_room', 'bedroom', 'kitchen', 'dining'
  subcategory: text("subcategory").notNull(), // 'sofa', 'bed', 'table', etc.
  price: integer("price").notNull(),
  description: text("description"),
  dimensions: text("dimensions"),
  material: text("material"),
  color: text("color"),
  imageUrl: text("image_url"),
  installationTime: text("installation_time"),
  roomTypes: text("room_types").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  furnitureId: varchar("furniture_id").references(() => furnitureItems.id),
  roomDesignId: varchar("room_design_id").references(() => roomDesigns.id),
  quantity: integer("quantity").default(1),
  position: jsonb("position").default({}), // x, y coordinates in room
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  roomDesignId: varchar("room_design_id").references(() => roomDesigns.id),
  items: jsonb("items").default([]), // cart items with details
  totalAmount: integer("total_amount").notNull(),
  installationDate: text("installation_date"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'completed', 'failed'
  orderStatus: text("order_status").default("processing"), // 'processing', 'confirmed', 'delivered', 'installed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertRoomDesignSchema = createInsertSchema(roomDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertConsultantSchema = createInsertSchema(consultants).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertAiChatSchema = createInsertSchema(aiChats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavedPropertySchema = createInsertSchema(savedProperties).omit({
  id: true,
  createdAt: true,
});

export const insertFurnitureItemSchema = createInsertSchema(furnitureItems).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertRoomDesign = z.infer<typeof insertRoomDesignSchema>;
export type RoomDesign = typeof roomDesigns.$inferSelect;

export type InsertConsultant = z.infer<typeof insertConsultantSchema>;
export type Consultant = typeof consultants.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertAiChat = z.infer<typeof insertAiChatSchema>;
export type AiChat = typeof aiChats.$inferSelect;

export type InsertSavedProperty = z.infer<typeof insertSavedPropertySchema>;
export type SavedProperty = typeof savedProperties.$inferSelect;

export type InsertFurnitureItem = z.infer<typeof insertFurnitureItemSchema>;
export type FurnitureItem = typeof furnitureItems.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

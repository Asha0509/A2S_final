import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertRoomDesignSchema, 
  insertBookingSchema, 
  insertAiChatSchema,
  insertCartItemSchema,
  insertOrderSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        purpose: req.query.purpose as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        location: req.query.location as string,
        propertyType: req.query.propertyType as string,
        facing: req.query.facing as string,
        amenities: req.query.amenities ? (req.query.amenities as string).split(',') : undefined,
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  // Room Designs
  app.get("/api/room-designs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const designs = await storage.getRoomDesignsByUser(userId);
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room designs" });
    }
  });

  app.post("/api/room-designs", async (req, res) => {
    try {
      const validatedData = insertRoomDesignSchema.parse(req.body);
      const design = await storage.createRoomDesign(validatedData);
      res.status(201).json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid room design data" });
    }
  });

  app.put("/api/room-designs/:id", async (req, res) => {
    try {
      const updated = await storage.updateRoomDesign(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Room design not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update room design" });
    }
  });

  // Consultants
  app.get("/api/consultants", async (req, res) => {
    try {
      const type = req.query.type as string;
      const consultants = await storage.getConsultants(type);
      res.json(consultants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultants" });
    }
  });

  app.get("/api/consultants/:id", async (req, res) => {
    try {
      const consultant = await storage.getConsultant(req.params.id);
      if (!consultant) {
        return res.status(404).json({ message: "Consultant not found" });
      }
      res.json(consultant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultant" });
    }
  });

  // Bookings
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // AI Chats
  app.get("/api/ai-chats", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const chats = await storage.getChatsByUser(userId);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.post("/api/ai-chats", async (req, res) => {
    try {
      const validatedData = insertAiChatSchema.parse(req.body);
      const chat = await storage.createChat(validatedData);
      res.status(201).json(chat);
    } catch (error) {
      res.status(400).json({ message: "Invalid chat data" });
    }
  });

  app.put("/api/ai-chats/:id", async (req, res) => {
    try {
      const { messages } = req.body;
      const updated = await storage.updateChat(req.params.id, messages);
      if (!updated) {
        return res.status(404).json({ message: "Chat not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update chat" });
    }
  });

  // AI Chat Message (simulate AI responses)
  app.post("/api/ai-chats/:id/message", async (req, res) => {
    try {
      const { message } = req.body;
      const chat = await storage.getChat(req.params.id);
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Simulate AI response based on message content
      let aiResponse: {
        role: string;
        content: string;
        timestamp: string;
        suggestions: any[];
      } = {
        role: "assistant",
        content: "I'm here to help you with property searches and room designs. Could you please provide more specific details about what you're looking for?",
        timestamp: new Date().toISOString(),
        suggestions: []
      };

      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes("property") || lowerMessage.includes("plot") || lowerMessage.includes("land")) {
        const properties = await storage.getProperties();
        const relevantProperties = properties.slice(0, 2);
        
        aiResponse = {
          role: "assistant",
          content: "I found some great properties that match your requirements! Here are my top recommendations:",
          timestamp: new Date().toISOString(),
          suggestions: relevantProperties.map(p => ({
            type: "property" as const,
            id: p.id,
            title: p.title,
            location: p.location,
            price: p.price,
            image: p.images?.[0] || "",
            action: "View Property"
          }))
        };
      } else if (lowerMessage.includes("design") || lowerMessage.includes("room") || lowerMessage.includes("interior")) {
        aiResponse = {
          role: "assistant",
          content: "Perfect choice! I can help you create beautiful room designs. Here's a concept based on your preferences:",
          timestamp: new Date().toISOString(),
          suggestions: [{
            type: "design" as const,
            title: "Modern Living Room Design",
            description: "Features: Teal accent wall, wooden furniture, modern lighting",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300",
            action: "Start Designing"
          }]
        };
      }

      const updatedMessages = [
        ...(chat.messages as any[] || []),
        {
          role: "user",
          content: message,
          timestamp: new Date().toISOString()
        },
        aiResponse
      ];

      const updated = await storage.updateChat(req.params.id, updatedMessages);
      res.json({ message: aiResponse });
    } catch (error) {
      res.status(500).json({ message: "Failed to process AI message" });
    }
  });

  // Saved Properties
  app.get("/api/saved-properties", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const savedProperties = await storage.getSavedPropertiesByUser(userId);
      const propertiesWithDetails = await Promise.all(
        savedProperties.map(async (sp) => {
          const property = await storage.getProperty(sp.propertyId || "");
          return { ...sp, property };
        })
      );
      
      res.json(propertiesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved properties" });
    }
  });

  app.post("/api/saved-properties", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      const savedProperty = await storage.saveProperty(userId, propertyId);
      res.status(201).json(savedProperty);
    } catch (error) {
      res.status(400).json({ message: "Failed to save property" });
    }
  });

  app.delete("/api/saved-properties", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      const success = await storage.unsaveProperty(userId, propertyId);
      if (success) {
        res.json({ message: "Property unsaved successfully" });
      } else {
        res.status(404).json({ message: "Saved property not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave property" });
    }
  });

  // Furniture Items
  app.get("/api/furniture", async (req, res) => {
    try {
      const roomType = req.query.roomType as string;
      const furniture = await storage.getFurnitureByRoom(roomType || 'living_room');
      res.json(furniture);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch furniture" });
    }
  });

  app.get("/api/furniture/:id", async (req, res) => {
    try {
      const furniture = await storage.getFurnitureItem(req.params.id);
      if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
      }
      res.json(furniture);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch furniture" });
    }
  });

  // Cart Items
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getCartByUser(req.params.userId);
      const cartWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const furniture = await storage.getFurnitureItem(item.furnitureId || "");
          return { ...item, furniture };
        })
      );
      res.json(cartWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (success) {
        res.json({ message: "Item removed from cart" });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart/user/:userId", async (req, res) => {
    try {
      const success = await storage.clearCart(req.params.userId);
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders
  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Clear the cart after successful order
      if (validatedData.userId) {
        await storage.clearCart(validatedData.userId);
      }
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/details/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

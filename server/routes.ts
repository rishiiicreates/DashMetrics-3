import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertAnalyticsSchema, insertActivitySchema, insertSavedContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for user operations
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.format() });
      }
      
      const user = await storage.createUser(result.data);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const result = insertUserSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.format() });
      }
      
      const updatedUser = await storage.updateUser(userId, result.data);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // API routes for analytics operations
  app.get("/api/analytics", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || undefined;
      const analytics = await storage.getAnalytics(userId);
      return res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const result = insertAnalyticsSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid analytics data", errors: result.error.format() });
      }
      
      const analytics = await storage.createAnalytics(result.data);
      return res.status(201).json(analytics);
    } catch (error) {
      console.error("Error creating analytics:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // API routes for activities operations
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || undefined;
      const activities = await storage.getActivities(userId);
      return res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const result = insertActivitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid activity data", errors: result.error.format() });
      }
      
      const activity = await storage.createActivity(result.data);
      return res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // API routes for saved content operations
  app.get("/api/content/saved", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || undefined;
      const savedContent = await storage.getSavedContent(userId);
      return res.json(savedContent);
    } catch (error) {
      console.error("Error fetching saved content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/content/top", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || undefined;
      const limit = parseInt(req.query.limit as string) || 3;
      const topContent = await storage.getTopContent(userId, limit);
      return res.json(topContent);
    } catch (error) {
      console.error("Error fetching top content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/content/saved", async (req, res) => {
    try {
      const result = insertSavedContentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid content data", errors: result.error.format() });
      }
      
      const content = await storage.createSavedContent(result.data);
      return res.status(201).json(content);
    } catch (error) {
      console.error("Error saving content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/content/saved/:id", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const deleted = await storage.deleteSavedContent(contentId);
      if (!deleted) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

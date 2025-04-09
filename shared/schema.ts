import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  darkMode: boolean("dark_mode").default(false),
  uid: text("uid").unique(), // Firebase UID
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(), // Instagram, Twitter, LinkedIn, etc.
  followers: integer("followers").default(0),
  engagementRate: text("engagement_rate").default("0%"),
  totalPosts: integer("total_posts").default(0),
  responseTime: text("response_time").default("0 hrs"),
  date: timestamp("date").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // "follower", "comment", "campaign", "bookmark"
  message: text("message").notNull(),
  icon: text("icon"), // "user-add", "chat", "rocket", etc.
  timestamp: timestamp("timestamp").defaultNow(),
});

export const savedContent = pgTable("saved_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  platform: text("platform"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  photoURL: true,
  darkMode: true,
  uid: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  userId: true,
  platform: true,
  followers: true,
  engagementRate: true,
  totalPosts: true,
  responseTime: true,
  date: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  message: true,
  icon: true,
  timestamp: true,
});

export const insertSavedContentSchema = createInsertSchema(savedContent).pick({
  userId: true,
  title: true,
  description: true,
  imageUrl: true,
  platform: true,
  likes: true,
  comments: true,
  shares: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertSavedContent = z.infer<typeof insertSavedContentSchema>;
export type SavedContent = typeof savedContent.$inferSelect;

import { 
  users, type User, type InsertUser, 
  analytics, type Analytics, type InsertAnalytics,
  activities, type Activity, type InsertActivity,
  savedContent, type SavedContent, type InsertSavedContent
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Analytics operations
  getAnalytics(userId?: number): Promise<Analytics[]>;
  getAnalyticsByPlatform(userId: number, platform: string): Promise<Analytics[]>;
  createAnalytics(data: InsertAnalytics): Promise<Analytics>;
  
  // Activity operations
  getActivities(userId?: number): Promise<Activity[]>;
  getActivityById(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Saved content operations
  getSavedContent(userId?: number): Promise<SavedContent[]>;
  getSavedContentById(id: number): Promise<SavedContent | undefined>;
  getTopContent(userId?: number, limit?: number): Promise<SavedContent[]>;
  createSavedContent(content: InsertSavedContent): Promise<SavedContent>;
  deleteSavedContent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analytics: Map<number, Analytics>;
  private activities: Map<number, Activity>;
  private savedContent: Map<number, SavedContent>;
  
  // ID counters
  private userIdCounter: number;
  private analyticsIdCounter: number;
  private activityIdCounter: number;
  private contentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.analytics = new Map();
    this.activities = new Map();
    this.savedContent = new Map();
    
    this.userIdCounter = 1;
    this.analyticsIdCounter = 1;
    this.activityIdCounter = 1;
    this.contentIdCounter = 1;
    
    // Initialize with some demo data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.uid === uid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Analytics operations
  async getAnalytics(userId?: number): Promise<Analytics[]> {
    const allAnalytics = Array.from(this.analytics.values());
    if (userId) {
      return allAnalytics.filter(a => a.userId === userId);
    }
    return allAnalytics;
  }
  
  async getAnalyticsByPlatform(userId: number, platform: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(
      a => a.userId === userId && a.platform === platform
    );
  }
  
  async createAnalytics(data: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsIdCounter++;
    const newAnalytics: Analytics = { ...data, id };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }

  // Activity operations
  async getActivities(userId?: number): Promise<Activity[]> {
    const allActivities = Array.from(this.activities.values());
    if (userId) {
      return allActivities.filter(a => a.userId === userId);
    }
    return allActivities;
  }
  
  async getActivityById(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Saved content operations
  async getSavedContent(userId?: number): Promise<SavedContent[]> {
    const allContent = Array.from(this.savedContent.values());
    if (userId) {
      return allContent.filter(c => c.userId === userId);
    }
    return allContent;
  }
  
  async getSavedContentById(id: number): Promise<SavedContent | undefined> {
    return this.savedContent.get(id);
  }
  
  async getTopContent(userId?: number, limit: number = 3): Promise<SavedContent[]> {
    const relevantContent = userId 
      ? Array.from(this.savedContent.values()).filter(c => c.userId === userId)
      : Array.from(this.savedContent.values());
    
    // Sort by engagement (likes + comments + shares) and limit results
    return relevantContent
      .sort((a, b) => {
        const engagementA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
        const engagementB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
        return engagementB - engagementA;
      })
      .slice(0, limit);
  }
  
  async createSavedContent(content: InsertSavedContent): Promise<SavedContent> {
    const id = this.contentIdCounter++;
    const newContent: SavedContent = { ...content, id };
    this.savedContent.set(id, newContent);
    return newContent;
  }
  
  async deleteSavedContent(id: number): Promise<boolean> {
    return this.savedContent.delete(id);
  }
  
  // Initialize with demo data
  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: this.userIdCounter++,
      username: "sarahjohnson",
      password: "hashedpassword123", // In a real app, this would be hashed
      email: "sarah.johnson@example.com",
      displayName: "Sarah Johnson",
      photoURL: "https://randomuser.me/api/portraits/women/68.jpg",
      darkMode: false,
      uid: "demo123",
    };
    this.users.set(demoUser.id, demoUser);
    
    // Create analytics data
    const platforms = ["Instagram", "Twitter", "LinkedIn"];
    const now = new Date();
    
    platforms.forEach(platform => {
      const analyticsEntry: Analytics = {
        id: this.analyticsIdCounter++,
        userId: demoUser.id,
        platform,
        followers: Math.floor(Math.random() * 10000) + 2000,
        engagementRate: (Math.random() * 5 + 1.5).toFixed(1) + "%",
        totalPosts: Math.floor(Math.random() * 300) + 50,
        responseTime: Math.floor(Math.random() * 4 + 1) + "." + Math.floor(Math.random() * 9) + " hrs",
        date: now.toISOString(),
      };
      this.analytics.set(analyticsEntry.id, analyticsEntry);
    });
    
    // Create activity data
    const activityTypes = [
      { type: "follower", message: "23 new followers joined across your social accounts", icon: "user-add" },
      { type: "comment", message: "New comments on your post \"Launch Announcement\"", icon: "chat" },
      { type: "campaign", message: "Campaign completed \"Q3 Product Update\" reached 14,593 people", icon: "rocket" },
      { type: "bookmark", message: "You saved \"Content Strategy 2023\" to favorites", icon: "bookmark" },
    ];
    
    activityTypes.forEach((activity, index) => {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - (index + 1) * 6); // Spread activities over time
      
      const activityEntry: Activity = {
        id: this.activityIdCounter++,
        userId: demoUser.id,
        type: activity.type,
        message: activity.message,
        icon: activity.icon,
        timestamp: timestamp.toISOString(),
      };
      this.activities.set(activityEntry.id, activityEntry);
    });
    
    // Create saved content
    const contentItems = [
      {
        title: "How to Boost Your Social Media Presence",
        description: "Tips and tricks for growing your audience and improving engagement on social media platforms.",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        platform: "Instagram",
        likes: 2400,
        comments: 89,
        shares: 324,
      },
      {
        title: "10 Trends to Watch in 2023",
        description: "Stay ahead of the curve with these insights on emerging social media trends.",
        imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2",
        platform: "Twitter",
        likes: 1800,
        comments: 63,
        shares: 215,
      },
      {
        title: "Building a Strong Brand Identity",
        description: "Establish a unique and recognizable brand across all your social media channels.",
        imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
        platform: "LinkedIn",
        likes: 1500,
        comments: 42,
        shares: 187,
      }
    ];
    
    contentItems.forEach(item => {
      const savedContentEntry: SavedContent = {
        id: this.contentIdCounter++,
        userId: demoUser.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        platform: item.platform,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
        timestamp: new Date().toISOString(),
      };
      this.savedContent.set(savedContentEntry.id, savedContentEntry);
    });
  }
}

export const storage = new MemStorage();

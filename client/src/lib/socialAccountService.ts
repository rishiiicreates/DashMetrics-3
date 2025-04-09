import { SocialPlatform, SocialAuthState, SocialMediaMetrics } from "./socialAuth";

interface SocialCredentials {
  username: string;
  password: string;
}

// Check if a social media app is installed on the device
export async function checkAppInstalled(platform: SocialPlatform): Promise<boolean> {
  try {
    if (navigator.userAgent.includes('Mobile')) {
      // On mobile devices, we would normally use deep links or Universal Links/App Links
      // For now, simulate that apps are installed based on platform and random chance
      
      // Let's simulate having a 70% chance that the app is installed
      const isInstalled = Math.random() < 0.7;
      
      console.log(`[Device Check] ${platform} app installed: ${isInstalled}`);
      return isInstalled;
    } else {
      // On desktop, we might check for browser extensions or just move directly to OAuth
      // For demo, let's assume desktop users have browser access to the platform
      console.log(`[Device Check] Desktop detected, assuming ${platform} is accessible`);
      return true;
    }
  } catch (error) {
    console.error(`Error checking if ${platform} app is installed:`, error);
    return false;
  }
}

// This function handles login to social media platforms with app detection
// and returns account data for the specific user
export async function loginToSocialPlatform(
  platform: SocialPlatform, 
  credentials?: SocialCredentials
): Promise<SocialAuthState> {
  try {
    console.log(`Attempting to login to ${platform}...`);
    
    // Check if the app is installed
    const isAppInstalled = await checkAppInstalled(platform);
    
    if (isAppInstalled) {
      // If app is installed, simulate opening the app and getting auth via deep link
      console.log(`${platform} app detected! Attempting direct authentication...`);
      
      // Simulate app authorization process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real implementation, we would:
      // 1. Open the app via deep link with an auth request
      // 2. App would handle auth and redirect back to our app with token
      // 3. We would parse the token and create session
      
      // For demo, generate a username based on platform or use the one provided
      const username = credentials?.username || `user_${platform}_${Math.floor(Math.random() * 10000)}`;
      
      // Create auth state for the connected account via app
      const authState: SocialAuthState = {
        platform,
        accessToken: `app-token-${platform}-${Date.now()}`,
        refreshToken: `app-refresh-${platform}-${Date.now()}`,
        expiresAt: Date.now() + 3600000, // 1 hour from now
        connected: true,
        username: username,
        profileUrl: `https://${platform}.com/${username}`,
        connectedVia: 'app'
      };
      
      // Store the auth state in localStorage for persistence
      const allPlatforms = JSON.parse(localStorage.getItem('socialPlatforms') || '{}');
      allPlatforms[platform] = authState;
      localStorage.setItem('socialPlatforms', JSON.stringify(allPlatforms));
      
      return authState;
    } else {
      // If app is not installed, fall back to traditional login
      console.log(`${platform} app not detected. Using manual authentication...`);
      
      // Ensure credentials exist for manual login
      if (!credentials) {
        throw new Error(`No credentials provided and ${platform} app not detected`);
      }
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, if the password is "error", throw an error
      if (credentials.password === "error") {
        throw new Error(`Authentication failed for ${platform}`);
      }
      
      // Create a social auth state object for the connected account
      const authState: SocialAuthState = {
        platform,
        accessToken: `manual-token-${platform}-${Date.now()}`,
        refreshToken: `manual-refresh-${platform}-${Date.now()}`,
        expiresAt: Date.now() + 3600000, // 1 hour from now
        connected: true,
        username: credentials.username,
        profileUrl: `https://${platform}.com/${credentials.username}`,
        connectedVia: 'manual'
      };
      
      // Store the auth state in localStorage for persistence
      const allPlatforms = JSON.parse(localStorage.getItem('socialPlatforms') || '{}');
      allPlatforms[platform] = authState;
      localStorage.setItem('socialPlatforms', JSON.stringify(allPlatforms));
      
      return authState;
    }
  } catch (error) {
    console.error(`Error logging into ${platform}:`, error);
    throw error;
  }
}

// Get metrics for a specific social platform
export async function getSocialPlatformMetrics(
  platform: SocialPlatform, 
  username: string
): Promise<SocialMediaMetrics> {
  try {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate consistent but "random" metrics based on username and platform
    const usernameHash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const platformMultiplier = {
      'instagram': 1.2,
      'twitter': 0.8,
      'youtube': 1.5,
      'facebook': 1.0
    }[platform] || 1;
    
    // Base metrics that scale with username length
    const baseFollowers = (usernameHash * 100) * platformMultiplier;
    const baseEngagement = (usernameHash % 10) / 100; // 0% to 9%
    
    // Return platform-specific metrics
    const metrics: SocialMediaMetrics = {
      followers: Math.floor(baseFollowers),
      following: Math.floor(baseFollowers * 0.3),
      totalPosts: Math.floor((usernameHash % 500) + 10),
      engagement: baseEngagement + 0.01, // Minimum 1% engagement
      impressions: Math.floor(baseFollowers * 5),
      likes: Math.floor(baseFollowers * baseEngagement * 2),
      comments: Math.floor(baseFollowers * baseEngagement * 0.2),
      shares: Math.floor(baseFollowers * baseEngagement * 0.1),
      views: platform === 'youtube' ? Math.floor(baseFollowers * 20) : undefined,
      platformSpecific: getPlatformSpecificMetrics(platform, usernameHash)
    };
    
    return metrics;
  } catch (error) {
    console.error(`Error fetching ${platform} metrics:`, error);
    throw error;
  }
}

// Helper function to get platform-specific metrics
function getPlatformSpecificMetrics(platform: SocialPlatform, seedValue: number): Record<string, any> {
  switch (platform) {
    case 'youtube':
      return {
        subscribersGained: Math.floor(seedValue * 0.1),
        watchTime: Math.floor(seedValue * 60), // in minutes
        averageViewDuration: Math.floor(seedValue % 10) + 1, // in minutes
        topVideos: [
          { title: 'How to grow your channel', views: Math.floor(seedValue * 2) },
          { title: 'Tips and tricks', views: Math.floor(seedValue * 1.5) },
          { title: 'Product review', views: Math.floor(seedValue * 1.2) },
        ]
      };
    case 'instagram':
      return {
        reachRate: (seedValue % 50) + 10, // 10% to 60%
        saveRate: (seedValue % 10) + 1, // 1% to 11%
        topHashtags: ['#trending', '#viral', '#content'],
        storiesViews: Math.floor(seedValue * 0.7)
      };
    case 'twitter':
      return {
        retweetRate: (seedValue % 20) + 1, // 1% to 21%
        quoteRate: (seedValue % 5) + 1, // 1% to 6%
        impressionsPerTweet: Math.floor(seedValue * 0.5),
        topMentions: ['@user1', '@user2', '@user3']
      };
    case 'facebook':
      return {
        pageViews: Math.floor(seedValue * 1.1),
        pageFollowers: Math.floor(seedValue * 0.8),
        clickThroughRate: (seedValue % 15) + 5, // 5% to 20%
        reachByContentType: {
          photos: Math.floor(seedValue * 0.6),
          videos: Math.floor(seedValue * 0.9),
          links: Math.floor(seedValue * 0.3)
        }
      };
    default:
      return {};
  }
}
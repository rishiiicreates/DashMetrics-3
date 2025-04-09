import { toast } from '@/hooks/use-toast';

// Platform types
export type SocialPlatform = 'instagram' | 'twitter' | 'youtube' | 'facebook';

// Social auth state interface
export interface SocialAuthState {
  platform: SocialPlatform;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  connected: boolean;
  username?: string;
  profileUrl?: string;
  error?: string;
}

// Social API connection interfaces
export interface SocialMediaMetrics {
  followers: number;
  following?: number;
  totalPosts: number;
  engagement: number;
  impressions?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  platformSpecific?: Record<string, any>;
}

// Initial state for all platforms
const initialSocialAuthState: Record<SocialPlatform, SocialAuthState> = {
  instagram: {
    platform: 'instagram',
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    connected: false
  },
  twitter: {
    platform: 'twitter',
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    connected: false
  },
  youtube: {
    platform: 'youtube',
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    connected: false
  },
  facebook: {
    platform: 'facebook',
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    connected: false
  }
};

// Load state from localStorage
const loadSocialAuthState = (): Record<SocialPlatform, SocialAuthState> => {
  try {
    const savedState = localStorage.getItem('socialAuthState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load social auth state:', error);
  }
  return { ...initialSocialAuthState };
};

// Save state to localStorage
const saveSocialAuthState = (state: Record<SocialPlatform, SocialAuthState>): void => {
  try {
    localStorage.setItem('socialAuthState', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save social auth state:', error);
  }
};

// Get current auth state
export const getSocialAuthState = (): Record<SocialPlatform, SocialAuthState> => {
  return loadSocialAuthState();
};

// Check if platform is connected
export const isSocialPlatformConnected = (platform: SocialPlatform): boolean => {
  const state = loadSocialAuthState();
  return state[platform]?.connected || false;
};

// Simulate OAuth authentication for platforms
export const connectSocialPlatform = async (platform: SocialPlatform): Promise<SocialAuthState> => {
  // In a real implementation, this would redirect to the platform's OAuth flow
  // For demonstration, we'll simulate a successful connection
  
  // Create a mock successful connection
  const state = loadSocialAuthState();
  const now = Date.now();
  
  // Simulate auth process with random timeout for realistic effect
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const updatedState: SocialAuthState = {
    platform,
    accessToken: `mock_${platform}_token_${now}`,
    refreshToken: `mock_${platform}_refresh_${now}`,
    expiresAt: now + 3600000, // 1 hour from now
    connected: true,
    username: `user_${platform}`,
    profileUrl: `https://${platform}.com/user_profile`
  };
  
  // Update and save the state
  state[platform] = updatedState;
  saveSocialAuthState(state);
  
  // Show success notification
  toast({
    title: 'Connection Successful',
    description: `Your ${platform} account has been connected.`,
  });
  
  return updatedState;
};

// Disconnect a social platform
export const disconnectSocialPlatform = async (platform: SocialPlatform): Promise<void> => {
  // In a real implementation, revoke tokens etc.
  
  // Simulate disconnection process
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Reset the platform state
  const state = loadSocialAuthState();
  state[platform] = { ...initialSocialAuthState[platform] };
  saveSocialAuthState(state);
  
  // Show success notification
  toast({
    title: 'Disconnected',
    description: `Your ${platform} account has been disconnected.`,
  });
};

// Get metrics for a connected platform (mock data for now)
export const getSocialMediaMetrics = async (platform: SocialPlatform): Promise<SocialMediaMetrics | null> => {
  const state = loadSocialAuthState();
  
  if (!state[platform]?.connected) {
    return null;
  }
  
  // For demonstration, return mock data based on platform
  // In a real implementation, make API calls to the respective platforms
  switch (platform) {
    case 'instagram':
      return {
        followers: 2547,
        following: 1253,
        totalPosts: 187,
        engagement: 4.7,
        likes: 18923,
        comments: 2634,
        shares: 1274,
        platformSpecific: {
          reels: 23,
          stories: 342,
          avgReachPerPost: 1876
        }
      };
      
    case 'twitter':
      return {
        followers: 4281,
        following: 892,
        totalPosts: 1243,
        engagement: 2.3,
        impressions: 53942,
        likes: 8294,
        comments: 1234,
        shares: 3721,
        platformSpecific: {
          retweets: 2341,
          quoteTweets: 421,
          topHashtags: ['tech', 'data', 'analytics']
        }
      };
      
    case 'youtube':
      return {
        followers: 12843,
        totalPosts: 98,
        engagement: 6.2,
        impressions: 243982,
        likes: 31284,
        comments: 4827,
        views: 892742,
        platformSpecific: {
          subscribers: 12843,
          avgWatchTime: '4:32',
          totalWatchTimeHours: 23481
        }
      };
      
    case 'facebook':
      return {
        followers: 8743,
        totalPosts: 342,
        engagement: 3.8,
        impressions: 128943,
        likes: 27843,
        comments: 5823,
        shares: 4721,
        platformSpecific: {
          pageViews: 32842,
          reactions: {
            like: 21543,
            love: 4312,
            laugh: 1234,
            wow: 643,
            sad: 123,
            angry: 87
          }
        }
      };
      
    default:
      return null;
  }
};
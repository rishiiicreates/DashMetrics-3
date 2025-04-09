import { useState, useEffect, useCallback } from 'react';
import { 
  SocialPlatform, 
  SocialAuthState, 
  SocialMediaMetrics,
  connectSocialPlatform, 
  disconnectSocialPlatform, 
  getSocialAuthState
} from '@/lib/socialAuth';
import { loginToSocialPlatform, getSocialPlatformMetrics } from '@/lib/socialAccountService';

interface UseSocialConnectionsResult {
  platforms: Record<SocialPlatform, SocialAuthState>;
  metrics: Record<SocialPlatform, SocialMediaMetrics | null>;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isLoggingIn: boolean;
  isFetchingMetrics: boolean;
  connectPlatform: (platform: SocialPlatform) => Promise<void>;
  disconnectPlatform: (platform: SocialPlatform) => Promise<void>;
  loginWithCredentials: (platform: SocialPlatform, username?: string, password?: string) => Promise<SocialAuthState>;
  fetchMetrics: (platform: SocialPlatform) => Promise<void>;
  connectedCount: number;
  refreshConnections: () => void;
}

export function useSocialConnections(): UseSocialConnectionsResult {
  const [platforms, setPlatforms] = useState<Record<SocialPlatform, SocialAuthState>>(getSocialAuthState());
  const [metrics, setMetrics] = useState<Record<SocialPlatform, SocialMediaMetrics | null>>({
    instagram: null,
    twitter: null,
    youtube: null,
    facebook: null
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFetchingMetrics, setIsFetchingMetrics] = useState(false);
  
  // Refresh connections state
  const refreshConnections = useCallback(() => {
    setPlatforms(getSocialAuthState());
  }, []);
  
  // Load initial state
  useEffect(() => {
    refreshConnections();
  }, [refreshConnections]);
  
  // Connect to a platform
  const connectPlatform = useCallback(async (platform: SocialPlatform) => {
    try {
      setIsConnecting(true);
      const result = await connectSocialPlatform(platform);
      setPlatforms(prev => ({
        ...prev,
        [platform]: result
      }));
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);
  
  // Disconnect from a platform
  const disconnectPlatform = useCallback(async (platform: SocialPlatform) => {
    try {
      setIsDisconnecting(true);
      await disconnectSocialPlatform(platform);
      // Clear metrics when disconnecting
      setMetrics(prev => ({
        ...prev,
        [platform]: null
      }));
      refreshConnections();
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      throw error;
    } finally {
      setIsDisconnecting(false);
    }
  }, [refreshConnections]);
  
  // Login to a social platform with username/password or via app
  const loginWithCredentials = useCallback(async (
    platform: SocialPlatform, 
    username?: string, 
    password?: string
  ) => {
    try {
      setIsLoggingIn(true);
      
      // Call loginToSocialPlatform with optional credentials
      // If username/password are empty, it will try to use app-based login
      let credentials;
      if (username && password) {
        credentials = { username, password };
      }
      const authState = await loginToSocialPlatform(platform, credentials as any);
      
      // Update platforms state with new auth state
      setPlatforms(prev => ({
        ...prev,
        [platform]: authState
      }));
      
      // Automatically fetch metrics for the newly logged in account
      try {
        // Use the username that was returned from the auth state (might be generated for app login)
        const userForMetrics = authState.username || '';
        const platformMetrics = await getSocialPlatformMetrics(platform, userForMetrics);
        setMetrics(prev => ({
          ...prev,
          [platform]: platformMetrics
        }));
      } catch (metricsError) {
        console.error(`Error fetching initial metrics for ${platform}:`, metricsError);
      }
      
      return authState;
    } catch (error) {
      console.error(`Error logging into ${platform}:`, error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);
  
  // Fetch metrics for a specific platform
  const fetchMetrics = useCallback(async (platform: SocialPlatform) => {
    const platformState = platforms[platform];
    
    if (!platformState || !platformState.connected || !platformState.username) {
      throw new Error(`Platform ${platform} is not connected or missing username`);
    }
    
    try {
      setIsFetchingMetrics(true);
      const platformMetrics = await getSocialPlatformMetrics(
        platform, 
        platformState.username
      );
      
      setMetrics(prev => ({
        ...prev,
        [platform]: platformMetrics
      }));
    } catch (error) {
      console.error(`Error fetching metrics for ${platform}:`, error);
      throw error;
    } finally {
      setIsFetchingMetrics(false);
    }
  }, [platforms]);
  
  // Count connected platforms
  const connectedCount = Object.values(platforms).filter(p => p.connected).length;
  
  return {
    platforms,
    metrics,
    isConnecting,
    isDisconnecting,
    isLoggingIn,
    isFetchingMetrics,
    connectPlatform,
    disconnectPlatform,
    loginWithCredentials,
    fetchMetrics,
    connectedCount,
    refreshConnections
  };
}
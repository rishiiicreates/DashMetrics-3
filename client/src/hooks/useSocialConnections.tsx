import { useState, useEffect, useCallback } from 'react';
import { 
  SocialPlatform, 
  SocialAuthState, 
  connectSocialPlatform, 
  disconnectSocialPlatform, 
  getSocialAuthState 
} from '@/lib/socialAuth';

interface UseSocialConnectionsResult {
  platforms: Record<SocialPlatform, SocialAuthState>;
  isConnecting: boolean;
  isDisconnecting: boolean;
  connectPlatform: (platform: SocialPlatform) => Promise<void>;
  disconnectPlatform: (platform: SocialPlatform) => Promise<void>;
  connectedCount: number;
  refreshConnections: () => void;
}

export function useSocialConnections(): UseSocialConnectionsResult {
  const [platforms, setPlatforms] = useState<Record<SocialPlatform, SocialAuthState>>(getSocialAuthState());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
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
    } finally {
      setIsConnecting(false);
    }
  }, []);
  
  // Disconnect from a platform
  const disconnectPlatform = useCallback(async (platform: SocialPlatform) => {
    try {
      setIsDisconnecting(true);
      await disconnectSocialPlatform(platform);
      refreshConnections();
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
    } finally {
      setIsDisconnecting(false);
    }
  }, [refreshConnections]);
  
  // Count connected platforms
  const connectedCount = Object.values(platforms).filter(p => p.connected).length;
  
  return {
    platforms,
    isConnecting,
    isDisconnecting,
    connectPlatform,
    disconnectPlatform,
    connectedCount,
    refreshConnections
  };
}
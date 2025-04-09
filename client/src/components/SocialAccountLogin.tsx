import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SocialPlatform, SocialAuthState } from "@/lib/socialAuth";
import { Instagram, Twitter, Youtube, Facebook, Smartphone, User, Key } from "lucide-react";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SocialAccountLoginProps {
  platform: SocialPlatform | null;
  open: boolean;
  onClose: () => void;
  onLogin: (platform: SocialPlatform, username: string, password: string) => Promise<void>;
}

export function SocialAccountLogin({ platform, open, onClose, onLogin }: SocialAccountLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { platforms, metrics, disconnectPlatform } = useSocialConnections();
  const { toast } = useToast();

  // Reset form fields when dialog opens with new platform
  useEffect(() => {
    if (open && platform) {
      // If platform is connected, pre-fill username
      if (platforms[platform]?.connected && platforms[platform]?.username) {
        setUsername(platforms[platform].username || "");
      } else {
        setUsername("");
      }
      setPassword("");
    }
  }, [open, platform, platforms]);

  if (!platform) return null;
  
  const platformState = platforms[platform];
  const isConnected = platformState?.connected || false;
  const platformMetrics = metrics[platform];
  
  const platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);
  
  const getPlatformIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-6 w-6 text-pink-500" />;
      case 'twitter':
        return <Twitter className="h-6 w-6 text-blue-400" />;
      case 'youtube':
        return <Youtube className="h-6 w-6 text-red-500" />;
      case 'facebook':
        return <Facebook className="h-6 w-6 text-blue-600" />;
      default:
        return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await onLogin(platform, username, password);
      toast({
        title: "Login successful",
        description: `Successfully logged in to your ${platformTitle} account.`
      });
      onClose();
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      await disconnectPlatform(platform);
      onClose();
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Failed to disconnect",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  // Connected account view
  if (isConnected) {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {getPlatformIcon()}
              <DialogTitle>{platformTitle} Account</DialogTitle>
            </div>
            <DialogDescription>
              Your {platformTitle} account is connected via {platformState.connectedVia || 'manual login'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Account Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{platformState.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Connection Type</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {platformState.connectedVia || 'Manual'} Connection
                  </p>
                </div>
              </div>
              
              {platformState.connectedVia === 'app' && (
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">App Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connected via native {platformTitle} app
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Metrics Summary */}
            {platformMetrics && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Account Metrics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Followers</p>
                      <p className="text-lg font-semibold">{platformMetrics.followers.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Posts</p>
                      <p className="text-lg font-semibold">{platformMetrics.totalPosts.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Engagement</p>
                      <p className="text-lg font-semibold">{(platformMetrics.engagement * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">
                        {platform === 'youtube' ? 'Views' : 'Impressions'}
                      </p>
                      <p className="text-lg font-semibold">
                        {(platformMetrics.views || platformMetrics.impressions || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter className="pt-4 space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDisconnect}
            >
              Disconnect Account
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                // Disconnect current account first
                disconnectPlatform(platform);
                
                // Then immediately open the form for new connection
                setPassword("");
                setIsLoading(false);
                
                // Create slight delay to allow state to update
                setTimeout(() => {
                  toast({
                    title: "Connect new account",
                    description: `Enter credentials for a different ${platformTitle} account`,
                  });
                }, 300);
              }}
            >
              Connect Different Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Login form view for new connection
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getPlatformIcon()}
            <DialogTitle>Connect to {platformTitle}</DialogTitle>
          </div>
          <DialogDescription>
            Enter your {platformTitle} credentials to connect and display analytics for this account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`Your ${platformTitle} username`}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="ml-2"
            >
              {isLoading ? "Connecting..." : "Connect Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
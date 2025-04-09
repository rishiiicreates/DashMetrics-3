import { useState } from "react";
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
import { SocialPlatform } from "@/lib/socialAuth";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

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
  const { toast } = useToast();

  if (!platform) return null;
  
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
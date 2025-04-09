import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Bookmark, History, Bell, Settings, 
  LogOut, ChevronLeft, ChevronRight, 
  User as UserIcon, PlusCircle, Instagram, Twitter, Youtube, Facebook
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  SocialPlatform, 
  isSocialPlatformConnected, 
  getSocialAuthState 
} from "@/lib/socialAuth";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SocialAccountLogin } from "@/components/SocialAccountLogin";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
  collapsed?: boolean;
}

const SidebarItem = ({ 
  icon, 
  label, 
  href, 
  active, 
  badge, 
  collapsed 
}: SidebarItemProps) => {
  return (
    <Link href={href}>
      <a className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
        active 
          ? "bg-primary bg-opacity-10 text-primary" 
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
      )}>
        <div className="text-xl">{icon}</div>
        {!collapsed && (
          <>
            <span className="font-medium">{label}</span>
            {badge && (
              <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </>
        )}
      </a>
    </Link>
  );
};

// Get the social platform icon
const getPlatformIcon = (platform: SocialPlatform): JSX.Element => {
  switch (platform) {
    case 'instagram':
      return <Instagram />;
    case 'twitter':
      return <Twitter />;
    case 'youtube':
      return <Youtube />;
    case 'facebook':
      return <Facebook />;
    default:
      return <UserIcon />;
  }
};

// Get platform color
const getPlatformColor = (platform: SocialPlatform): string => {
  switch (platform) {
    case 'instagram':
      return 'text-pink-500';
    case 'twitter':
      return 'text-blue-400';
    case 'youtube':
      return 'text-red-500';
    case 'facebook':
      return 'text-blue-600';
    default:
      return 'text-gray-500';
  }
};

interface SocialAccountProps {
  platform: SocialPlatform;
  username?: string;
  connected: boolean;
  collapsed: boolean;
  onLogin: (platform: SocialPlatform) => void;
}

const SocialAccount = ({ 
  platform, 
  username, 
  connected, 
  collapsed,
  onLogin
}: SocialAccountProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={() => onLogin(platform)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors w-full",
              connected 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "opacity-50 hover:opacity-80"
            )}
          >
            <div className={cn("text-xl", getPlatformColor(platform))}>
              {getPlatformIcon(platform)}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800 dark:text-white truncate">
                    {connected ? username || platform : `Connect ${platform}`}
                  </p>
                  {connected && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </p>
                  )}
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  connected ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                )}></div>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {connected 
            ? `Logged in as ${username || platform}` 
            : `Connect ${platform} account`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const { 
    platforms, 
    metrics,
    connectPlatform, 
    loginWithCredentials, 
    fetchMetrics,
    isLoggingIn
  } = useSocialConnections();
  const [showLoginModal, setShowLoginModal] = useState<SocialPlatform | null>(null);
  
  const handleSocialLogin = (platform: SocialPlatform) => {
    // If already connected, show platform-specific data or allow sign in with different account
    if (platforms[platform].connected) {
      setShowLoginModal(platform);
    } else {
      // Show login modal for the platform
      setShowLoginModal(platform);
    }
  };
  
  const handleCredentialsLogin = async (platform: SocialPlatform, username: string, password: string) => {
    try {
      await loginWithCredentials(platform, username, password);
      setShowLoginModal(null);
      toast({
        title: "Connected successfully",
        description: `Your ${platform} account has been connected and data is being fetched.`
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error logging out",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-soft transition-all h-screen",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          {!collapsed && <h1 className="text-xl font-bold text-gray-800 dark:text-white">DashMetrics</h1>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          href="/" 
          active={location === "/"} 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Bookmark />} 
          label="Saved Content" 
          href="/saved" 
          active={location === "/saved"} 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<History />} 
          label="Activity" 
          href="/activity" 
          active={location === "/activity"} 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Bell />} 
          label="Notifications" 
          href="/notifications" 
          active={location === "/notifications"} 
          badge={3} 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={<Settings />} 
          label="Settings" 
          href="/settings" 
          active={location === "/settings"} 
          collapsed={collapsed}
        />
        
        {/* Connected Accounts Section - YouTube Studio style */}
        <div className="mt-6">
          {!collapsed && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Connected Accounts
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSocialLogin(platforms.instagram.connected ? 'instagram' : 'youtube')}
              >
                <PlusCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          )}
          {collapsed && <Separator className="my-4" />}
          
          <div className="space-y-1">
            {Object.entries(platforms).map(([key, value]) => (
              <SocialAccount
                key={key}
                platform={key as SocialPlatform}
                username={value.username}
                connected={value.connected}
                collapsed={collapsed}
                onLogin={handleSocialLogin}
              />
            ))}
          </div>
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback>
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 dark:text-white truncate">
                {user?.displayName || "User"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Pro Account
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>
      </div>
      
      {/* Social Account Login Modal */}
      <SocialAccountLogin 
        platform={showLoginModal}
        open={showLoginModal !== null}
        onClose={() => setShowLoginModal(null)}
        onLogin={handleCredentialsLogin}
      />
    </div>
  );
}

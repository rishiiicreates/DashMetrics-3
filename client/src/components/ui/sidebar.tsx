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
  User as UserIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  
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
    </div>
  );
}

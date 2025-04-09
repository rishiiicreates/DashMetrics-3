import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Search, 
  Bell, 
  Download, 
  RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDark, setIsDark] = useState(false);
  
  // Parse the date range from the URL or use default
  const searchParams = new URLSearchParams(window.location.search);
  const dateRange = searchParams.get("dateRange") || "7d";
  
  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries();
    toast({
      title: "Data refreshed",
      description: "Your dashboard data has been updated.",
    });
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    // Update URL with new date range
    const url = new URL(window.location.toString());
    url.searchParams.set("dateRange", range);
    window.history.pushState({}, "", url);
    
    // Invalidate queries to refresh data with new date range
    queryClient.invalidateQueries();
  };
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-white font-sans bg-noise">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Search Bar */}
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Notifications">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Export Data">
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleDarkMode} />
              <Label htmlFor="dark-mode" className="text-sm font-medium text-gray-600 dark:text-gray-400">Dark Mode</Label>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-light-bg dark:bg-dark-bg bg-noise">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <select 
                className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="year">This year</option>
              </select>
              <Button onClick={handleRefresh} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
}

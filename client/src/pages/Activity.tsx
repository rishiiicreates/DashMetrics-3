import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Activity as ActivityType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { 
  User, MessageSquare, Rocket, Bookmark, 
  MoreVertical, Search, Calendar, Filter 
} from "lucide-react";

export default function Activity() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get activity data
  const { data: activityData, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });
  
  // Mocked activities data (would come from API)
  const activities: ActivityType[] = [
    {
      id: 1,
      userId: 1,
      type: "follower",
      message: "23 new followers joined across your social accounts",
      icon: "user-add",
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      id: 2,
      userId: 1,
      type: "comment",
      message: "New comments on your post \"Launch Announcement\"",
      icon: "chat",
      timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    },
    {
      id: 3,
      userId: 1,
      type: "campaign",
      message: "Campaign completed \"Q3 Product Update\" reached 14,593 people",
      icon: "rocket",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
      id: 4,
      userId: 1,
      type: "bookmark",
      message: "You saved \"Content Strategy 2023\" to favorites",
      icon: "bookmark",
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: 5,
      userId: 1,
      type: "follower",
      message: "18 new followers joined across your social accounts",
      icon: "user-add",
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
    {
      id: 6,
      userId: 1,
      type: "comment",
      message: "New comments on your post \"Product Improvement\"",
      icon: "chat",
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    },
    {
      id: 7,
      userId: 1,
      type: "campaign",
      message: "Campaign started \"Holiday Special Offer\"",
      icon: "rocket",
      timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    },
    {
      id: 8,
      userId: 1,
      type: "bookmark",
      message: "You saved \"Marketing Strategies for 2023\" to favorites",
      icon: "bookmark",
      timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    },
  ];
  
  // Filter activities based on search query
  const filteredActivities = activities.filter(activity =>
    activity.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group activities by date
  const groupedActivities: Record<string, ActivityType[]> = {};
  filteredActivities.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!groupedActivities[dateStr]) {
      groupedActivities[dateStr] = [];
    }
    
    groupedActivities[dateStr].push(activity);
  });
  
  const getIconForType = (type: string) => {
    switch (type) {
      case "follower":
        return <User className="text-primary" />;
      case "comment":
        return <MessageSquare className="text-[#11CDEF]" />;
      case "campaign":
        return <Rocket className="text-[#2DCE89]" />;
      case "bookmark":
        return <Bookmark className="text-[#FFB236]" />;
      default:
        return <User className="text-primary" />;
    }
  };
  
  const getIconBgForType = (type: string) => {
    switch (type) {
      case "follower":
        return "bg-primary/10";
      case "comment":
        return "bg-[#11CDEF]/10";
      case "campaign":
        return "bg-[#2DCE89]/10";
      case "bookmark":
        return "bg-[#FFB236]/10";
      default:
        return "bg-primary/10";
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return "Today";
    } else if (date.getDate() === yesterday.getDate() && 
              date.getMonth() === yesterday.getMonth() && 
              date.getFullYear() === yesterday.getFullYear()) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };
  
  return (
    <DashboardLayout 
      title="Activity Feed" 
      subtitle="Track all changes and actions across your accounts"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
        </div>
        
        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No activities found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div>
                {Object.keys(groupedActivities).sort().reverse().map((dateStr) => (
                  <div key={dateStr} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      {formatDate(dateStr)}
                    </h3>
                    <div className="space-y-4">
                      {groupedActivities[dateStr].map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-full ${getIconBgForType(activity.type)} flex items-center justify-center mt-1 flex-shrink-0`}>
                            {getIconForType(activity.type)}
                          </div>
                          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {activity.message}
                              </p>
                              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-2">
                                <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              </Button>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

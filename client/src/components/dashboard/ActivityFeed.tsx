import { Activity } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { User, MessageSquare, Rocket, Bookmark, MoreVertical } from "lucide-react";

interface ActivityFeedProps {
  activities?: Activity[];
  isLoading?: boolean;
}

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

export function ActivityFeed({ activities = [], isLoading = false }: ActivityFeedProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          <Button variant="link" className="text-sm text-primary px-0 font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      
      {isLoading ? (
        <CardContent className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      ) : activities.length === 0 ? (
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities</p>
        </CardContent>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {activities.map((activity, index) => (
            <div key={index} className="p-4 flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-full ${getIconBgForType(activity.type)} flex items-center justify-center mt-1 flex-shrink-0`}>
                {getIconForType(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {activity.message}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

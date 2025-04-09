import { SavedContent } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageSquare, Share2 } from "lucide-react";

interface TopContentProps {
  content?: SavedContent[];
  isLoading?: boolean;
}

export function TopContent({ content = [], isLoading = false }: TopContentProps) {
  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Top Content</CardTitle>
          <div className="relative">
            <Select defaultValue="instagram">
              <SelectTrigger className="w-[130px] h-9 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-sm">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      {isLoading ? (
        <CardContent className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      ) : content.length === 0 ? (
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No content available</p>
        </CardContent>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {content.map((item, index) => (
            <div key={index} className="p-4 flex space-x-3">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                  {item.title}
                </h4>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Heart className="text-[#F5365C] h-3 w-3 mr-1" /> {item.likes || 0}
                  </span>
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MessageSquare className="text-[#11CDEF] h-3 w-3 mr-1" /> {item.comments || 0}
                  </span>
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Share2 className="text-primary h-3 w-3 mr-1" /> {item.shares || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-4 text-center">
        <Button variant="outline" className="w-full">
          View All Content
        </Button>
      </div>
    </Card>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SavedContent as SavedContentType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, Share2, Bookmark, MoreVertical, Search, Filter } from "lucide-react";

export default function SavedContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  
  // Get saved content
  const { data: savedContentData, isLoading } = useQuery({
    queryKey: ["/api/content/saved"],
  });
  
  // Mocked saved content (would come from API)
  const savedContent: SavedContentType[] = [
    {
      id: 1,
      userId: 1,
      title: "How to Boost Your Social Media Presence",
      description: "Tips and tricks for growing your audience and improving engagement on social media platforms.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      platform: "Instagram",
      likes: 2400,
      comments: 89,
      shares: 324,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 1,
      title: "10 Trends to Watch in 2023",
      description: "Stay ahead of the curve with these insights on emerging social media trends.",
      imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2",
      platform: "Twitter",
      likes: 1800,
      comments: 63,
      shares: 215,
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      userId: 1,
      title: "Building a Strong Brand Identity",
      description: "Establish a unique and recognizable brand across all your social media channels.",
      imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
      platform: "LinkedIn",
      likes: 1500,
      comments: 42,
      shares: 187,
      timestamp: new Date().toISOString(),
    },
    {
      id: 4,
      userId: 1,
      title: "Content Creation Strategies",
      description: "Learn how to create engaging content that resonates with your audience.",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
      platform: "Instagram",
      likes: 3200,
      comments: 126,
      shares: 430,
      timestamp: new Date().toISOString(),
    },
    {
      id: 5,
      userId: 1,
      title: "Optimizing Your Social Media Schedule",
      description: "Find the perfect posting schedule to maximize engagement and reach.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      platform: "Twitter",
      likes: 1200,
      comments: 37,
      shares: 145,
      timestamp: new Date().toISOString(),
    },
    {
      id: 6,
      userId: 1,
      title: "Analytics Deep Dive",
      description: "Understanding your social media metrics to make data-driven decisions.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      platform: "LinkedIn",
      likes: 870,
      comments: 28,
      shares: 92,
      timestamp: new Date().toISOString(),
    },
  ];
  
  // Filter content based on search query and platform filter
  const filteredContent = savedContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (content.description && content.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPlatform = filterPlatform === "all" || content.platform.toLowerCase() === filterPlatform.toLowerCase();
    
    return matchesSearch && matchesPlatform;
  });
  
  return (
    <DashboardLayout 
      title="Saved Content" 
      subtitle="View and manage your bookmarked posts and articles"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search saved content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredContent.length} items
            </span>
          </div>
          
          {/* Grid View */}
          <TabsContent value="grid" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No saved content found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 relative">
                      {content.imageUrl && (
                        <img 
                          src={content.imageUrl} 
                          alt={content.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="icon" className="bg-white/80 dark:bg-gray-800/80 rounded-full h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
                        {content.platform}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">{content.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {content.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Heart className="h-3.5 w-3.5 text-[#F5365C] mr-1" />
                            {content.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <MessageSquare className="h-3.5 w-3.5 text-[#11CDEF] mr-1" />
                            {content.comments.toLocaleString()}
                          </span>
                          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Share2 className="h-3.5 w-3.5 text-primary mr-1" />
                            {content.shares.toLocaleString()}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400 fill-current" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* List View */}
          <TabsContent value="list" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No saved content found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-32 bg-gray-200 dark:bg-gray-700 relative flex-shrink-0">
                        {content.imageUrl && (
                          <img 
                            src={content.imageUrl} 
                            alt={content.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
                          {content.platform}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">{content.title}</h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {content.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-3">
                            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Heart className="h-3.5 w-3.5 text-[#F5365C] mr-1" />
                              {content.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <MessageSquare className="h-3.5 w-3.5 text-[#11CDEF] mr-1" />
                              {content.comments.toLocaleString()}
                            </span>
                            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Share2 className="h-3.5 w-3.5 text-primary mr-1" />
                              {content.shares.toLocaleString()}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400 fill-current" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AudienceGrowthChart } from "@/components/dashboard/AudienceGrowthChart";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TopContent } from "@/components/dashboard/TopContent";
import { SocialMediaConnector } from "@/components/SocialMediaConnector";
import { SocialMediaMetrics } from "@/components/SocialMediaMetrics";
import { Activity, SavedContent } from "@shared/schema";
import { UserPlus, MessageSquare, FileText, Clock } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

export default function Dashboard() {
  // Get analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/analytics"],
  });
  
  // Get activities data
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["/api/activities"],
  });
  
  // Get top content data
  const { data: topContentData, isLoading: isLoadingTopContent } = useQuery({
    queryKey: ["/api/content/top"],
  });
  
  // Prepare growth chart data
  const audienceGrowthData = [
    { name: "Mon", instagram: 2500, twitter: 1800, linkedin: 1200 },
    { name: "Tue", instagram: 3500, twitter: 2100, linkedin: 1400 },
    { name: "Wed", instagram: 3100, twitter: 1900, linkedin: 1300 },
    { name: "Thu", instagram: 4200, twitter: 2400, linkedin: 1700 },
    { name: "Fri", instagram: 4000, twitter: 2300, linkedin: 1600 },
    { name: "Sat", instagram: 4800, twitter: 2700, linkedin: 1900 },
    { name: "Sun", instagram: 5500, twitter: 3200, linkedin: 2200 },
  ];
  
  // Prepare engagement chart data
  const engagementData = [
    { name: "Likes", value: 42, color: "hsl(222.2 84.5% 63.3%)", percentage: "42%" },
    { name: "Comments", value: 31, color: "#11CDEF", percentage: "31%" },
    { name: "Shares", value: 27, color: "#FB6340", percentage: "27%" },
  ];
  
  // Mocked activities data (would come from API)
  const activities: Activity[] = [
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
  ];
  
  // Mocked top content data (would come from API)
  const topContent: SavedContent[] = [
    {
      id: 1,
      userId: 1,
      title: "How to Boost Your Social Media Presence",
      description: "Tips and tricks for growing your audience",
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
      description: "Stay ahead of the curve with these insights",
      imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2",
      platform: "Instagram",
      likes: 1800,
      comments: 63,
      shares: 215,
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      userId: 1,
      title: "Building a Strong Brand Identity",
      description: "Establish a unique and recognizable brand",
      imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
      platform: "Instagram",
      likes: 1500,
      comments: 42,
      shares: 187,
      timestamp: new Date().toISOString(),
    },
  ];
  
  return (
    <DashboardLayout 
      title="Analytics Dashboard" 
      subtitle="Get insights on your social media performance"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Social Media Connector */}
        <motion.div variants={itemVariants} className="mb-8">
          <SocialMediaConnector />
        </motion.div>
        
        {/* Social Media Metrics */}
        <motion.div variants={itemVariants}>
          <SocialMediaMetrics />
        </motion.div>
        
        {/* Stats Overview Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <StatCard
                title="Total Followers"
                value="12,483"
                change={{ value: "8.2%", isPositive: true }}
                icon={UserPlus}
                iconColor="primary"
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <StatCard
                title="Engagement Rate"
                value="4.6%"
                change={{ value: "1.2%", isPositive: false }}
                icon={MessageSquare}
                iconColor="secondary"
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <StatCard
                title="Total Posts"
                value="342"
                change={{ value: "12.3%", isPositive: true }}
                icon={FileText}
                iconColor="accent"
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <StatCard
                title="Avg. Response Time"
                value="2.4 hrs"
                change={{ value: "5.1%", isPositive: true }}
                icon={Clock}
                iconColor="warning"
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Chart Section */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 } 
              }}
              className="col-span-2"
            >
              <AudienceGrowthChart 
                data={audienceGrowthData} 
                isLoading={isLoadingAnalytics} 
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 } 
              }}
            >
              <EngagementChart 
                data={engagementData} 
                average="4.6%" 
                isLoading={isLoadingAnalytics} 
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Recent Activity & Top Content */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 } 
              }}
              className="lg:col-span-1"
            >
              <ActivityFeed 
                activities={activities} 
                isLoading={isLoadingActivities} 
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 } 
              }}
              className="lg:col-span-2"
            >
              <TopContent 
                content={topContent} 
                isLoading={isLoadingTopContent} 
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

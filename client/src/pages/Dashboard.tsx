import { useState, useEffect, useMemo } from "react";
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
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { SocialPlatform } from "@/lib/socialAuth";

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
  // Get connected accounts and their metrics
  const { platforms, metrics, fetchMetrics } = useSocialConnections();
  
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
  
  // Fetch metrics for all connected platforms on load and when connections change
  useEffect(() => {
    Object.entries(platforms).forEach(([platform, state]) => {
      if (state.connected && state.username) {
        fetchMetrics(platform as SocialPlatform).catch(console.error);
      }
    });
  }, [platforms, fetchMetrics]);
  
  // Calculate total followers across all platforms
  const totalFollowers = useMemo(() => {
    return Object.values(metrics)
      .filter(m => m !== null)
      .reduce((sum, m) => sum + m.followers, 0);
  }, [metrics]);
  
  // Calculate average engagement rate
  const averageEngagement = useMemo(() => {
    const engagements = Object.values(metrics)
      .filter(m => m !== null)
      .map(m => m.engagement);
      
    if (engagements.length === 0) return 0;
    const average = engagements.reduce((sum, val) => sum + val, 0) / engagements.length;
    return average;
  }, [metrics]);
  
  // Calculate total posts across all platforms
  const totalPosts = useMemo(() => {
    return Object.values(metrics)
      .filter(m => m !== null)
      .reduce((sum, m) => sum + m.totalPosts, 0);
  }, [metrics]);
  
  // Prepare growth chart data from connected accounts
  const audienceGrowthData = useMemo(() => {
    // Start with default days
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // Get connected platforms for chart
    const connectedPlatforms = Object.entries(platforms)
      .filter(([_, state]) => state.connected)
      .map(([platform]) => platform);
      
    // Create the data structure needed for the chart
    return daysOfWeek.map((day, index) => {
      // Create a data point for each day with the connected platforms
      const dataPoint: any = { name: day };
      
      // For each connected platform, add mock data based on metrics
      connectedPlatforms.forEach(platform => {
        const platformMetrics = metrics[platform as SocialPlatform];
        if (platformMetrics) {
          // Use the user's real follower count and generate daily data around it
          const baseValue = platformMetrics.followers / 7; // divide by days of week
          // Make it fluctuate a bit for a natural chart
          const factor = 0.9 + (index / 10) + (Math.random() * 0.3);
          dataPoint[platform] = Math.round(baseValue * factor);
        }
      });
      
      return dataPoint;
    });
  }, [platforms, metrics]);
  
  // Prepare engagement chart data from connected accounts
  const engagementData = useMemo(() => {
    // Aggregated engagement metrics across platforms
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    
    // Sum up all the metrics from connected platforms
    Object.values(metrics)
      .filter(m => m !== null)
      .forEach(m => {
        totalLikes += m.likes || 0;
        totalComments += m.comments || 0;
        totalShares += m.shares || 0;
      });
      
    const total = totalLikes + totalComments + totalShares;
    
    // If no data yet, return empty values
    if (total === 0) {
      return [
        { name: "Likes", value: 0, color: "hsl(222.2 84.5% 63.3%)", percentage: "0%" },
        { name: "Comments", value: 0, color: "#11CDEF", percentage: "0%" },
        { name: "Shares", value: 0, color: "#FB6340", percentage: "0%" },
      ];
    }
    
    // Calculate percentages
    const likesPercent = Math.round((totalLikes / total) * 100);
    const commentsPercent = Math.round((totalComments / total) * 100);
    const sharesPercent = Math.round((totalShares / total) * 100);
    
    return [
      { name: "Likes", value: likesPercent, color: "hsl(222.2 84.5% 63.3%)", percentage: `${likesPercent}%` },
      { name: "Comments", value: commentsPercent, color: "#11CDEF", percentage: `${commentsPercent}%` },
      { name: "Shares", value: sharesPercent, color: "#FB6340", percentage: `${sharesPercent}%` },
    ];
  }, [metrics]);
  
  // Mocked activities data (would come from API)
  const activities: Activity[] = [
    {
      id: 1,
      userId: 1,
      type: "follower",
      message: "23 new followers joined across your social accounts",
      icon: "user-add",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: 2,
      userId: 1,
      type: "comment",
      message: "New comments on your post \"Launch Announcement\"",
      icon: "chat",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    },
    {
      id: 3,
      userId: 1,
      type: "campaign",
      message: "Campaign completed \"Q3 Product Update\" reached 14,593 people",
      icon: "rocket",
      timestamp: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      id: 4,
      userId: 1,
      type: "bookmark",
      message: "You saved \"Content Strategy 2023\" to favorites",
      icon: "bookmark",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
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
      timestamp: new Date(),
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
      timestamp: new Date(),
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
      timestamp: new Date(),
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
                value={totalFollowers.toLocaleString()}
                change={{ 
                  value: "8.2%", // In a real app, we would calculate growth over time
                  isPositive: true 
                }}
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
                value={`${(averageEngagement * 100).toFixed(1)}%`}
                change={{ 
                  value: "1.2%", 
                  isPositive: averageEngagement > 0.04 // 4% is considered good
                }}
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
                value={totalPosts.toLocaleString()}
                change={{ 
                  value: "12.3%",
                  isPositive: true 
                }}
                icon={FileText}
                iconColor="accent"
              />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <StatCard
                title="Connected Accounts"
                value={Object.values(platforms).filter(p => p.connected).length.toString()}
                change={{ 
                  value: `${Object.values(platforms).filter(p => p.connected).length}/4`,
                  isPositive: Object.values(platforms).filter(p => p.connected).length > 0
                }}
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
                average={`${(averageEngagement * 100).toFixed(1)}%`}
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

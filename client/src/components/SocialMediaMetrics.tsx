import { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook, FaChartLine, FaUsers, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getSocialMediaMetrics, isSocialPlatformConnected, SocialPlatform } from '@/lib/socialAuth';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

const counterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0.3
    }
  }
};

// Helper function to get platform colors
const getPlatformColor = (platform: SocialPlatform): string => {
  switch (platform) {
    case 'instagram': return '#E1306C';
    case 'twitter': return '#1DA1F2';
    case 'youtube': return '#FF0000';
    case 'facebook': return '#4267B2';
    default: return '#888888';
  }
};

// Helper function to get platform icons
const getPlatformIcon = (platform: SocialPlatform, className: string = 'w-6 h-6'): JSX.Element => {
  switch (platform) {
    case 'instagram': return <FaInstagram className={className} />;
    case 'twitter': return <FaTwitter className={className} />;
    case 'youtube': return <FaYoutube className={className} />;
    case 'facebook': return <FaFacebook className={className} />;
    default: return <FaChartLine className={className} />;
  }
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    let startTimestamp: number | null = null;
    
    // Don't animate small numbers
    if (value <= 10) {
      setCount(value);
      return;
    }
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (value - start) + start);
      
      setCount(currentCount);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    
    window.requestAnimationFrame(step);
    
    return () => {
      startTimestamp = null;
    };
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

// Metric card component
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color,
  delay = 0,
  animate = true
}: { 
  title: string; 
  value: number; 
  icon: JSX.Element; 
  color: string;
  delay?: number;
  animate?: boolean;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="flex-1"
    >
      <Card className="border-t-4 h-full" style={{ borderTopColor: color }}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <motion.h3 
                variants={counterVariants}
                className="text-2xl font-bold mt-1"
              >
                {animate ? <AnimatedCounter value={value} /> : value.toLocaleString()}
              </motion.h3>
            </div>
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800" style={{ color }}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Platform tab component
const PlatformTab = ({ platform, isActive }: { platform: SocialPlatform; isActive: boolean }) => {
  const color = getPlatformColor(platform);
  const icon = getPlatformIcon(platform);
  
  return (
    <TabsTrigger value={platform} className="flex items-center space-x-2 px-4 py-2">
      <span style={{ color: isActive ? color : undefined }}>{icon}</span>
      <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
    </TabsTrigger>
  );
};

export function SocialMediaMetrics() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [activeTab, setActiveTab] = useState<SocialPlatform>('instagram');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Record<SocialPlatform, any>>({
    instagram: null,
    twitter: null,
    youtube: null,
    facebook: null
  });
  
  const platforms: SocialPlatform[] = ['instagram', 'twitter', 'youtube', 'facebook'];
  
  // Check which platforms are connected
  const connectedPlatforms = platforms.filter(platform => 
    isSocialPlatformConnected(platform)
  );
  
  useEffect(() => {
    // Set first connected platform as active if available
    if (connectedPlatforms.length > 0 && !isSocialPlatformConnected(activeTab)) {
      setActiveTab(connectedPlatforms[0]);
    }
    
    // Load metrics for all connected platforms
    const loadMetrics = async () => {
      setLoading(true);
      
      const newMetrics: Record<SocialPlatform, any> = { ...metrics };
      
      for (const platform of connectedPlatforms) {
        try {
          const data = await getSocialMediaMetrics(platform);
          newMetrics[platform] = data;
        } catch (error) {
          console.error(`Error loading ${platform} metrics:`, error);
        }
      }
      
      setMetrics(newMetrics);
      setLoading(false);
    };
    
    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedPlatforms.join(',')]);

  return (
    <div className="space-y-6" ref={ref}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center"
        >
          <h2 className="text-2xl font-bold">Social Media Performance</h2>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            {connectedPlatforms.length}/{platforms.length} Platforms
          </Badge>
        </motion.div>

        {connectedPlatforms.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FaChartLine className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Platforms Connected</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Connect your social media accounts to view your performance metrics and analytics here.
            </p>
          </motion.div>
        ) : (
          <MotionConfig transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as SocialPlatform)}
              className="w-full"
            >
              <motion.div variants={itemVariants}>
                <TabsList className="w-full justify-start space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                  {connectedPlatforms.map((platform) => (
                    <PlatformTab
                      key={platform}
                      platform={platform}
                      isActive={platform === activeTab}
                    />
                  ))}
                </TabsList>
              </motion.div>

              {connectedPlatforms.map((platform) => (
                <TabsContent key={platform} value={platform} className="mt-6 focus:outline-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {loading || !metrics[platform] ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-1">
                              <Card className="border-t-4 h-full">
                                <CardContent className="pt-6">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                      <Skeleton className="h-4 w-20" />
                                      <Skeleton className="h-6 w-16" />
                                    </div>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                          <MetricCard
                            title="Followers"
                            value={metrics[platform].followers}
                            icon={<FaUsers className="w-5 h-5" />}
                            color={getPlatformColor(platform)}
                            delay={0.1}
                          />
                          <MetricCard
                            title="Engagement"
                            value={metrics[platform].engagement}
                            icon={<FaChartLine className="w-5 h-5" />}
                            color={getPlatformColor(platform)}
                            delay={0.2}
                          />
                          <MetricCard
                            title="Posts"
                            value={metrics[platform].totalPosts}
                            icon={getPlatformIcon(platform, "w-5 h-5")}
                            color={getPlatformColor(platform)}
                            delay={0.3}
                          />
                          <MetricCard
                            title="Interactions"
                            value={
                              (metrics[platform].likes || 0) + 
                              (metrics[platform].comments || 0) + 
                              (metrics[platform].shares || 0)
                            }
                            icon={<FaThumbsUp className="w-5 h-5" />}
                            color={getPlatformColor(platform)}
                            delay={0.4}
                          />
                        </motion.div>
                      )}
                      
                      {!loading && metrics[platform] && (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                        >
                          <MetricCard
                            title="Likes"
                            value={metrics[platform].likes || 0}
                            icon={<FaThumbsUp className="w-5 h-5" />}
                            color="#4CAF50"
                            delay={0.5}
                          />
                          <MetricCard
                            title="Comments"
                            value={metrics[platform].comments || 0}
                            icon={<FaComment className="w-5 h-5" />}
                            color="#FF9800"
                            delay={0.6}
                          />
                          <MetricCard
                            title="Shares"
                            value={metrics[platform].shares || 0}
                            icon={<FaShare className="w-5 h-5" />}
                            color="#9C27B0"
                            delay={0.7}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </MotionConfig>
        )}
      </motion.div>
    </div>
  );
}
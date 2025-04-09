import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook, FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSocialConnections } from '@/hooks/useSocialConnections';
import { SocialPlatform } from '@/lib/socialAuth';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
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
      stiffness: 260,
      damping: 20
    }
  }
};

const platformVariants = {
  hover: (color: string) => ({
    scale: 1.05,
    boxShadow: `0 10px 25px -5px ${color}33`,
    borderColor: color,
    transition: { duration: 0.2 }
  }),
  tap: { scale: 0.98 },
  initial: { 
    scale: 1, 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: { duration: 0.2 }
  }
};

// Helper function to get platform colors
const getPlatformColor = (platform: string): string => {
  switch (platform) {
    case 'instagram': return '#E1306C';
    case 'twitter': return '#1DA1F2';
    case 'youtube': return '#FF0000';
    case 'facebook': return '#4267B2';
    default: return '#888888';
  }
};

// Helper function to get platform icons
const getPlatformIcon = (platform: string, className: string = 'w-6 h-6'): JSX.Element => {
  switch (platform) {
    case 'instagram': return <FaInstagram className={className} />;
    case 'twitter': return <FaTwitter className={className} />;
    case 'youtube': return <FaYoutube className={className} />;
    case 'facebook': return <FaFacebook className={className} />;
    default: return <FaInstagram className={className} />; // Default fallback
  }
};

interface SocialMediaPlatformDisplay {
  id: SocialPlatform;
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

// Platform data
const PLATFORM_DATA: SocialMediaPlatformDisplay[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Connect to access Instagram insights and engagement metrics.',
    icon: getPlatformIcon('instagram', 'w-8 h-8'),
    color: getPlatformColor('instagram')
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Connect to track Twitter impressions and followers growth.',
    icon: getPlatformIcon('twitter', 'w-8 h-8'),
    color: getPlatformColor('twitter')
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Connect to monitor YouTube views and subscriber metrics.',
    icon: getPlatformIcon('youtube', 'w-8 h-8'),
    color: getPlatformColor('youtube')
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect to analyze Facebook reach and engagement.',
    icon: getPlatformIcon('facebook', 'w-8 h-8'),
    color: getPlatformColor('facebook')
  }
];

export function SocialMediaConnector() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { 
    platforms, 
    isConnecting, 
    isDisconnecting, 
    connectPlatform, 
    disconnectPlatform, 
    connectedCount,
    refreshConnections
  } = useSocialConnections();
  
  // Refresh connections on mount
  useEffect(() => {
    refreshConnections();
  }, [refreshConnections]);

  const handleConnection = async (platformId: SocialPlatform) => {
    const isConnected = platforms[platformId].connected;
    
    if (isConnected) {
      await disconnectPlatform(platformId);
    } else {
      await connectPlatform(platformId);
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center"
      >
        <h2 className="text-2xl font-bold">Connect Your Accounts</h2>
        <Badge variant="outline" className="px-3 py-1 text-sm">
          {connectedCount}/{PLATFORM_DATA.length} Connected
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {PLATFORM_DATA.map((platform) => {
            const isConnected = platforms[platform.id]?.connected || false;
            const isProcessing = (isConnecting || isDisconnecting) && platforms[platform.id]?.platform === platform.id;
            
            return (
              <motion.div
                key={platform.id}
                variants={itemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                whileHover={!isProcessing ? {
                  scale: 1.05,
                  boxShadow: `0 10px 25px -5px ${platform.color}33`,
                  borderColor: platform.color,
                  transition: { duration: 0.2 }
                } : undefined}
                whileTap={!isProcessing ? { scale: 0.98 } : undefined}
                layout
                className="flex flex-col"
              >
                <Card className="h-full flex flex-col border-2 relative overflow-hidden">
                  {isConnected && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 right-0 mt-2 mr-2"
                    >
                      <Badge style={{ backgroundColor: platform.color }}>
                        Connected
                      </Badge>
                    </motion.div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div style={{ color: platform.color }}>
                        {platform.icon}
                      </div>
                      <CardTitle>{platform.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription>{platform.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleConnection(platform.id)}
                      variant={isConnected ? "outline" : "default"}
                      disabled={isProcessing}
                      className="w-full transition-all duration-300 ease-in-out"
                      style={
                        isConnected 
                          ? { borderColor: platform.color, color: platform.color } 
                          : { backgroundColor: platform.color }
                      }
                    >
                      {isProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <FaSpinner className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}
                        </motion.span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
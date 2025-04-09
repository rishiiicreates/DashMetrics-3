import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor: "primary" | "secondary" | "accent" | "warning";
}

export function StatCard({ title, value, change, icon: Icon, iconColor }: StatCardProps) {
  const getIconColorClasses = (color: string) => {
    const colorMap = {
      primary: "text-primary bg-primary/10",
      secondary: "text-[#11CDEF] bg-[#11CDEF]/10",
      accent: "text-[#FB6340] bg-[#FB6340]/10",
      warning: "text-[#FFB236] bg-[#FFB236]/10",
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };
  
  const getChangeColorClass = (isPositive: boolean) => {
    return isPositive ? "text-[#2DCE89]" : "text-[#F5365C]";
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{value}</h3>
          <div className="flex items-center mt-2">
            <span className={cn("flex items-center text-sm font-medium", getChangeColorClass(change.isPositive))}>
              {change.isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 4.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0112 7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0112 13z" clipRule="evenodd" />
                </svg>
              )}
              {change.value}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
          </div>
        </div>
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", getIconColorClasses(iconColor))}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

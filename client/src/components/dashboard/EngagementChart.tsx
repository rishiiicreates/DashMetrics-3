import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";

interface EngagementData {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

interface EngagementChartProps {
  data?: EngagementData[];
  average?: string;
  isLoading?: boolean;
}

export function EngagementChart({
  data,
  average = "0%",
  isLoading = false,
}: EngagementChartProps) {
  const chartData = useMemo(() => {
    if (data) return data;
    
    // Default empty structure
    return [
      { name: "Likes", value: 0, color: "hsl(222.2 84.5% 63.3%)", percentage: "0%" },
      { name: "Comments", value: 0, color: "#11CDEF", percentage: "0%" },
      { name: "Shares", value: 0, color: "#FB6340", percentage: "0%" },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Engagement Distribution</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Engagement Distribution</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800 dark:text-white">
                  {average}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Avg. Rate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-8">
          {chartData.map((item, index) => (
            <div key={index} className="text-center">
              <span 
                className="block text-xl font-bold"
                style={{ color: item.color }}
              >
                {item.percentage}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  name: string;
  instagram: number;
  twitter: number;
  linkedin: number;
}

interface AudienceGrowthChartProps {
  data?: ChartData[];
  isLoading?: boolean;
}

export function AudienceGrowthChart({ data, isLoading = false }: AudienceGrowthChartProps) {
  const chartData = useMemo(() => {
    if (data) return data;

    // Default data structure (empty)
    return [
      { name: "Mon", instagram: 0, twitter: 0, linkedin: 0 },
      { name: "Tue", instagram: 0, twitter: 0, linkedin: 0 },
      { name: "Wed", instagram: 0, twitter: 0, linkedin: 0 },
      { name: "Thu", instagram: 0, twitter: 0, linkedin: 0 },
      { name: "Fri", instagram: 0, twitter: 0, linkedin: 0 },
      { name: "Sat", instagram: 0, twitter: 0, linkedin: 0 },
      { name: "Sun", instagram: 0, twitter: 0, linkedin: 0 },
    ];
  }, [data]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Audience Growth</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Instagram</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#11CDEF] rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Twitter</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#FB6340] rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} followers`, '']}
                  labelStyle={{ color: "#11142D" }}
                  contentStyle={{ 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none"
                  }}
                />
                <Bar 
                  dataKey="instagram" 
                  fill="hsl(222.2 84.5% 63.3%)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="twitter" 
                  fill="#11CDEF" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="linkedin" 
                  fill="#FB6340" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

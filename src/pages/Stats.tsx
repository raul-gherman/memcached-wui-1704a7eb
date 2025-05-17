
import React, { useEffect, useState } from "react";
import { getServerStats } from "@/services/memcachedService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemcachedStats } from "@/types";
import { formatBytes } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Stats() {
  const [stats, setStats] = useState<MemcachedStats | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getServerStats();
        setStats(statsData);
        
        // Generate some mock historical data for the charts
        const now = Date.now();
        const mockData = Array.from({ length: 24 }, (_, i) => {
          const timestamp = new Date(now - (23 - i) * 3600000);
          
          // Generate somewhat realistic looking data with variations
          const hitRate = 70 + Math.sin(i * 0.5) * 20;
          const memoryUsage = parseInt(statsData.bytes) * (0.7 + 0.3 * Math.sin(i * 0.3));
          const ops = 1000 + Math.sin(i * 0.8) * 500;
          
          return {
            time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hitRate: parseFloat(hitRate.toFixed(1)),
            memoryUsage: memoryUsage,
            operations: Math.round(ops),
          };
        });
        
        setHistoricalData(mockData);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    
    // Poll for updates
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse-subtle">
        <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
        <div className="mt-6 h-[300px] bg-muted rounded-lg"></div>
        <div className="mt-6 h-[300px] bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
          <p className="text-muted-foreground mt-1">
            Real-time performance metrics
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="hitRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Hit Rate"]} />
                  <Area
                    type="monotone"
                    dataKey="hitRate"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#hitRateGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis tickFormatter={(value) => formatBytes(value)} />
                  <Tooltip formatter={(value) => [formatBytes(value as number), "Memory Usage"]} />
                  <Area
                    type="monotone"
                    dataKey="memoryUsage"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#memoryGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations Per Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="opsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ops`, "Operations"]} />
                  <Area
                    type="monotone"
                    dataKey="operations"
                    stroke="#ffc658"
                    fillOpacity={1}
                    fill="url(#opsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import React, { useEffect, useState } from "react";
import { getServerConfig, getServerStats } from "@/services/memcachedService";
import { MemcachedStats, MemcachedServerConfig } from "@/types";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatsList } from "@/components/dashboard/StatsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState<MemcachedStats | null>(null);
  const [config, setConfig] = useState<MemcachedServerConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, configData] = await Promise.all([
          getServerStats(),
          getServerConfig(),
        ]);
        setStats(statsData);
        setConfig(configData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse-subtle">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="mt-6 h-[120px] bg-muted rounded-lg"></div>
        <div className="mt-6 h-[400px] bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Memcached server at {config?.host}:{config?.port}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-2 items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Connected</span>
                <span>•</span>
                <span className="font-mono">v{stats?.version}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        {stats && <StatsCard stats={stats} />}
      </div>

      <div className="mt-6">
        {stats && <StatsList stats={stats} />}
      </div>
    </div>
  );
}

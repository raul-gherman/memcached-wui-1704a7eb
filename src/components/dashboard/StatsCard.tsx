
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MemcachedStats } from "@/types";
import { Gauge, ChevronUp, Clock, Database, Activity } from "lucide-react";
import { formatBytes, formatDuration } from "@/lib/utils";

interface StatsCardProps {
  stats: MemcachedStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  // Calculate memory usage percentage
  const memoryUsed = parseInt(stats.bytes);
  const memoryTotal = parseInt(stats.limit_maxbytes);
  const memoryPercentage = (memoryUsed / memoryTotal) * 100;
  
  // Calculate hit rate percentage
  const hits = parseInt(stats.get_hits);
  const misses = parseInt(stats.get_misses);
  const hitRate = hits / (hits + misses) * 100 || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatBytes(memoryUsed)}</div>
          <Progress value={memoryPercentage} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {formatBytes(memoryUsed)} of {formatBytes(memoryTotal)} used
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(parseInt(stats.uptime))}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Started {new Date(Date.now() - parseInt(stats.uptime) * 1000).toLocaleString()}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hitRate.toFixed(1)}%</div>
          <Progress value={hitRate} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {stats.get_hits} hits / {stats.get_misses} misses
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Items</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{parseInt(stats.curr_items).toLocaleString()}</div>
          <div className="flex items-center mt-2">
            <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-xs text-green-500">
              {stats.total_items} items processed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

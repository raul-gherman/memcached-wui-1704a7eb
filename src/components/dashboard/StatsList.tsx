
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MemcachedStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StatsListProps {
  stats: MemcachedStats;
}

export function StatsList({ stats }: StatsListProps) {
  const statsItems = Object.entries(stats).map(([key, value]) => ({
    key,
    value,
    displayName: key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }));
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Server Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statistic</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statsItems.map((stat) => (
                <TableRow key={stat.key}>
                  <TableCell className="font-medium">{stat.displayName}</TableCell>
                  <TableCell>{stat.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

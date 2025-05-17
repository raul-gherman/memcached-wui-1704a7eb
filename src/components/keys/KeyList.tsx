
import React, { useState } from "react";
import { MemcachedKey, MemcachedKeyFilter } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Trash2, Edit, MoreVertical, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface KeyListProps {
  keys: MemcachedKey[];
  onEdit: (key: MemcachedKey) => void;
  onDelete: (key: string) => void;
  onView: (key: MemcachedKey) => void;
}

export function KeyList({ keys, onEdit, onDelete, onView }: KeyListProps) {
  const [filter, setFilter] = useState<MemcachedKeyFilter>({
    search: "",
    showExpired: false,
    sortBy: "key",
    sortDirection: "asc",
  });

  const handleFilterChange = (
    key: keyof MemcachedKeyFilter,
    value: any
  ) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const filteredKeys = keys
    .filter((key) => {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = key.expiry > 0 && key.expiry <= now;
      
      // Filter by expired status
      if (isExpired && !filter.showExpired) {
        return false;
      }
      
      // Filter by search term (case insensitive)
      if (filter.search && !key.key.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Filter by data type
      if (filter.dataType && key.dataType !== filter.dataType) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const direction = filter.sortDirection === "asc" ? 1 : -1;
      
      switch (filter.sortBy) {
        case "key":
          return direction * a.key.localeCompare(b.key);
        case "size":
          return direction * (a.size - b.size);
        case "expiry":
          return direction * (a.expiry - b.expiry);
        default:
          return 0;
      }
    });

  const getDataTypeBadgeColor = (type: string) => {
    switch (type) {
      case "json":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "number":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "binary":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const formatExpiry = (expiry: number) => {
    if (expiry === 0) return "Never";
    
    const now = Math.floor(Date.now() / 1000);
    if (expiry <= now) return "Expired";
    
    const diff = expiry - now;
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Cache Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search keys..."
              value={filter.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-expired"
                checked={filter.showExpired}
                onCheckedChange={(checked) =>
                  handleFilterChange("showExpired", checked)
                }
              />
              <label
                htmlFor="show-expired"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show expired
              </label>
            </div>
            
            <Select
              value={filter.dataType}
              onValueChange={(value) =>
                handleFilterChange("dataType", value || undefined)
              }
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="binary">Binary</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-[100px]">
                  {filter.sortDirection === "asc" ? (
                    <ArrowDownAZ className="mr-2 h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpAZ className="mr-2 h-3.5 w-3.5" />
                  )}
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "key");
                    handleFilterChange("sortDirection", filter.sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Sort by Key
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "size");
                    handleFilterChange("sortDirection", filter.sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Sort by Size
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "expiry");
                    handleFilterChange("sortDirection", filter.sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Sort by Expiry
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No keys found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKeys.map((key) => {
                    const now = Math.floor(Date.now() / 1000);
                    const isExpired = key.expiry > 0 && key.expiry <= now;
                    
                    return (
                      <TableRow key={key.key} className={isExpired ? "opacity-60" : ""}>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[200px]" title={key.key}>
                            {key.key}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDataTypeBadgeColor(key.dataType)}>
                            {key.dataType}
                          </Badge>
                        </TableCell>
                        <TableCell>{key.size} bytes</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={isExpired ? "bg-red-500/10 text-red-500" : ""}
                          >
                            {formatExpiry(key.expiry)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onView(key)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(key)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive" 
                                onClick={() => onDelete(key.key)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

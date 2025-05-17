
import React from "react";
import { MemcachedKey } from "@/types";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";

interface KeyAccordionListProps {
  keys: MemcachedKey[];
  onEdit: (key: MemcachedKey) => void;
  onDelete: (key: string) => void;
  onView: (key: MemcachedKey) => void;
}

interface KeyNode {
  key: string;
  segment: string;
  isLeaf: boolean;
  data: MemcachedKey | null;
  children: Record<string, KeyNode>;
}

export function KeyAccordionList({ keys, onEdit, onDelete, onView }: KeyAccordionListProps) {
  // Build tree structure from keys
  const buildKeyTree = (keys: MemcachedKey[]): KeyNode => {
    const root: KeyNode = {
      key: "",
      segment: "",
      isLeaf: false,
      data: null,
      children: {},
    };

    keys.forEach((key) => {
      const segments = key.key.split(":");
      let currentNode = root;

      // Process all segments except the last one
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const currentPath = segments.slice(0, i + 1).join(":");
        
        if (!currentNode.children[segment]) {
          currentNode.children[segment] = {
            key: currentPath,
            segment,
            isLeaf: i === segments.length - 1,
            data: i === segments.length - 1 ? key : null,
            children: {},
          };
        }

        currentNode = currentNode.children[segment];
      }
    });

    return root;
  };

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

  // Recursively render tree nodes
  const renderKeyNode = (node: KeyNode, level: number = 0): React.ReactNode => {
    const hasChildren = Object.keys(node.children).length > 0;
    const sortedKeys = Object.keys(node.children).sort();
    const now = Math.floor(Date.now() / 1000);
    const isExpired = node.data?.expiry ? node.data.expiry > 0 && node.data.expiry <= now : false;
    
    return (
      <div key={node.key} className={level > 0 ? "ml-4" : ""}>
        {level > 0 && (
          <div className="flex items-center justify-between py-2 group">
            <div className="flex items-center gap-2">
              {node.isLeaf ? (
                <div className="w-4" />
              ) : (
                hasChildren ? <ChevronDown className="h-4 w-4 opacity-70" /> : <ChevronRight className="h-4 w-4 opacity-70" />
              )}
              <span className={`font-mono ${isExpired ? "opacity-60" : ""}`}>
                {node.segment}
              </span>
              {node.data && (
                <>
                  <Badge variant="outline" className={getDataTypeBadgeColor(node.data.dataType)}>
                    {node.data.dataType}
                  </Badge>
                  <Badge variant="outline" className={isExpired ? "bg-red-500/10 text-red-500" : ""}>
                    {formatExpiry(node.data.expiry)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {node.data.size} bytes
                  </span>
                </>
              )}
            </div>
            {node.data && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(node.data!)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(node.data!)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => onDelete(node.data!.key)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
        
        {hasChildren && (
          <div className="ml-3 border-l pl-4 border-border/30">
            {sortedKeys.map((key) => renderKeyNode(node.children[key], level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Build tree and handle empty state
  const keyTree = buildKeyTree(keys);
  
  if (!keys.length) {
    return <div className="text-center py-8 text-muted-foreground">No keys found.</div>;
  }

  return (
    <div className="rounded-md border p-4 space-y-1">
      {renderKeyNode(keyTree)}
    </div>
  );
}

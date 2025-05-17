
import React, { useEffect, useState } from "react";
import { MemcachedKey } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface KeyViewerProps {
  keyData: MemcachedKey | null;
  open: boolean;
  onClose: () => void;
  onEdit: (key: MemcachedKey) => void;
}

export function KeyViewer({ keyData, open, onClose, onEdit }: KeyViewerProps) {
  const [activeTab, setActiveTab] = useState("raw");
  const [formattedJson, setFormattedJson] = useState("");
  
  useEffect(() => {
    if (keyData?.dataType === "json") {
      try {
        const parsedJson = JSON.parse(keyData.value);
        setFormattedJson(JSON.stringify(parsedJson, null, 2));
      } catch (error) {
        setFormattedJson("Invalid JSON");
      }
    }
  }, [keyData]);
  
  if (!keyData) return null;
  
  const formatExpiry = (expiry: number) => {
    if (expiry === 0) return "Never";
    
    const timestamp = new Date(expiry * 1000);
    return timestamp.toLocaleString();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>View Key: {keyData.key}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mb-4">
            <div>
              <Label className="text-muted-foreground text-sm">Data Type</Label>
              <div>
                <Badge variant="outline">
                  {keyData.dataType}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">Size</Label>
              <div>{keyData.size} bytes</div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">Expiry</Label>
              <div>{formatExpiry(keyData.expiry)}</div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">Flags</Label>
              <div>{keyData.flags}</div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="raw">Raw Value</TabsTrigger>
              {keyData.dataType === "json" && (
                <TabsTrigger value="formatted">Formatted JSON</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="raw">
              <ScrollArea className="h-[300px] border rounded-md p-4 bg-secondary/30">
                <pre className="whitespace-pre-wrap break-all font-mono text-sm">{keyData.value}</pre>
              </ScrollArea>
            </TabsContent>
            
            {keyData.dataType === "json" && (
              <TabsContent value="formatted">
                <ScrollArea className="h-[300px] border rounded-md p-4 bg-secondary/30">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{formattedJson}</pre>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit(keyData)}>
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

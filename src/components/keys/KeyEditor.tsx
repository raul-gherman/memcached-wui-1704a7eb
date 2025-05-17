
import React, { useState } from "react";
import { MemcachedKey } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { detectDataType } from "@/services/memcachedService";

interface KeyEditorProps {
  keyData: MemcachedKey | null;
  open: boolean;
  onClose: () => void;
  onSave: (key: MemcachedKey) => void;
}

export function KeyEditor({ keyData, open, onClose, onSave }: KeyEditorProps) {
  const isNewKey = !keyData?.key;
  
  const [formData, setFormData] = useState<MemcachedKey>({
    key: keyData?.key || "",
    value: keyData?.value || "",
    size: keyData?.size || 0,
    flags: keyData?.flags || 0,
    expiry: keyData?.expiry || 0,
    cas: keyData?.cas || "0",
    dataType: keyData?.dataType || "string",
  });

  const [expiryType, setExpiryType] = useState<"never" | "seconds" | "timestamp">(
    formData.expiry === 0 
      ? "never" 
      : formData.expiry > 1893456000 // 2030-01-01, rough estimate for a timestamp vs. seconds
        ? "timestamp"
        : "seconds"
  );
  
  const [expiryValue, setExpiryValue] = useState<string>(
    expiryType === "never" 
      ? "" 
      : expiryType === "timestamp" 
        ? new Date(formData.expiry * 1000).toISOString().substring(0, 16) 
        : formData.expiry.toString()
  );

  const handleInputChange = (field: keyof MemcachedKey, value: any) => {
    if (field === "value") {
      // Auto-detect data type when value changes
      const detectedType = detectDataType(value);
      setFormData({
        ...formData,
        value,
        dataType: detectedType,
        size: new TextEncoder().encode(value).length
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleExpiryTypeChange = (type: "never" | "seconds" | "timestamp") => {
    setExpiryType(type);
    
    if (type === "never") {
      setFormData({
        ...formData,
        expiry: 0
      });
      setExpiryValue("");
    } else if (type === "timestamp") {
      // Set to 24 hours from now as default
      const timestamp = Math.floor(Date.now() / 1000) + 86400;
      setFormData({
        ...formData,
        expiry: timestamp
      });
      setExpiryValue(new Date(timestamp * 1000).toISOString().substring(0, 16));
    } else {
      // Default to 3600 seconds (1 hour)
      setFormData({
        ...formData,
        expiry: 3600
      });
      setExpiryValue("3600");
    }
  };

  const handleExpiryValueChange = (value: string) => {
    setExpiryValue(value);
    
    if (expiryType === "seconds") {
      setFormData({
        ...formData,
        expiry: parseInt(value) || 0
      });
    } else if (expiryType === "timestamp") {
      const date = new Date(value).getTime() / 1000;
      setFormData({
        ...formData,
        expiry: Math.floor(date)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNewKey ? "Add New Key" : "Edit Key"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                placeholder="Enter key name"
                value={formData.key}
                onChange={(e) => handleInputChange("key", e.target.value)}
                disabled={!isNewKey}
                className={!isNewKey ? "bg-muted" : ""}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="value">Value</Label>
              <Textarea
                id="value"
                placeholder="Enter value"
                className="font-mono min-h-[100px]"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataType">Data Type</Label>
                <Select
                  value={formData.dataType}
                  onValueChange={(value) => handleInputChange("dataType", value)}
                >
                  <SelectTrigger id="dataType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="binary">Binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="flags">Flags</Label>
                <Input
                  id="flags"
                  type="number"
                  min="0"
                  value={formData.flags}
                  onChange={(e) => handleInputChange("flags", parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="expiry">Expiry</Label>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={expiryType}
                  onValueChange={(value) => handleExpiryTypeChange(value as any)}
                >
                  <SelectTrigger id="expiryType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="seconds">Seconds from now</SelectItem>
                    <SelectItem value="timestamp">Specific time</SelectItem>
                  </SelectContent>
                </Select>

                {expiryType === "never" ? null : expiryType === "timestamp" ? (
                  <Input
                    id="expiryTimestamp"
                    type="datetime-local"
                    value={expiryValue}
                    onChange={(e) => handleExpiryValueChange(e.target.value)}
                  />
                ) : (
                  <Input
                    id="expirySeconds"
                    type="number"
                    min="1"
                    placeholder="Seconds"
                    value={expiryValue}
                    onChange={(e) => handleExpiryValueChange(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isNewKey ? "Add Key" : "Update Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

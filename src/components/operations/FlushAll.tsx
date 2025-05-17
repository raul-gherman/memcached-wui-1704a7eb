
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { flushAll } from "@/services/memcachedService";

export function FlushAll() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);
  
  const handleFlushAll = async () => {
    if (confirmStep === 0) {
      setConfirmStep(1);
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await flushAll();
      if (result.success) {
        toast({
          title: "Operation Successful",
          description: "All keys have been flushed from the cache",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Operation Failed",
          description: result.message,
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: "There was an error flushing the cache",
      });
    } finally {
      setLoading(false);
      setConfirmStep(0);
    }
  };
  
  const handleCancel = () => {
    setConfirmStep(0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flush All Keys</CardTitle>
      </CardHeader>
      <CardContent>
        {confirmStep === 0 ? (
          <div className="text-muted-foreground">
            This will remove all keys from the cache. This operation cannot be undone.
          </div>
        ) : (
          <div className="flex items-center text-destructive gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">
              Are you sure? All keys will be permanently deleted!
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {confirmStep === 1 && (
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        
        <Button
          variant="destructive"
          onClick={handleFlushAll}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          {confirmStep === 0 ? "Flush All Keys" : "Confirm Flush"}
        </Button>
      </CardFooter>
    </Card>
  );
}

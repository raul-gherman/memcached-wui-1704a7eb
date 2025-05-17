
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Download, Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportKeys, importKeys } from "@/services/memcachedService";

export function ImportExport() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("export");
  const [jsonData, setJsonData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleExport = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await exportKeys();
      setJsonData(data);
      toast({
        title: "Export Successful",
        description: "Key data exported successfully",
      });
    } catch (err) {
      setError("Failed to export keys");
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting the keys",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleImport = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await importKeys(jsonData);
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.message,
        });
        setJsonData("");
      } else {
        setError(result.message);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: result.message,
        });
      }
    } catch (err) {
      setError("Failed to import keys");
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "There was an error importing the keys",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memcached-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import / Export Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4">
            <div className="mt-4">
              <Button 
                onClick={handleExport} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Keys
              </Button>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="font-mono h-[300px]"
                placeholder="Keys will appear here after export..."
                readOnly
              />
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="mt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="font-mono h-[300px]"
                placeholder='Paste JSON export data here {"version":1,"timestamp":"2023-05-17T12:34:56.789Z","server":"localhost:11211","keys":[...]}'
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {activeTab === "export" && jsonData && (
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!jsonData || loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        )}
        
        {activeTab === "import" && (
          <Button
            onClick={handleImport}
            disabled={!jsonData || loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Import Keys
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

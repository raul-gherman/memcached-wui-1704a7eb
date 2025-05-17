
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Server, Plus, Check } from "lucide-react";

interface ServerConfig {
  host: string;
  port: number;
  name: string;
  id: string;
}

export default function Servers() {
  const { toast } = useToast();
  const [servers] = useState<ServerConfig[]>([
    {
      host: "localhost",
      port: 11211,
      name: "Local Memcached",
      id: "local-1"
    },
    {
      host: "memcached.example.com",
      port: 11211,
      name: "Production",
      id: "prod-1",
    }
  ]);
  
  const [currentServer, setCurrentServer] = useState(servers[0]);
  
  const handleServerSwitch = (server: ServerConfig) => {
    setCurrentServer(server);
    toast({
      title: "Server Switched",
      description: `Switched to ${server.name} (${server.host}:${server.port})`,
    });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Server Management</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Memcached Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servers.map((server) => {
                const isActive = server.id === currentServer.id;
                
                return (
                  <div
                    key={server.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isActive ? "bg-accent border-primary" : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Server className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {server.host}:{server.port}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {isActive ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleServerSwitch(server)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Server Name</Label>
                <Input id="name" value={currentServer.name} disabled />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" value={currentServer.host} disabled />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" type="number" value={currentServer.port} disabled />
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Connection Status</div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last ping: &lt;1ms
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

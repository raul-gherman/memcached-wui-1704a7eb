
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Settings</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="flex items-center space-x-2">
              <Switch id="animate" defaultChecked />
              <Label htmlFor="animate">Enable animations</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Default Connection</CardTitle>
            <CardDescription>
              Set the default Memcached server to connect to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="default-host">Default Host</Label>
              <Input id="default-host" defaultValue="localhost" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="default-port">Default Port</Label>
              <Input id="default-port" type="number" defaultValue="11211" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced application behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-refresh" />
              <Label htmlFor="auto-refresh">Auto-refresh data every 30 seconds</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="confirm-deletes" defaultChecked />
              <Label htmlFor="confirm-deletes">Confirm before deleting keys</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="save-exports" defaultChecked />
              <Label htmlFor="save-exports">Remember export history</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">MemcachedUI</h3>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0
              </p>
            </div>
            
            <div>
              <p className="text-sm">
                A modern Memcached admin interface, built with Rust and React.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

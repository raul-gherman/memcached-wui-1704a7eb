
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Database,
  Home,
  Key,
  LayersIcon,
  Menu,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}

function NavItem({ href, icon, title, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
        active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-secondary/50"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-14 items-center px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <Database className="h-6 w-6 memcached-gradient-text" />
          <span className="text-lg font-bold">MemcachedUI</span>
        </Link>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <NavItem 
            href="/" 
            icon={<Home className="h-4 w-4" />} 
            title="Dashboard" 
            active={isActive("/")}
          />
          <NavItem 
            href="/keys" 
            icon={<Key className="h-4 w-4" />} 
            title="Keys" 
            active={isActive("/keys")}
          />
          <NavItem 
            href="/stats" 
            icon={<LayersIcon className="h-4 w-4" />} 
            title="Statistics" 
            active={isActive("/stats")}
          />
          <NavItem 
            href="/operations" 
            icon={<Package className="h-4 w-4" />} 
            title="Operations" 
            active={isActive("/operations")}
          />
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-4 w-4" />} 
            title="Settings" 
            active={isActive("/settings")}
          />
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Connected</span>
            </div>
            <div className="mt-1">localhost:11211</div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="absolute left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden w-64 border-r bg-sidebar lg:block">
        <NavContent />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

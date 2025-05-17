
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Keys from "./pages/Keys";
import Stats from "./pages/Stats";
import Operations from "./pages/Operations";
import Servers from "./pages/Servers";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/keys" 
              element={
                <Layout>
                  <Keys />
                </Layout>
              } 
            />
            <Route 
              path="/stats" 
              element={
                <Layout>
                  <Stats />
                </Layout>
              } 
            />
            <Route 
              path="/operations" 
              element={
                <Layout>
                  <Operations />
                </Layout>
              } 
            />
            <Route 
              path="/servers" 
              element={
                <Layout>
                  <Servers />
                </Layout>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Layout>
                  <Settings />
                </Layout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

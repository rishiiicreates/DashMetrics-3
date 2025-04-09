import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import Dashboard from "@/pages/Dashboard";
import SavedContent from "@/pages/SavedContent";
import Activity from "@/pages/Activity";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ProtectedRouteWrapper({ component: Component }: { component: React.ComponentType }) {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

function Router() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Redirect to dashboard if trying to access login/register when already logged in
  useEffect(() => {
    if (user && (location === "/login" || location === "/register")) {
      window.location.href = "/";
    }
  }, [user, location]);
  
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRouteWrapper component={Dashboard} />} />
      <Route path="/saved" component={() => <ProtectedRouteWrapper component={SavedContent} />} />
      <Route path="/activity" component={() => <ProtectedRouteWrapper component={Activity} />} />
      <Route path="/settings" component={() => <ProtectedRouteWrapper component={Settings} />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Add noise background texture
  useEffect(() => {
    // Add a class to the root HTML element for the noise texture
    document.documentElement.classList.add("bg-noise");
    
    // Add the CSS for the noise texture
    const style = document.createElement("style");
    style.textContent = `
      .bg-noise {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        background-position: 0 0;
        background-size: 200px 200px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.classList.remove("bg-noise");
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

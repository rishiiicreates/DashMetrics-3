import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // If authenticated, render children
  return user ? <>{children}</> : null;
}
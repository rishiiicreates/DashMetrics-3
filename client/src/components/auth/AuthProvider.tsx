import { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

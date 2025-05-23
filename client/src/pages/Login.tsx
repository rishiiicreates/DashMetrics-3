import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase";
import { BarChart2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      setIsLoading(true);
      await loginWithEmail(data.email, data.password);
      toast({
        title: "Login successful",
        description: "Welcome back to DashMetrics!",
      });
      navigate("/");
    } catch (error) {
      console.error("Email login error:", error);
      
      // Detailed error handling
      let errorMessage = "Failed to sign in with email/password. Please try again.";
      
      if (error instanceof Error) {
        // Extract Firebase error code if available
        const errorCode = (error as any).code;
        
        if (errorCode === "auth/user-not-found") {
          errorMessage = "No account found with this email address. Please check your email or register.";
        } else if (errorCode === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again or reset your password.";
        } else if (errorCode === "auth/invalid-credential") {
          errorMessage = "Invalid login credentials. Please check your email and password.";
        } else if (errorCode === "auth/too-many-requests") {
          errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
        } else if (errorCode === "auth/user-disabled") {
          errorMessage = "This account has been disabled. Please contact support.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome back to DashMetrics!",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      
      // Detailed error handling
      let errorMessage = "Failed to sign in with Google. Please try again.";
      
      if (error instanceof Error) {
        // Extract Firebase error code if available
        const errorCode = (error as any).code;
        
        if (errorCode === "auth/popup-blocked") {
          errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
        } else if (errorCode === "auth/cancelled-popup-request") {
          errorMessage = "The authentication popup was closed before completing the sign-in.";
        } else if (errorCode === "auth/invalid-credential") {
          errorMessage = "The authentication credential is invalid. Please try again.";
        } else if (errorCode === "auth/unauthorized-domain") {
          errorMessage = "This domain is not authorized for OAuth operations. Contact support.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 bg-noise">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center mr-2">
            <BarChart2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">DashMetrics</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your DashMetrics account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            type="email" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold" 
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

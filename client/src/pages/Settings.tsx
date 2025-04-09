import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Database, Globe, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      username: "sarahjohnson",
    },
  });
  
  // Notifications form
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: true,
      marketingEmails: false,
    },
  });
  
  // Profile form submission
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };
  
  // Notifications form submission
  const onNotificationsSubmit = (data: z.infer<typeof notificationsFormSchema>) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };
  
  // Theme preference state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  // Update theme preference
  const handleThemeChange = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setDarkMode(checked);
  };
  
  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your account preferences and configurations"
    >
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Data</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details and public profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the name that will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormDescription>
                              We'll never share your email with anyone else.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              This will be used for your profile URL.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile image.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/68.jpg" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Upload Image</Button>
                      <Button variant="outline" size="sm" className="text-gray-500">Remove</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Theme Preference</CardTitle>
                    <CardDescription>Choose your preferred theme.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Switch between light and dark themes.
                        </p>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={darkMode} 
                        onCheckedChange={handleThemeChange} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications about account activity via email.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Push Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications in-app and on your desktop.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="weeklyDigest"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Weekly Digest</FormLabel>
                            <FormDescription>
                              Get a weekly summary of your account activity.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive updates about new features and promotions.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Preferences</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Button variant="outline">Setup</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Active Sessions</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage devices where you're currently logged in.
                      </p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Data Tab */}
          <TabsContent value="data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>Download your data in various formats.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Export Analytics</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Download your analytics data as CSV or PDF.
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">CSV</Button>
                      <Button variant="outline" size="sm">PDF</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Export Content</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Download your saved content in JSON format.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">JSON</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Control how your data is stored and used.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Data Retention</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure how long we keep your analytics data.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30">
                    <div className="space-y-0.5">
                      <Label className="text-base">Delete Account</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permanently remove your account and all data.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

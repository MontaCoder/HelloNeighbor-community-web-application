import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    avatar_url: profile?.avatar_url || "",
  });

  useEffect(() => {
    setFormData({
      full_name: profile?.full_name || "",
      avatar_url: profile?.avatar_url || "",
    });
  }, [profile?.avatar_url, profile?.full_name]);

  const { data: neighborhood } = useQuery({
    queryKey: ["neighborhood", profile?.neighborhood_id],
    queryFn: async () => {
      if (!profile?.neighborhood_id) return null;
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("name")
        .eq("id", profile.neighborhood_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  };

  const handleAvatarUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const initials = formData.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/20">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage your account and preferences
              </p>
            </div>
          </div>

          <div className="space-y-6 animate-scale-in">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Profile Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-20 h-20 ring-4 ring-primary/10">
                      <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ImageUpload
                      onImageUploaded={handleAvatarUpload}
                      existingUrl={formData.avatar_url}
                    >
                      <Button type="button" variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </ImageUpload>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Full Name
                    </label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Email
                    </label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Neighborhood
                    </label>
                    <Input
                      value={neighborhood?.name || "Not set"}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-lift">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LogOut className="h-5 w-5 text-destructive" />
                  <CardTitle>Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

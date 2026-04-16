import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileState = Pick<ProfileRow, "id"> & Partial<Omit<ProfileRow, "id">>;

type AuthContextType = {
  user: User | null;
  profile: ProfileState | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, retryCount = 0) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Get current session to ensure fresh access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // Implement retry logic with exponential backoff
        if (retryCount < 3) {
          const backoffDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Retrying profile fetch in ${backoffDelay}ms...`);
          
          setTimeout(() => {
            fetchProfile(userId, retryCount + 1);
          }, backoffDelay);
          
          return;
        }

        toast({
          title: "Profile Error",
          description: "There was a problem loading your profile. Some features may be limited.",
          variant: "destructive"
        });
        throw error;
      }

      const metadataFullName =
        typeof session.user.user_metadata?.full_name === "string"
          ? session.user.user_metadata.full_name.trim()
          : "";
      let profileData: ProfileState | null = data;

      if (metadataFullName && !profileData?.full_name) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: metadataFullName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
          .select("*")
          .maybeSingle();

        if (updateError) {
          console.error("Error syncing full name to profile:", updateError);
          profileData = profileData
            ? { ...profileData, full_name: metadataFullName }
            : { id: userId, full_name: metadataFullName };
        } else if (updatedProfile) {
          profileData = updatedProfile;
        }
      }

      console.log("Profile fetched:", profileData);
      setProfile(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setLoading(false);
      
      toast({
        title: "Profile Error",
        description: "Unable to load profile data. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let cleanupSubscription: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try logging in again.",
            variant: "destructive"
          });
          return;
        }

        console.log("Session check complete:", session ? "User logged in" : "No session");
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }

        // Set up real-time auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          if (mounted) {
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
              setLoading(false);
            }
          }
        });

        // Store cleanup function
        cleanupSubscription = () => subscription.unsubscribe();

      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (cleanupSubscription) {
        cleanupSubscription();
      }
    };
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

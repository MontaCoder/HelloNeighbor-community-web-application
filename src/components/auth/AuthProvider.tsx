import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  profile: any | null;
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
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Retrying profile fetch in ${delay}ms...`);
          setTimeout(() => fetchProfile(userId, retryCount + 1), delay);
          return;
        }
        toast({
          title: "Profile Error",
          description: "Unable to load profile data. Please refresh the page.",
          variant: "destructive"
        });
        throw error;
      }

      if (!data && retryCount < 3) {
        // Profile might not be created yet due to trigger delay
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Profile not found, retrying in ${delay}ms...`);
        setTimeout(() => fetchProfile(userId, retryCount + 1), delay);
        return;
      }

      console.log("Profile fetched:", data);
      setProfile(data);
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
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          toast({
            title: "Session Error",
            description: "There was a problem checking your session. Please try logging in again.",
            variant: "destructive"
          });
          throw error;
        }

        console.log("Session check complete:", session ? "User logged in" : "No session");
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
          setInitializationComplete(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setInitializationComplete(true);
          setLoading(false);
          navigate('/auth');
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
          if (initializationComplete) {
            navigate('/auth');
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, initializationComplete]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
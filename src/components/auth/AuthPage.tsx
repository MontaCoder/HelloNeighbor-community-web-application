import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      console.log("Auth change detected:", event, session?.user?.id);
      
      if (session) {
        console.log("User is authenticated, redirecting to dashboard");
        // Clear any existing errors
        setAuthError(null);
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate("/");
      }
    };

    // Check current session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setAuthError("There was a problem checking your session. Please try again.");
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (session) {
          console.log("Existing session found, redirecting to dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setAuthError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthError(null);
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions.",
        });
      } else if (event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setAuthError(getErrorMessage(error));
        }
      } else {
        handleAuthChange(event, session);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: AuthError) => {
    const errorMessage = error.message;
    if (errorMessage.includes('user_already_exists') || error.message.includes('User already registered')) {
      return "This email is already registered. Please sign in instead.";
    } else if (errorMessage.includes('invalid_credentials')) {
      return "Invalid email or password. Please check your credentials.";
    }
    return "An error occurred during authentication. Please try again.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-2xl text-primary">Welcome Back</CardTitle>
            <Button variant="ghost" asChild size="sm">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#2F5233',
                        brandAccent: '#7C9082',
                      },
                      radii: {
                        buttonBorderRadius: '0.5rem',
                        inputBorderRadius: '0.5rem',
                      },
                    },
                  },
                  className: {
                    container: 'flex flex-col gap-4',
                    button: 'button-full-width',
                    input: 'input-full-width',
                  },
                }}
                providers={[]}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Password',
                    },
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      console.log("Auth change detected:", event, session?.user?.id);
      if (session) {
        console.log("User is authenticated, redirecting to dashboard");
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home");
        navigate("/");
      }
    };

    // Check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your session. Please try again.",
          variant: "destructive",
        });
        console.error('Session check error:', error);
        return;
      }
      if (session) {
        console.log("Existing session found, redirecting to dashboard");
        navigate("/dashboard");
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-primary">Welcome Back</CardTitle>
            <Button variant="ghost" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign In'
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign Up'
                }
              }
            }}
            view="sign_in"
            additionalData={{
              full_name: {
                required: true,
                type: 'text',
                label: 'Full Name',
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
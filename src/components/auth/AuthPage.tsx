import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Shield, Users, Bell } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, Session } from "@supabase/supabase-js";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (session) {
        setAuthError(null);
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        navigate("/");
      }
    };

    const checkSession = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session check error:", error);
          setAuthError("There was a problem checking your session. Please try again.");
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error);
        setAuthError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setAuthError(null);
          toast({
            title: "Password Recovery",
            description: "Check your email for password reset instructions.",
          });
        } else if (event === "USER_UPDATED") {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setAuthError(getErrorMessage(error));
          }
        } else {
          handleAuthChange(event, session);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    const errorMessage = error.message;
    if (
      errorMessage.includes("user_already_exists") ||
      error.message.includes("User already registered")
    ) {
      return "This email is already registered. Please sign in instead.";
    } else if (errorMessage.includes("invalid_credentials")) {
      return "Invalid email or password. Please check your credentials.";
    }
    return "An error occurred during authentication. Please try again.";
  };

  const features = [
    { icon: Users, text: "Connect with neighbors" },
    { icon: Bell, text: "Real-time alerts" },
    { icon: Shield, text: "Verified community" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/imgs/logo.png" alt="HelloNeighbor" className="h-11 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Join Your Community</h1>
          <p className="text-muted-foreground mt-2">
            Connect with neighbors in your area
          </p>
        </div>

        <Card className="shadow-soft-lg animate-scale-in">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-primary">Welcome Back</CardTitle>
              <Button variant="ghost" asChild size="sm">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {authError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <div className="mb-4 space-y-2">
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-foreground"
                  >
                    Full Name
                  </label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    form="auth-sign-up"
                    required
                    minLength={2}
                    pattern=".*\S.*"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    title="Please enter your full name"
                  />
                  <p className="text-sm text-muted-foreground">
                    Required for new accounts so neighbors can recognize you clearly.
                  </p>
                </div>

                <Auth
                  supabaseClient={supabase}
                  additionalData={
                    fullName.trim() ? { full_name: fullName.trim() } : undefined
                  }
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: "#2F5233",
                          brandAccent: "#7C9082",
                        },
                        radii: {
                          buttonBorderRadius: "0.5rem",
                          inputBorderRadius: "0.5rem",
                        },
                      },
                    },
                    className: {
                      container: "flex flex-col gap-4",
                      button: "button-full-width",
                      input: "input-full-width",
                    },
                  }}
                  providers={[]}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: "Email",
                        password_label: "Password",
                      },
                    },
                  }}
                />

                <div className="mt-6 pt-6 border-t border-border/40">
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <feature.icon className="h-4 w-4 text-primary" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

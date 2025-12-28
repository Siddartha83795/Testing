import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/types";
import { getSupabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useSession();
  const supabase = getSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/dashboard");
  }

  const handleLogin = async () => {
    if (!supabase) {
      toast({
        title: "Auth unavailable",
        description: "Authentication service not configured.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/dashboard");
    }
  };

  const handleRegister = async () => {
    if (!supabase) {
      toast({
        title: "Auth unavailable",
        description: "Authentication service not configured.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "client",
          location,
        },
      },
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created",
        description: "You can now log in.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card p-6 rounded-xl border">
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleLogin}
                disabled={loading}
              >
                Login
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleRegister}
                disabled={loading}
              >
                Register
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;

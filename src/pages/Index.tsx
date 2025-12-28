import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Users,
  Zap,
  Coffee,
  Stethoscope,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleClientDemo = () => {
    navigate("/locations");
  };

  const handleStaffDemo = () => {
    navigate("/staff/location");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleOrderFood = () => {
    navigate("/locations");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="container relative mx-auto px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                QuickBite Pro • Food Ordering System
              </span>
            </div>

            <h1 className="mb-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              QuickBite <span className="gradient-text">Pro</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Order food instantly with saved details.
              Login once, order anytime. Skip the queue.
            </p>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="hero" size="lg" onClick={handleDashboard}>
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  My Dashboard
                </Button>
                <Button variant="outline" size="lg" onClick={handleOrderFood}>
                  <Utensils className="mr-2 h-5 w-5" />
                  Order Food
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="hero" size="lg" onClick={handleLogin}>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login / Register
                </Button>
              </div>
            )}

            {/* Demo Access */}
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                🚀 Quick Demo Access (No login required)
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClientDemo}
                  className="flex-1 py-6 gap-3"
                >
                  <span className="text-2xl">👤</span>
                  <div className="text-left">
                    <div className="font-bold">Client Demo</div>
                    <div className="text-xs opacity-80">
                      Order food • Get token
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleStaffDemo}
                  className="flex-1 py-6 gap-3"
                >
                  <span className="text-2xl">👨‍🍳</span>
                  <div className="text-left">
                    <div className="font-bold">Staff Demo</div>
                    <div className="text-xs opacity-80">
                      Manage orders
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Feature icon="🔐" title="Save Details" desc="Login once, auto-fill forever." />
            <Feature icon="⚡" title="Quick Order" desc="No re-entering details." />
            <Feature icon="📱" title="Instant Token" desc="Pickup token instantly." />
            <Feature icon="🔄" title="Real-time" desc="Live staff dashboard." />
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-4">
              Two Locations, One App
            </h2>
            <p className="text-muted-foreground">
              Choose your favorite spot and start ordering
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <LocationCard
              icon={<Stethoscope className="h-8 w-8 text-primary" />}
              title="Medical Cafeteria"
              desc="Healthy and nutritious meals designed for wellness."
              tags={["Healthy", "Fresh", "Nutritious"]}
            />

            <LocationCard
              icon={<Coffee className="h-8 w-8 text-accent" />}
              title="Bit Bites"
              desc="Quick bites and cafe favorites."
              tags={["Fast Food", "Coffee", "Snacks"]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 QuickBite Pro. Food Ordering System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

/* ---------- Small Components ---------- */

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <div className="bg-card p-6 rounded-xl shadow-sm border border-border/50 text-center">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
);

const LocationCard = ({
  icon,
  title,
  desc,
  tags,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8">
    <div className="mb-4 inline-flex rounded-xl bg-secondary/40 p-4">
      {icon}
    </div>
    <h3 className="font-display text-2xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{desc}</p>
    <div className="flex gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="text-xs px-2 py-1 rounded-full bg-secondary"
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

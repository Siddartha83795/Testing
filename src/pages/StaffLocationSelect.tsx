import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coffee, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Location } from '@/types';

const StaffLocationSelect: React.FC = () => {
  const navigate = useNavigate();

  const handleLocationSelect = (location: Location) => {
    navigate('/staff', { state: { location } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-5xl mb-4 block">👨‍🍳</span>
            <h1 className="font-display text-3xl font-bold mb-2">Staff Dashboard</h1>
            <p className="text-muted-foreground">
              Select your location to view and manage orders
            </p>
          </div>

          <div className="grid gap-6">
            <button
              onClick={() => handleLocationSelect('medical')}
              className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="inline-flex rounded-xl bg-primary/20 p-4">
                  <Stethoscope className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-1">Medical Cafeteria</h3>
                  <p className="text-muted-foreground">
                    Manage orders for the Medical Cafeteria
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleLocationSelect('bitbites')}
              className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-xl text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="inline-flex rounded-xl bg-accent/20 p-4">
                  <Coffee className="h-10 w-10 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-1">Bit Bites</h3>
                  <p className="text-muted-foreground">
                    Manage orders for Bit Bites café
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-accent transition-colors">
                  →
                </div>
              </div>
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Demo Mode • Real-time order updates enabled
          </p>
        </div>
      </main>
    </div>
  );
};

export default StaffLocationSelect;
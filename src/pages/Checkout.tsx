import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, Minus, Plus, Trash2, CheckCircle2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, location, clearCart, updateQuantity, removeItem } = useCart();
  const { isAuthenticated, profile } = useAuth();
  const createOrderMutation = useCreateOrder();
  
  // Use profile name if logged in, otherwise empty for manual entry
  const [clientName, setClientName] = useState(profile?.name || '');
  const [isProcessing, setIsProcessing] = useState(false);

  // Update name when profile loads
  React.useEffect(() => {
    if (profile?.name) {
      setClientName(profile.name);
    }
  }, [profile]);

  if (!location || items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handlePayment = async () => {
    if (!clientName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await createOrderMutation.mutateAsync({
        items,
        location,
        clientName: clientName.trim(),
      });

      clearCart();
      
      navigate('/confirmation', { 
        state: { 
          order: {
            ...order,
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at),
          }
        } 
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const locationName = location === 'medical' ? 'Medical Cafeteria' : 'Bit Bites';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Back Button & Title */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/menu')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Menu
          </Button>
          
          <h1 className="font-display text-2xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Review your order for {locationName}</p>
        </div>

        {/* Auto-filled Banner for Logged-in Users */}
        {isAuthenticated && profile && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary">Details Auto-filled!</p>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile.name}. Your details are ready.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="rounded-xl border border-border/50 bg-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <p className="w-20 text-right font-medium">₹{item.price * item.quantity}</p>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">₹{total}</span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="rounded-xl border border-border/50 bg-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">
            {isAuthenticated ? 'Confirm Your Details' : "What's your name?"}
          </h2>
          
          <div>
            <Label htmlFor="name">Name *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter your name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="pl-10 text-lg py-6"
                autoFocus={!isAuthenticated}
                readOnly={isAuthenticated && !!profile?.name}
              />
            </div>
            {isAuthenticated && profile ? (
              <p className="text-sm text-muted-foreground mt-2">
                ✅ Using your saved profile details
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                That's all we need! Login next time for faster checkout.
              </p>
            )}
          </div>
        </div>

        {/* Payment Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full gap-2"
          onClick={handlePayment}
          disabled={isProcessing || !clientName.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : clientName.trim() ? (
            <>
              <CreditCard className="h-5 w-5" />
              Place Order as {clientName}
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              Enter your name to continue
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Token will be generated immediately after order.
        </p>
      </main>
    </div>
  );
};

export default Checkout;
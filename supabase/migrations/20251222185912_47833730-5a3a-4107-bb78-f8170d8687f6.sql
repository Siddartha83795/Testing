-- Drop existing restrictive policies for demo mode
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Clients can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can view orders for their location" ON public.orders;
DROP POLICY IF EXISTS "Staff can update orders for their location" ON public.orders;

-- Create new policies for demo mode

-- Anyone can create orders (for demo without auth)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Anyone can view orders (for demo mode)
CREATE POLICY "Anyone can view orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Anyone can update orders (for demo mode staff dashboard)
CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);
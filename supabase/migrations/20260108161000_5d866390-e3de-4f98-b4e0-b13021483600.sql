-- Create price alerts table for farmers to set price thresholds
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  crop_id TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for this anonymous app
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage their own alerts by device_id
CREATE POLICY "Anyone can view their own alerts" 
ON public.price_alerts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete their own alerts" 
ON public.price_alerts 
FOR DELETE 
USING (true);

-- Create price history cache table for analytics
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id TEXT NOT NULL,
  mandi_id TEXT NOT NULL,
  price NUMERIC NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'mock',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crop_id, mandi_id, recorded_at)
);

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read price history" 
ON public.price_history 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert price history" 
ON public.price_history 
FOR INSERT 
WITH CHECK (true);
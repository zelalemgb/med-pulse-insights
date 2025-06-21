
-- Create regions table
CREATE TABLE public.regions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create zones table
CREATE TABLE public.zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE,
  region_id uuid NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(name, region_id)
);

-- Create woredas table
CREATE TABLE public.woredas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE,
  zone_id uuid NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(name, zone_id)
);

-- Add foreign key columns to health_facilities table
ALTER TABLE public.health_facilities 
ADD COLUMN region_id uuid REFERENCES public.regions(id),
ADD COLUMN zone_id uuid REFERENCES public.zones(id),
ADD COLUMN woreda_id uuid REFERENCES public.woredas(id);

-- Add foreign key columns to pharmaceutical_products table
ALTER TABLE public.pharmaceutical_products 
ADD COLUMN region_id uuid REFERENCES public.regions(id),
ADD COLUMN zone_id uuid REFERENCES public.zones(id),
ADD COLUMN woreda_id uuid REFERENCES public.woredas(id);

-- Create indexes for better query performance
CREATE INDEX idx_zones_region_id ON public.zones(region_id);
CREATE INDEX idx_woredas_zone_id ON public.woredas(zone_id);
CREATE INDEX idx_health_facilities_region_id ON public.health_facilities(region_id);
CREATE INDEX idx_health_facilities_zone_id ON public.health_facilities(zone_id);
CREATE INDEX idx_health_facilities_woreda_id ON public.health_facilities(woreda_id);
CREATE INDEX idx_pharmaceutical_products_region_id ON public.pharmaceutical_products(region_id);
CREATE INDEX idx_pharmaceutical_products_zone_id ON public.pharmaceutical_products(zone_id);
CREATE INDEX idx_pharmaceutical_products_woreda_id ON public.pharmaceutical_products(woreda_id);

-- Enable RLS on new tables
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.woredas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for administrative tables (readable by all authenticated users)
CREATE POLICY "Authenticated users can view regions" 
  ON public.regions 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view zones" 
  ON public.zones 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view woredas" 
  ON public.woredas 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policies for admins to manage administrative data
CREATE POLICY "Admins can manage regions" 
  ON public.regions 
  FOR ALL 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage zones" 
  ON public.zones 
  FOR ALL 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage woredas" 
  ON public.woredas 
  FOR ALL 
  USING (public.is_admin_user(auth.uid()));

-- Insert some sample data to get started (you can modify these as needed)
INSERT INTO public.regions (name, code) VALUES 
('Addis Ababa', 'AA'),
('Oromia', 'OR'),
('Amhara', 'AM'),
('Tigray', 'TI'),
('SNNPR', 'SN'),
('Somali', 'SO'),
('Benishangul-Gumuz', 'BG'),
('Afar', 'AF'),
('Gambela', 'GA'),
('Harari', 'HA'),
('Dire Dawa', 'DD');

-- Insert sample zones (just a few examples - you'll need to add more)
INSERT INTO public.zones (name, code, region_id) 
SELECT 'Addis Ketema', 'AK', id FROM public.regions WHERE code = 'AA'
UNION ALL
SELECT 'Kirkos', 'KR', id FROM public.regions WHERE code = 'AA'
UNION ALL
SELECT 'West Arsi', 'WA', id FROM public.regions WHERE code = 'OR'
UNION ALL
SELECT 'East Shewa', 'ES', id FROM public.regions WHERE code = 'OR'
UNION ALL
SELECT 'North Gondar', 'NG', id FROM public.regions WHERE code = 'AM'
UNION ALL
SELECT 'South Gondar', 'SG', id FROM public.regions WHERE code = 'AM';

-- Insert sample woredas (just a few examples - you'll need to add more)
INSERT INTO public.woredas (name, code, zone_id)
SELECT 'Woreda 01', 'W01', z.id FROM public.zones z 
JOIN public.regions r ON z.region_id = r.id 
WHERE r.code = 'AA' AND z.code = 'AK'
UNION ALL
SELECT 'Woreda 02', 'W02', z.id FROM public.zones z 
JOIN public.regions r ON z.region_id = r.id 
WHERE r.code = 'AA' AND z.code = 'KR'
UNION ALL
SELECT 'Arsi Negele', 'AN', z.id FROM public.zones z 
JOIN public.regions r ON z.region_id = r.id 
WHERE r.code = 'OR' AND z.code = 'WA';

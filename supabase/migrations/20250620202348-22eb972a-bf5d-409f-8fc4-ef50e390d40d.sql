
-- Add Region and Zone columns to pharmaceutical_products table
ALTER TABLE public.pharmaceutical_products 
ADD COLUMN region text,
ADD COLUMN zone text;

-- Update the indexes to include the new columns for better performance
CREATE INDEX idx_pharmaceutical_products_region ON public.pharmaceutical_products(region);
CREATE INDEX idx_pharmaceutical_products_zone ON public.pharmaceutical_products(zone);

-- Update existing sample data to include region and zone values
UPDATE public.pharmaceutical_products 
SET 
  region = CASE 
    WHEN woreda IS NOT NULL THEN 'Addis Ababa'
    ELSE 'Oromia'
  END,
  zone = CASE 
    WHEN woreda IS NOT NULL THEN 'Addis Ababa Zone'
    ELSE 'East Shewa Zone'
  END;


-- Create pharmaceutical_products table
CREATE TABLE public.pharmaceutical_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    woreda text,
    facility text NOT NULL,
    product_name text NOT NULL,
    unit text,
    product_category text,
    price numeric(10,2),
    procurement_source text,
    quantity numeric(15,6),
    miazia_price numeric(15,6),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert sample data
INSERT INTO public.pharmaceutical_products (
    woreda, facility, product_name, unit, product_category, 
    price, procurement_source, quantity, miazia_price
) VALUES 
    (NULL, 'Nifas Silk Lafto Sub City Woreda 12 Health Center', 'White Petrolatum – Ointment', '50gm', 'Medicines', 18.2, 'NON-EPSS', 0, 0),
    ('Woreda 12', 'Eka Kotebe General Hospital', 'Paracetamol - 125mg - Suppository', '10x10', 'Medicines', 536.5, 'EPSS', 14.410256410256409, 7731.1025641025634285),
    ('Woreda 12', 'Eka Kotebe General Hospital', 'Cannula Intravenous Set - 20G', '100', 'Medical supplies', 1153.76, 'EPSS', 77.5, 89416.4),
    ('Woreda 12', 'Eka Kotebe General Hospital', 'Cannula Intravenous Set - 22G', '100', 'Medical supplies', 1486.05, 'EPSS', 39.5, 58698.975),
    (NULL, 'Nifas Silk Lafto Sub City Woreda 10 Health Center', 'White Petrolatum – Ointment', '50gm', 'Medicines', 18.2, 'NON-EPSS', 0, 0);

-- Add more sample data for variety
INSERT INTO public.pharmaceutical_products (
    woreda, facility, product_name, unit, product_category, 
    price, procurement_source, quantity, miazia_price
) VALUES 
    ('Woreda 8', 'Addis Ababa Health Center', 'Amoxicillin - 250mg - Capsule', '1000', 'Medicines', 45.30, 'EPSS', 120.5, 5461.15),
    ('Woreda 15', 'Tikur Anbessa Specialized Hospital', 'Insulin - 100IU/ml - Vial', '10ml', 'Medicines', 285.75, 'EPSS', 25.8, 7372.35),
    ('Woreda 3', 'Gandhi Memorial Hospital', 'Surgical Gloves - Sterile', '100 pairs', 'Medical supplies', 420.60, 'NON-EPSS', 45.2, 19011.12),
    ('Woreda 7', 'Ras Desta Damtew Hospital', 'Paracetamol - 500mg - Tablet', '1000', 'Medicines', 65.40, 'EPSS', 89.3, 5840.22),
    ('Woreda 11', 'Zewditu Memorial Hospital', 'Syringe - 5ml - Disposable', '100', 'Medical supplies', 125.80, 'EPSS', 67.4, 8478.92),
    ('Woreda 6', 'Alert Hospital', 'Cetrizine - 10mg - Tablet', '500', 'Medicines', 78.90, 'NON-EPSS', 34.6, 2730.14),
    ('Woreda 14', 'Yekatit 12 Hospital', 'Bandage - Elastic - 10cm', '50', 'Medical supplies', 156.25, 'EPSS', 28.7, 4484.38),
    ('Woreda 9', 'St. Paul Hospital', 'Ibuprofen - 400mg - Tablet', '1000', 'Medicines', 89.15, 'EPSS', 76.2, 6793.23),
    ('Woreda 13', 'Black Lion Hospital', 'Oxygen Mask - Adult', '20', 'Medical supplies', 234.70, 'NON-EPSS', 18.5, 4342.95),
    ('Woreda 5', 'Menelik II Hospital', 'Aspirin - 75mg - Tablet', '1000', 'Medicines', 42.85, 'EPSS', 95.8, 4105.03);

-- Create indexes for better performance
CREATE INDEX idx_pharmaceutical_products_facility ON public.pharmaceutical_products(facility);
CREATE INDEX idx_pharmaceutical_products_woreda ON public.pharmaceutical_products(woreda);
CREATE INDEX idx_pharmaceutical_products_category ON public.pharmaceutical_products(product_category);
CREATE INDEX idx_pharmaceutical_products_source ON public.pharmaceutical_products(procurement_source);

-- Enable Row Level Security (optional - can be configured later)
ALTER TABLE public.pharmaceutical_products ENABLE ROW LEVEL SECURITY;

-- Create a basic policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" 
ON public.pharmaceutical_products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

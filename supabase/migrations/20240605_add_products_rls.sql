
-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products table
CREATE POLICY "Enable read access for authenticated users" 
  ON public.products 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for product creators" 
  ON public.products 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Enable delete for product creators" 
  ON public.products 
  FOR DELETE 
  USING (created_by = auth.uid());

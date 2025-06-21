-- Improve ordering performance by indexing created_at
CREATE INDEX idx_pharmaceutical_products_created_at
  ON public.pharmaceutical_products (created_at DESC);

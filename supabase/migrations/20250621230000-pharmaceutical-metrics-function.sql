
-- Create a function to efficiently calculate pharmaceutical metrics
CREATE OR REPLACE FUNCTION get_pharmaceutical_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  total_value numeric;
  unique_facilities integer;
  unique_regions integer;
BEGIN
  -- Calculate total value from miazia_price
  SELECT COALESCE(SUM(miazia_price), 0) INTO total_value
  FROM pharmaceutical_products
  WHERE miazia_price IS NOT NULL;
  
  -- Count unique facilities
  SELECT COUNT(DISTINCT facility) INTO unique_facilities
  FROM pharmaceutical_products
  WHERE facility IS NOT NULL;
  
  -- Count unique regions
  SELECT COUNT(DISTINCT region) INTO unique_regions
  FROM pharmaceutical_products
  WHERE region IS NOT NULL;
  
  -- Build result JSON
  result := jsonb_build_object(
    'total_value', total_value,
    'unique_facilities', unique_facilities,
    'unique_regions', unique_regions
  );
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_pharmaceutical_metrics() TO authenticated;

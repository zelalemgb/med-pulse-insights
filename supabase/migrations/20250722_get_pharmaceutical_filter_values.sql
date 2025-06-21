-- Create function to fetch unique filter dropdown values
CREATE OR REPLACE FUNCTION public.get_pharmaceutical_filter_values()
RETURNS TABLE(
  facilities text[],
  regions text[],
  zones text[],
  woredas text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ARRAY(SELECT DISTINCT facility FROM public.pharmaceutical_products WHERE facility IS NOT NULL ORDER BY facility) AS facilities,
    ARRAY(SELECT DISTINCT region FROM public.pharmaceutical_products WHERE region IS NOT NULL ORDER BY region) AS regions,
    ARRAY(SELECT DISTINCT zone FROM public.pharmaceutical_products WHERE zone IS NOT NULL ORDER BY zone) AS zones,
    ARRAY(SELECT DISTINCT woreda FROM public.pharmaceutical_products WHERE woreda IS NOT NULL ORDER BY woreda) AS woredas;
END;
$$ LANGUAGE plpgsql STABLE;

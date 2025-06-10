-- Create health_facilities table
CREATE TABLE IF NOT EXISTS public.health_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  facility_type text NOT NULL,
  level text NOT NULL,
  region text NOT NULL,
  zone text NOT NULL,
  wereda text,
  latitude numeric,
  longitude numeric,
  catchment_area numeric,
  capacity integer,
  staff_count integer,
  services_offered text[],
  hmis_indicators jsonb,
  operational_status text DEFAULT 'active',
  equipment_inventory jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS and basic policies
ALTER TABLE public.health_facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated" ON public.health_facilities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for creator" ON public.health_facilities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Allow update for creator" ON public.health_facilities
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Allow delete for creator" ON public.health_facilities
  FOR DELETE USING (created_by = auth.uid());

-- Create user_facility_associations table
CREATE TABLE IF NOT EXISTS public.user_facility_associations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  facility_id uuid REFERENCES public.health_facilities(id) NOT NULL,
  association_type text NOT NULL,
  approval_status text DEFAULT 'pending',
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamptz,
  requested_at timestamptz DEFAULT now(),
  notes text,
  CONSTRAINT user_facility_associations_unique UNIQUE (user_id, facility_id)
);

ALTER TABLE public.user_facility_associations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Associations read" ON public.user_facility_associations
  FOR SELECT USING (
    user_id = auth.uid() OR
    facility_id IN (SELECT id FROM public.health_facilities WHERE created_by = auth.uid())
  );

CREATE POLICY "Associations insert" ON public.user_facility_associations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Associations update" ON public.user_facility_associations
  FOR UPDATE USING (
    approved_by = auth.uid() OR
    facility_id IN (SELECT id FROM public.health_facilities WHERE created_by = auth.uid())
  );

CREATE POLICY "Associations delete" ON public.user_facility_associations
  FOR DELETE USING (facility_id IN (SELECT id FROM public.health_facilities WHERE created_by = auth.uid()));

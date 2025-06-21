
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Region, Zone, Woreda } from '@/types/administrativeHierarchy';
import { useToast } from '@/hooks/use-toast';

export const useAdministrativeHierarchy = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [woredas, setWoredas] = useState<Woreda[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (err) {
      console.error('Error fetching regions:', err);
      setError('Failed to fetch regions');
    }
  };

  const fetchZones = async (regionId?: string) => {
    try {
      let query = supabase
        .from('zones')
        .select(`
          *,
          region:regions(*)
        `)
        .order('name');

      if (regionId) {
        query = query.eq('region_id', regionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setZones(data || []);
    } catch (err) {
      console.error('Error fetching zones:', err);
      setError('Failed to fetch zones');
    }
  };

  const fetchWoredas = async (zoneId?: string) => {
    try {
      let query = supabase
        .from('woredas')
        .select(`
          *,
          zone:zones(
            *,
            region:regions(*)
          )
        `)
        .order('name');

      if (zoneId) {
        query = query.eq('zone_id', zoneId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setWoredas(data || []);
    } catch (err) {
      console.error('Error fetching woredas:', err);
      setError('Failed to fetch woredas');
    }
  };

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchRegions(),
        fetchZones(),
        fetchWoredas()
      ]);
    } catch (err) {
      console.error('Error fetching administrative data:', err);
      toast({
        title: "Error",
        description: "Failed to fetch administrative data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    regions,
    zones,
    woredas,
    isLoading,
    error,
    fetchRegions,
    fetchZones,
    fetchWoredas,
    refetch: fetchAll
  };
};

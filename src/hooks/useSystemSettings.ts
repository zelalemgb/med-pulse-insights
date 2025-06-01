
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data as SystemSetting[];
    },
  });

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value;
  };

  const getSettingAsString = (key: string, defaultValue = ''): string => {
    const value = getSettingValue(key);
    return typeof value === 'string' ? value.replace(/"/g, '') : defaultValue;
  };

  const getSettingAsBoolean = (key: string, defaultValue = false): boolean => {
    const value = getSettingValue(key);
    return typeof value === 'boolean' ? value : defaultValue;
  };

  const getSettingAsNumber = (key: string, defaultValue = 0): number => {
    const value = getSettingValue(key);
    return typeof value === 'number' ? value : defaultValue;
  };

  return {
    settings,
    isLoading,
    getSettingValue,
    getSettingAsString,
    getSettingAsBoolean,
    getSettingAsNumber,
    appVersion: getSettingAsString('app_version', '2.1.0'),
    systemStatus: getSettingAsString('system_status', 'operational'),
    maintenanceMode: getSettingAsBoolean('maintenance_mode', false),
    enableNotifications: getSettingAsBoolean('enable_notifications', true),
    enableAnalytics: getSettingAsBoolean('enable_analytics', true),
  };
};

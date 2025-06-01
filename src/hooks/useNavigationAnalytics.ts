
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '@/utils/logger';

export const useNavigationAnalytics = () => {
  const { user } = useAuth();
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const previousPageRef = useRef<string>('');

  const trackNavigationMutation = useMutation({
    mutationFn: async ({
      page,
      referrer = null,
      sessionId = null,
      deviceType = 'desktop',
    }: {
      page: string;
      referrer?: string | null;
      sessionId?: string | null;
      deviceType?: string;
    }) => {
      if (!user) return;

      const { data, error } = await supabase.rpc('track_navigation', {
        _user_id: user.id,
        _page_visited: page,
        _referrer_page: referrer,
        _session_id: sessionId,
        _device_type: deviceType,
      });

      if (error) throw error;
      return data;
    },
  });

  // Track page visits automatically
  useEffect(() => {
    if (!user) return;

    const currentPage = location.pathname;
    const referrer = previousPageRef.current || null;
    const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
    const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}`;

    // Store session ID for consistency
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', sessionId);
    }

    // Track the page visit
    trackNavigationMutation.mutate({
      page: currentPage,
      referrer,
      sessionId,
      deviceType,
    });

    // Update references for next navigation
    previousPageRef.current = currentPage;
    startTimeRef.current = Date.now();

    return () => {
      // Calculate time spent when leaving the page
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) { // Only track if spent more than 5 seconds
        // This would be handled by a separate mutation if needed
        logger.log(`Time spent on ${currentPage}: ${timeSpent} seconds`);
      }
    };
  }, [location.pathname, user, trackNavigationMutation.mutate]);

  return {
    trackNavigation: trackNavigationMutation.mutate,
    isTracking: trackNavigationMutation.isPending,
  };
};


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InteractiveMap from './InteractiveMap';
import TopNavigation from './TopNavigation';
import MiniDashboard from './MiniDashboard';
import MapLegend from './MapLegend';
import FacilityInfoModal from './FacilityInfoModal';
import ReportIssueModal from './ReportIssueModal';
import { Facility } from './types';

interface InteractiveLandingPageProps {
  hideTopNavigation?: boolean;
}

const InteractiveLandingPage = ({ hideTopNavigation = false }: InteractiveLandingPageProps) => {
  const { user } = useAuth();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="relative w-full bg-gray-50">
      {!hideTopNavigation && <TopNavigation />}
      
      {/* Main content container with proper viewport handling */}
      <div className={`w-full ${
        hideTopNavigation 
          ? 'h-screen' 
          : 'min-h-screen pt-16'
      }`}>
        
        {/* Map Section - Full width now */}
        <div className="relative w-full h-full min-h-[60vh] lg:min-h-[70vh] xl:min-h-screen">
          <InteractiveMap 
            onFacilitySelect={setSelectedFacility}
            onReportIssue={() => setIsReportModalOpen(true)}
          />
          
          {/* Overlays positioned responsively */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Mini dashboard - responsive positioning */}
            {user && (
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 pointer-events-auto">
                <MiniDashboard />
              </div>
            )}
            
            {/* Map legend - responsive positioning */}
            <div className={`absolute left-2 sm:left-4 pointer-events-auto ${
              user ? 'top-[20rem] sm:top-80' : 'top-16 sm:top-20'
            }`}>
              <MapLegend isUserAuthenticated={!!user} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals with responsive sizing */}
      <FacilityInfoModal 
        facility={selectedFacility}
        isOpen={!!selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
      
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default InteractiveLandingPage;


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
      <div className={`flex flex-col xl:flex-row w-full ${
        hideTopNavigation 
          ? 'h-screen' 
          : 'min-h-screen pt-16'
      }`}>
        
        {/* Map Section - Responsive sizing */}
        <div className="flex-1 relative min-h-[60vh] lg:min-h-[70vh] xl:min-h-screen">
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

        {/* Dashboard Panel - Only show for authenticated users on larger screens */}
        {user && (
          <div className="xl:w-96 xl:max-w-md bg-white border-l border-gray-200 flex flex-col order-first xl:order-last">
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Quick Actions</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Access your dashboard features and analytics from this panel.
              </p>
              
              {/* Additional responsive content */}
              <div className="mt-4 space-y-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">System Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

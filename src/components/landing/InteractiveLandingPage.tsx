
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
    <div className="relative min-h-screen bg-gray-50">
      {!hideTopNavigation && <TopNavigation />}
      
      <div className={`flex flex-col lg:flex-row ${hideTopNavigation ? 'h-screen' : 'h-[calc(100vh-4rem)] mt-16'}`}>
        {/* Map Section */}
        <div className="flex-1 relative">
          <InteractiveMap 
            onFacilitySelect={setSelectedFacility}
            onReportIssue={() => setIsReportModalOpen(true)}
          />
          
          {/* Show dashboard and legend only for authenticated users */}
          {user && (
            <>
              <MiniDashboard />
              <MapLegend />
            </>
          )}
        </div>

        {/* Dashboard Panel - Only show for authenticated users */}
        {user && (
          <div className="lg:w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Additional dashboard content can go here */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-sm text-gray-600">Access your dashboard features and analytics.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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

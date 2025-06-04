
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InteractiveMap from './InteractiveMap';
import TopNavigation from './TopNavigation';
import MiniDashboard from './MiniDashboard';
import FacilityInfoModal from './FacilityInfoModal';
import ReportIssueModal from './ReportIssueModal';

interface InteractiveLandingPageProps {
  hideTopNavigation?: boolean;
}

const InteractiveLandingPage = ({ hideTopNavigation = false }: InteractiveLandingPageProps) => {
  const { user } = useAuth();
  const [selectedFacility, setSelectedFacility] = useState(null);
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
        </div>

        {/* Dashboard Panel - Only show for authenticated users */}
        {user && (
          <div className="lg:w-96 bg-white border-l border-gray-200 flex flex-col">
            <MiniDashboard />
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

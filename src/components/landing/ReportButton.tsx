
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ReportIssueModal from './ReportIssueModal';

const ReportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Report Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[1000]">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white shadow-xl rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 transition-all hover:scale-110 border-2 border-white"
          title="Report drug issue"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        
        {/* Tooltip - Hidden on mobile */}
        <div className="absolute bottom-14 sm:bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg hidden sm:block">
          Report drug issue
        </div>
      </div>

      {/* Report Modal */}
      <ReportIssueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ReportButton;

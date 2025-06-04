
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ReportIssueModal from './ReportIssueModal';

const ReportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Report Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-full w-14 h-14 p-0 transition-all hover:scale-105"
          title="Report drug issue"
        >
          <Plus className="w-6 h-6" />
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
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

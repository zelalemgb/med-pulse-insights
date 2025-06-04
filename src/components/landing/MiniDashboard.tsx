
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building, AlertTriangle, FileText } from 'lucide-react';

const MiniDashboard = () => {
  // Mock data for demonstration
  const nationalStats = {
    stockAvailabilityRate: 71,
    facilitiesReporting: 1247,
    mostReportedMissing: 'Amoxicillin',
    publicReportsToday: 23
  };

  return (
    <div className="absolute top-20 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-900">National Overview</h3>
        <Link 
          to="/auth" 
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          View Full Dashboard →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Stock Availability Rate */}
        <div className="bg-white/80 rounded-md p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Stock Rate</span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {nationalStats.stockAvailabilityRate}%
          </div>
        </div>

        {/* Facilities Reporting */}
        <div className="bg-white/80 rounded-md p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Reporting</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {nationalStats.facilitiesReporting.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">facilities this week</div>
        </div>

        {/* Most Reported Missing */}
        <div className="bg-white/80 rounded-md p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Missing</span>
          </div>
          <div className="text-sm font-bold text-orange-600">
            {nationalStats.mostReportedMissing}
          </div>
          <div className="text-xs text-gray-500">most reported</div>
        </div>

        {/* Public Reports Today */}
        <div className="bg-white/80 rounded-md p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-600">Reports</span>
          </div>
          <div className="text-lg font-bold text-purple-600">
            {nationalStats.publicReportsToday}
          </div>
          <div className="text-xs text-gray-500">today</div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Real-time data • Updated 5min ago
      </div>
    </div>
  );
};

export default MiniDashboard;

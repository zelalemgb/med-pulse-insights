
import React from 'react';

interface MapLegendProps {
  className?: string;
  isUserAuthenticated?: boolean;
}

const MapLegend = ({ className = "", isUserAuthenticated = false }: MapLegendProps) => {
  // Position the legend based on authentication status
  const positionClass = isUserAuthenticated ? "top-80" : "top-20";
  
  return (
    <div className={`absolute ${positionClass} left-2 sm:left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl border border-gray-200 w-[300px] sm:w-80 max-w-[calc(100vw-1rem)] ${className}`}>
      <h4 className="font-semibold text-sm mb-3 text-gray-900">Map Legend</h4>
      <div className="space-y-2 text-xs">
        {/* Your Location */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span className="text-gray-700">Your Location</span>
        </div>

        {/* Status Indicators */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-2">Stock Status</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-gray-700">In Stock</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-gray-700">Partial Stock</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-gray-700">Stock Out</span>
            </div>
          </div>
        </div>

        {/* Facility Types */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-2">Facility Types</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 border border-white shadow-sm flex items-center justify-center text-[8px] flex-shrink-0">🏥</div>
              <span className="text-gray-700">Hospital</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500 border border-white shadow-sm flex items-center justify-center text-[8px] flex-shrink-0">🏥</div>
              <span className="text-gray-700">Health Center</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500 border border-white shadow-sm flex items-center justify-center text-[8px] flex-shrink-0">💊</div>
              <span className="text-gray-700">Pharmacy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-purple-500 border border-white shadow-sm flex items-center justify-center text-[8px] flex-shrink-0">📦</div>
              <span className="text-gray-700">Store/Bureau</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

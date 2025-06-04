
import React from 'react';

interface MapLegendProps {
  className?: string;
  isUserAuthenticated?: boolean;
}

const MapLegend = ({ className = "", isUserAuthenticated = false }: MapLegendProps) => {
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 
      w-[280px] sm:w-[320px] md:w-[360px] lg:w-80 
      max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)]
      p-3 sm:p-4 ${className}`}>
      
      <h4 className="font-semibold text-sm sm:text-base mb-3 text-gray-900">Map Legend</h4>
      
      <div className="space-y-3 text-xs sm:text-sm">
        {/* Your Location */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="text-gray-700 font-medium">Your Location</span>
        </div>

        {/* Status Indicators */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Stock Status</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-gray-700">In Stock (Available)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-gray-700">Partial Stock (Limited)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-gray-700">Stock Out (Unavailable)</span>
            </div>
          </div>
        </div>

        {/* Facility Types */}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Facility Types</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 border border-white shadow-sm flex items-center justify-center text-[8px] sm:text-[10px] flex-shrink-0">🏥</div>
              <span className="text-gray-700">Hospital</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 border border-white shadow-sm flex items-center justify-center text-[8px] sm:text-[10px] flex-shrink-0">🏥</div>
              <span className="text-gray-700">Health Center</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 border border-white shadow-sm flex items-center justify-center text-[8px] sm:text-[10px] flex-shrink-0">💊</div>
              <span className="text-gray-700">Pharmacy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500 border border-white shadow-sm flex items-center justify-center text-[8px] sm:text-[10px] flex-shrink-0">📦</div>
              <span className="text-gray-700">Store/Bureau</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Responsive helper text */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Click markers for details
        </p>
      </div>
    </div>
  );
};

export default MapLegend;

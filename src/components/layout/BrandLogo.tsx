
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
      <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
        <Shield className="w-4 h-4 text-blue-600" />
      </div>
      <span className="text-xl font-semibold text-gray-900 hidden sm:block">
        Pharmaceutical Analytics
      </span>
      <span className="text-lg font-semibold text-gray-900 sm:hidden">
        PharmAnalytics
      </span>
    </Link>
  );
};

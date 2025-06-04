
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, HelpCircle, Info } from 'lucide-react';

const TopNavigation = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xl font-semibold text-gray-900 hidden sm:block">
              Pharmaceutical Analytics
            </span>
            <span className="text-lg font-semibold text-gray-900 sm:hidden">
              PharmAnalytics
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
            </button>
            
            <Link to="/auth">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sign In / Join
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="text-center mb-16 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
        Pharmaceutical Supply Chain
        <span className="block font-medium text-blue-600">Analytics Platform</span>
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Real-time visibility into pharmaceutical inventory across healthcare facilities. 
        Evidence-based insights for better patient outcomes.
      </p>
      
      {/* Primary Action */}
      <div className="flex justify-center mb-8">
        <Link to="/auth">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto">
            Access Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AccessSection = () => {
  return (
    <div className="text-center bg-blue-50 rounded-lg p-12">
      <h2 className="text-2xl font-light text-gray-900 mb-4">
        Access the Platform
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Join health facilities, government partners, and development organizations 
        using data-driven insights to strengthen pharmaceutical supply chains.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/auth">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto">
            Request Access
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2">
          View Documentation
        </Button>
      </div>
    </div>
  );
};

export default AccessSection;

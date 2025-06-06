
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import OSMMap from '@/components/map/OSMMap';

interface FeatureProps {
  title: string;
}

function Feature({ title }: FeatureProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">Short description about this feature.</p>
    </div>
  );
}

const WelcomeSection = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
        <div className="text-xl font-bold">Forlab+</div>
        <nav className="space-x-4">
          <a href="#about" className="hover:underline">About</a>
          <a href="#how" className="hover:underline">How It Works</a>
          <a href="#labs" className="hover:underline">For Labs</a>
          <a href="#patients" className="hover:underline">For Patients</a>
          <Link to="/auth">
            <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login / Sign Up</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-16 bg-gray-100 min-h-[600px]">
        <div className="max-w-xl lg:w-1/2 z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Find Essential Laboratory Services Near You. Report What's Missing.
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-gray-700 leading-relaxed">
            A decentralized, real-time platform where laboratories, clinics, and patients collaborate to improve service availability.
          </p>
          <div className="space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg">Download App</Button>
            <Button variant="outline" className="bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg text-lg">Join as a Laboratory</Button>
          </div>
        </div>
        <div className="lg:w-1/2 w-full mt-10 lg:mt-0 lg:ml-10 relative">
          <OSMMap height="500px" className="w-full shadow-lg" />
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Search or Report</h3>
            <p>Check availability or report shortages in real time.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Update Inventory</h3>
            <p>Laboratories and clinics update their stock, visible to all.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Coordinate and Respond</h3>
            <p>Facilities collaborate to fill supply gaps efficiently.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-gray-50">
        <h2 className="text-2xl font-semibold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature title="Live Service Map" />
          <Feature title="Daily Stock Updates" />
          <Feature title="AI Forecasting Insights" />
          <Feature title="Community Feedback Loop" />
          <Feature title="Real-time Notifications" />
          <Feature title="Laboratory Coordination" />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t mt-16">
        <p>© {new Date().getFullYear()} Forlab+. All rights reserved.</p>
        <p className="mt-2">Made with ❤️ in Ethiopia</p>
      </footer>
    </div>
  );
};

export default WelcomeSection;

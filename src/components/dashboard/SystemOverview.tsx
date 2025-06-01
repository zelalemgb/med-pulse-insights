
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SystemOverview = () => {
  return (
    <div className="text-center">
      <Card className="max-w-4xl mx-auto shadow-xl border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">
            Ready to optimize your pharmaceutical supply chain?
          </CardTitle>
          <CardDescription className="text-lg">
            Start with any of the three core features above and unlock the power of data-driven decision making
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-base text-gray-600">Healthcare Facilities</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">98.5%</div>
              <div className="text-base text-gray-600">Data Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">25%</div>
              <div className="text-base text-gray-600">Cost Reduction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverview;

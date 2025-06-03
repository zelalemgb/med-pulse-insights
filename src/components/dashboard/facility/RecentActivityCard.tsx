
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const RecentActivityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Supply Chain Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <span className="text-sm">Received shipment: 15 products restocked</span>
              <span className="text-xs text-gray-500 block">2 hours ago</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <span className="text-sm">Stock-out alert: Amoxicillin 250mg</span>
              <span className="text-xs text-gray-500 block">4 hours ago</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="flex-1">
              <span className="text-sm">Low stock warning: Paracetamol 500mg</span>
              <span className="text-xs text-gray-500 block">6 hours ago</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <span className="text-sm">Order submitted: Emergency procurement request</span>
              <span className="text-xs text-gray-500 block">1 day ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LevelOverviewHeaderProps {
  levelName: string;
  coverageArea: string;
  performanceScore: number;
}

const LevelOverviewHeader = ({ levelName, coverageArea, performanceScore }: LevelOverviewHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-blue-900">{levelName} Supply Chain Overview</CardTitle>
            <p className="text-blue-700 mt-1">{coverageArea}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">Performance: {performanceScore}/100</Badge>
        </div>
      </CardHeader>
    </Card>
  );
};

export default LevelOverviewHeader;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const ProductCategoriesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Categories Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-green-700">Essential Medicines</div>
            <div className="text-xs text-green-600 mt-1">98% available</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">67</div>
            <div className="text-sm text-blue-700">Vaccines</div>
            <div className="text-xs text-blue-600 mt-1">94% available</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">22</div>
            <div className="text-sm text-purple-700">Medical Supplies</div>
            <div className="text-xs text-purple-600 mt-1">87% available</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategoriesCard;

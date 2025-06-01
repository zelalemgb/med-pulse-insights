
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Package, Upload, Users } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

const DataSummaryCards = () => {
  const { userRole } = usePermissions();

  const getSummaryData = () => {
    // Mock data based on user role - in real app this would come from API
    const roleData = {
      'national': {
        facilities: 1250,
        products: 850,
        imports: 45,
        users: 3200
      },
      'regional': {
        facilities: 180,
        products: 620,
        imports: 12,
        users: 450
      },
      'zonal': {
        facilities: 35,
        products: 420,
        imports: 8,
        users: 125
      },
      'facility_manager': {
        facilities: 1,
        products: 280,
        imports: 3,
        users: 15
      },
      'facility_officer': {
        facilities: 1,
        products: 280,
        imports: 2,
        users: 8
      }
    };

    return roleData[userRole] || roleData['facility_officer'];
  };

  const data = getSummaryData();

  const summaryCards = [
    {
      title: 'Facilities',
      value: data.facilities.toLocaleString(),
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Products',
      value: data.products.toLocaleString(),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Data Imports',
      value: data.imports.toString(),
      icon: Upload,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Users',
      value: data.users.toLocaleString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.title === 'Data Imports' ? 'This month' : 'Total managed'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataSummaryCards;

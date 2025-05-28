
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  Edit, 
  Copy,
  Star,
  Clock
} from 'lucide-react';

const ReportTemplates = () => {
  const templates = [
    {
      id: 1,
      name: 'Standard Consumption Report',
      description: 'Monthly consumption analysis with trends and forecasts',
      category: 'Consumption',
      usage: 45,
      lastUsed: '2 days ago',
      isFavorite: true,
      isBuiltIn: true
    },
    {
      id: 2,
      name: 'Stock Status Summary',
      description: 'Current inventory levels and stock alerts',
      category: 'Inventory',
      usage: 32,
      lastUsed: '1 week ago',
      isFavorite: false,
      isBuiltIn: true
    },
    {
      id: 3,
      name: 'Wastage Analysis Report',
      description: 'Detailed analysis of expired and damaged products',
      category: 'Quality',
      usage: 18,
      lastUsed: '3 days ago',
      isFavorite: true,
      isBuiltIn: true
    },
    {
      id: 4,
      name: 'Procurement Planning',
      description: 'Demand forecast and procurement recommendations',
      category: 'Planning',
      usage: 24,
      lastUsed: '5 days ago',
      isFavorite: false,
      isBuiltIn: true
    },
    {
      id: 5,
      name: 'Custom Monthly Review',
      description: 'Custom template for comprehensive monthly reviews',
      category: 'Custom',
      usage: 12,
      lastUsed: '1 week ago',
      isFavorite: false,
      isBuiltIn: false
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Consumption': 'bg-blue-100 text-blue-800',
      'Inventory': 'bg-green-100 text-green-800',
      'Quality': 'bg-amber-100 text-amber-800',
      'Planning': 'bg-purple-100 text-purple-800',
      'Custom': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Templates</CardTitle>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      {template.isFavorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Usage</span>
                      <span className="font-medium">{template.usage} times</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Last used</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.lastUsed}
                      </span>
                    </div>

                    {template.isBuiltIn && (
                      <div className="flex items-center text-xs text-blue-600">
                        <Badge variant="outline" className="text-xs">Built-in</Badge>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Copy className="h-3 w-3 mr-1" />
                        Use
                      </Button>
                      {!template.isBuiltIn && (
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Template Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Consumption', 'Inventory', 'Quality', 'Planning', 'Custom'].map((category) => {
              const count = templates.filter(t => t.category === category).length;
              return (
                <div key={category} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{category}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTemplates;

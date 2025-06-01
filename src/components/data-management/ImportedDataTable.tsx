
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Calendar, CheckCircle } from 'lucide-react';

const ImportedDataTable = () => {
  // Mock imported data
  const imports = [
    {
      id: '1',
      fileName: 'consumption_data_jan_2024.xlsx',
      type: 'Consumption Data',
      uploadDate: '2024-01-15T10:30:00Z',
      status: 'Processed',
      records: 1250,
      facility: 'Central Medical Store',
      uploadedBy: 'John Doe'
    },
    {
      id: '2',
      fileName: 'facility_inventory_dec_2023.csv',
      type: 'Inventory Data',
      uploadDate: '2024-01-10T14:45:00Z',
      status: 'Processed',
      records: 850,
      facility: 'Regional Hospital',
      uploadedBy: 'Jane Smith'
    },
    {
      id: '3',
      fileName: 'forecast_data_q1_2024.xlsx',
      type: 'Forecast Data',
      uploadDate: '2024-01-08T09:15:00Z',
      status: 'Processing',
      records: 420,
      facility: 'District Health Center',
      uploadedBy: 'Mike Johnson'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Consumption Data': return Calendar;
      case 'Inventory Data': return FileText;
      case 'Forecast Data': return Upload;
      default: return FileText;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Imports
            </CardTitle>
            <CardDescription>
              Track and manage your imported data files
            </CardDescription>
          </div>
          <Button onClick={() => window.location.href = '/import'}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {imports.map((importItem) => {
            const TypeIcon = getTypeIcon(importItem.type);
            return (
              <div key={importItem.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{importItem.fileName}</h3>
                      <p className="text-sm text-gray-600">{importItem.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(importItem.status)}>
                    {importItem.status === 'Processed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {importItem.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Records:</span>
                    <span className="font-medium ml-2">{importItem.records.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Facility:</span>
                    <span className="font-medium ml-2">{importItem.facility}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Uploaded by:</span>
                    <span className="font-medium ml-2">{importItem.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium ml-2">
                      {new Date(importItem.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {imports.length === 0 && (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No imports found</h3>
            <p className="text-gray-500 mb-4">Start by importing your first data file</p>
            <Button onClick={() => window.location.href = '/import'}>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportedDataTable;

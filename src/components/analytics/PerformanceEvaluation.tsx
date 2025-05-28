
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, Database, Zap, Shield } from 'lucide-react';

interface PerformanceScore {
  category: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  items: {
    name: string;
    implemented: boolean;
    recommendation?: string;
  }[];
}

const PerformanceEvaluation: React.FC = () => {
  const [evaluationResults, setEvaluationResults] = useState<PerformanceScore[]>([]);

  useEffect(() => {
    // Simulate performance evaluation
    const results: PerformanceScore[] = [
      {
        category: 'Database Design',
        score: 7,
        maxScore: 10,
        status: 'good',
        items: [
          { name: 'Proper indexing schema defined', implemented: true },
          { name: 'Partitioning strategy documented', implemented: true },
          { name: 'Read replicas configuration', implemented: false, recommendation: 'Configure read replicas for analytics' },
          { name: 'Query optimization patterns', implemented: true },
          { name: 'Database connection pooling', implemented: true },
        ]
      },
      {
        category: 'Frontend Performance',
        score: 6,
        maxScore: 10,
        status: 'needs-improvement',
        items: [
          { name: 'Lazy loading components', implemented: false, recommendation: 'Implement React.lazy for route components' },
          { name: 'Virtual scrolling for tables', implemented: true },
          { name: 'Efficient state management', implemented: true },
          { name: 'Code splitting', implemented: false, recommendation: 'Implement dynamic imports' },
          { name: 'Memoization strategies', implemented: true },
        ]
      },
      {
        category: 'Caching Strategy',
        score: 8,
        maxScore: 10,
        status: 'good',
        items: [
          { name: 'Browser caching headers', implemented: true },
          { name: 'In-memory caching layer', implemented: true },
          { name: 'CDN configuration', implemented: false, recommendation: 'Setup CDN for static assets' },
          { name: 'Cache invalidation strategy', implemented: true },
          { name: 'Query result caching', implemented: true },
        ]
      }
    ];
    
    setEvaluationResults(results);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'needs-improvement': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'excellent': 'default',
      'good': 'secondary',
      'needs-improvement': 'outline',
      'critical': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const overallScore = evaluationResults.reduce((sum, cat) => sum + cat.score, 0);
  const maxOverallScore = evaluationResults.reduce((sum, cat) => sum + cat.maxScore, 0);
  const overallPercentage = maxOverallScore > 0 ? Math.round((overallScore / maxOverallScore) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Performance & Scalability Evaluation</h2>
        <p className="text-muted-foreground">
          Comprehensive assessment of key performance and scalability metrics
        </p>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-blue-600">
              {overallPercentage}%
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                {overallScore} out of {maxOverallScore} points
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluationResults.map((category) => (
              <Card key={category.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {category.category}
                    {getStatusIcon(category.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{category.score}/{category.maxScore}</span>
                      {getStatusBadge(category.status)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Performance Aspect</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationResults.find(r => r.category === 'Database Design')?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.implemented ? (
                          <Badge variant="default">Implemented</Badge>
                        ) : (
                          <Badge variant="outline">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.recommendation || 'No action needed'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frontend">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Frontend Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Performance Aspect</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationResults.find(r => r.category === 'Frontend Performance')?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.implemented ? (
                          <Badge variant="default">Implemented</Badge>
                        ) : (
                          <Badge variant="outline">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.recommendation || 'No action needed'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caching">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Caching Strategy Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caching Aspect</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationResults.find(r => r.category === 'Caching Strategy')?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.implemented ? (
                          <Badge variant="default">Implemented</Badge>
                        ) : (
                          <Badge variant="outline">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.recommendation || 'No action needed'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceEvaluation;

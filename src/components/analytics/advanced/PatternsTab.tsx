
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { PatternAnalysis } from '@/types/advancedAnalytics';

interface PatternsTabProps {
  patternAnalysis: PatternAnalysis[];
}

const PatternsTab: React.FC<PatternsTabProps> = ({ patternAnalysis }) => {
  const getPatternBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Detected Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patternAnalysis.map((pattern, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{pattern.pattern}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPatternBadgeColor(pattern.impact)}>{pattern.impact}</Badge>
                    <span className={`text-sm font-medium ${getConfidenceColor(pattern.confidence)}`}>
                      {pattern.confidence}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                <div className="flex flex-wrap gap-1">
                  {pattern.products.slice(0, 3).map((product, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                  {pattern.products.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pattern.products.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pattern Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={patternAnalysis.map(p => ({ 
              confidence: p.confidence, 
              impact: p.impact === 'high' ? 3 : p.impact === 'medium' ? 2 : 1,
              name: p.pattern
            }))}>
              <CartesianGrid />
              <XAxis dataKey="confidence" name="Confidence" />
              <YAxis dataKey="impact" name="Impact" />
              <Tooltip />
              <Scatter dataKey="impact" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternsTab;

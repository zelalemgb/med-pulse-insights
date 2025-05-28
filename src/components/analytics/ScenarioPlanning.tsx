
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, AlertTriangle, CheckCircle, Plus, Play, Download } from 'lucide-react';
import { scenarioPlanningEngine, Scenario, ScenarioResult, ScenarioParameter } from '@/utils/scenarioPlanning';
import { useToast } from '@/hooks/use-toast';

const ScenarioPlanning = () => {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [parameters, setParameters] = useState<ScenarioParameter[]>([]);
  const [scenarioResults, setScenarioResults] = useState<Map<string, ScenarioResult>>(new Map());
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    parameters: {} as Record<string, number>,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isRunning, setIsRunning] = useState<string | null>(null);

  useEffect(() => {
    // Load available parameters
    const availableParams = scenarioPlanningEngine.getAvailableParameters();
    setParameters(availableParams);
    
    // Initialize new scenario parameters with defaults
    const defaultParams: Record<string, number> = {};
    availableParams.forEach(param => {
      defaultParams[param.id] = param.defaultValue;
    });
    setNewScenario(prev => ({ ...prev, parameters: defaultParams }));

    // Load existing scenarios
    setScenarios(scenarioPlanningEngine.getAllScenarios());
  }, []);

  const handleCreateScenario = () => {
    if (newScenario.name && newScenario.description) {
      const scenario = scenarioPlanningEngine.createScenario({
        name: newScenario.name,
        description: newScenario.description,
        parameters: newScenario.parameters,
        createdBy: 'current-user', // This would come from auth context
      });
      
      setScenarios(prev => [...prev, scenario]);
      setNewScenario({
        name: '',
        description: '',
        parameters: { ...newScenario.parameters },
      });
      setIsCreating(false);
      
      toast({
        title: "Scenario Created",
        description: `${scenario.name} has been created successfully.`,
      });
    }
  };

  const handleRunScenario = async (scenarioId: string) => {
    setIsRunning(scenarioId);
    
    // Mock baseline data - this would come from actual data in production
    const baselineData = {
      annualConsumption: 10000,
      annualWastage: 500,
      annualStockOuts: 12,
    };
    
    try {
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = scenarioPlanningEngine.runScenario(scenarioId, baselineData);
      setScenarioResults(prev => new Map(prev.set(scenarioId, result)));
      
      const scenario = scenarios.find(s => s.id === scenarioId);
      toast({
        title: "Scenario Completed",
        description: `${scenario?.name} analysis completed with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Scenario Failed",
        description: "Failed to run scenario analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(null);
    }
  };

  const handleParameterChange = (paramId: string, value: number) => {
    setNewScenario(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramId]: value,
      },
    }));
  };

  const handleExportResults = () => {
    const csvContent = [
      ['Scenario', 'Consumption', 'Wastage', 'Stock Outs', 'Budget Impact', 'Confidence'].join(','),
      ...Array.from(scenarioResults.entries()).map(([id, result]) => {
        const scenario = scenarios.find(s => s.id === id);
        return [
          scenario?.name || id,
          result.projectedConsumption,
          result.projectedWastage,
          result.projectedStockOuts,
          result.budgetImpact,
          result.confidence
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenario-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
    if (confidence >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Scenario Planning</h2>
        <div className="flex gap-2">
          {scenarioResults.size > 0 && (
            <Button variant="outline" onClick={handleExportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scenario Name</Label>
                    <Input
                      value={newScenario.name}
                      onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter scenario name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newScenario.description}
                      onChange={(e) => setNewScenario(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this scenario"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Scenario Parameters</h4>
                  {parameters.map((param) => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>{param.name}</Label>
                        <span className="text-sm text-muted-foreground">
                          {newScenario.parameters[param.id]}{param.unit}
                        </span>
                      </div>
                      <Slider
                        value={[newScenario.parameters[param.id] || param.defaultValue]}
                        onValueChange={([value]) => handleParameterChange(param.id, value)}
                        min={param.minValue}
                        max={param.maxValue}
                        step={param.type === 'percentage' ? 1 : 0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">{param.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateScenario}>Create Scenario</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {scenarioResults.has(scenario.id) && getConfidenceBadge(scenarioResults.get(scenario.id)!.confidence)}
                    <Button
                      size="sm"
                      onClick={() => handleRunScenario(scenario.id)}
                      disabled={isRunning === scenario.id}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isRunning === scenario.id ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    {Object.entries(scenario.parameters).map(([key, value]) => {
                      const param = parameters.find(p => p.id === key);
                      return param ? (
                        <div key={key} className="text-center">
                          <p className="font-medium">{param.name}</p>
                          <p className="text-muted-foreground">{value}{param.unit}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Created {scenario.createdAt.toLocaleDateString()} by {scenario.createdBy}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {Array.from(scenarioResults.entries()).map(([scenarioId, result]) => {
            const scenario = scenarios.find(s => s.id === scenarioId);
            if (!scenario) return null;

            return (
              <Card key={scenarioId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {scenario.name} - Results
                    {getConfidenceBadge(result.confidence)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">{result.projectedConsumption.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Projected Consumption</p>
                    </div>
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold">{result.projectedWastage.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Projected Wastage</p>
                    </div>
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <p className="text-2xl font-bold">{result.projectedStockOuts}</p>
                      <p className="text-sm text-muted-foreground">Stock Outs</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">${result.budgetImpact.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Budget Impact</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Monthly Projections</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={result.details.monthlyProjections}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="consumption" stroke="#2563eb" strokeWidth={2} />
                          <Line type="monotone" dataKey="wastage" stroke="#dc2626" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Risk Factors & Recommendations</h4>
                      <div className="space-y-4">
                        {result.details.riskFactors.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-red-600 mb-2">Risk Factors:</p>
                            <ul className="text-sm space-y-1">
                              {result.details.riskFactors.map((risk, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.details.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-green-600 mb-2">Recommendations:</p>
                            <ul className="text-sm space-y-1">
                              {result.details.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {scenarioResults.size === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No scenario results yet. Run some scenarios to see results here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {scenarioResults.size > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Array.from(scenarioResults.entries()).map(([id, result]) => ({
                      name: scenarios.find(s => s.id === id)?.name || id,
                      consumption: result.projectedConsumption,
                      wastage: result.projectedWastage,
                      budget: result.budgetImpact / 1000, // Convert to thousands for better visualization
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="consumption" fill="#2563eb" name="Consumption" />
                      <Bar dataKey="wastage" fill="#dc2626" name="Wastage" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="grid gap-4">
                    {Array.from(scenarioResults.entries()).map(([id, result]) => {
                      const scenario = scenarios.find(s => s.id === id);
                      return scenario ? (
                        <div key={id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{scenario.name}</h4>
                            <p className="text-sm text-muted-foreground">{scenario.description}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getConfidenceColor(result.confidence)}`}>
                              {result.confidence}% confidence
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${result.budgetImpact.toLocaleString()} budget impact
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Run scenarios to see comparison results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScenarioPlanning;

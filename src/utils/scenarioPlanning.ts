
export interface ScenarioParameter {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'absolute' | 'multiplier';
  defaultValue: number;
  minValue: number;
  maxValue: number;
  unit?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
  createdAt: Date;
  createdBy: string;
}

export interface ScenarioResult {
  scenarioId: string;
  projectedConsumption: number;
  projectedWastage: number;
  projectedStockOuts: number;
  budgetImpact: number;
  confidence: number;
  details: {
    monthlyProjections: Array<{
      month: string;
      consumption: number;
      wastage: number;
      stockLevel: number;
    }>;
    riskFactors: string[];
    recommendations: string[];
  };
}

export class ScenarioPlanningEngine {
  private scenarios: Map<string, Scenario> = new Map();
  private parameters: ScenarioParameter[] = [
    {
      id: 'demand_growth',
      name: 'Demand Growth Rate',
      description: 'Expected annual growth in product demand',
      type: 'percentage',
      defaultValue: 5,
      minValue: -20,
      maxValue: 50,
      unit: '%'
    },
    {
      id: 'supply_disruption',
      name: 'Supply Chain Disruption',
      description: 'Probability of supply chain disruptions',
      type: 'percentage',
      defaultValue: 10,
      minValue: 0,
      maxValue: 100,
      unit: '%'
    },
    {
      id: 'seasonal_variation',
      name: 'Seasonal Variation',
      description: 'Seasonal demand variation factor',
      type: 'multiplier',
      defaultValue: 1.2,
      minValue: 0.8,
      maxValue: 2.0,
    },
    {
      id: 'wastage_reduction',
      name: 'Wastage Reduction Initiative',
      description: 'Expected reduction in wastage rates',
      type: 'percentage',
      defaultValue: 0,
      minValue: 0,
      maxValue: 50,
      unit: '%'
    },
    {
      id: 'budget_constraint',
      name: 'Budget Constraint',
      description: 'Budget limitation factor',
      type: 'multiplier',
      defaultValue: 1.0,
      minValue: 0.5,
      maxValue: 1.5,
    }
  ];

  getAvailableParameters(): ScenarioParameter[] {
    return [...this.parameters];
  }

  createScenario(scenario: Omit<Scenario, 'id' | 'createdAt'>): Scenario {
    const newScenario: Scenario = {
      ...scenario,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    this.scenarios.set(newScenario.id, newScenario);
    return newScenario;
  }

  getScenario(id: string): Scenario | null {
    return this.scenarios.get(id) || null;
  }

  getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  deleteScenario(id: string): boolean {
    return this.scenarios.delete(id);
  }

  runScenario(scenarioId: string, baselineData: any): ScenarioResult {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const {
      demand_growth = 5,
      supply_disruption = 10,
      seasonal_variation = 1.2,
      wastage_reduction = 0,
      budget_constraint = 1.0
    } = scenario.parameters;

    // Simulate scenario calculations
    const baseConsumption = baselineData?.annualConsumption || 1000;
    const baseWastage = baselineData?.annualWastage || 50;
    const baseStockOuts = baselineData?.annualStockOuts || 5;

    // Apply scenario parameters
    const demandMultiplier = 1 + (demand_growth / 100);
    const supplyRisk = supply_disruption / 100;
    const wastageMultiplier = 1 - (wastage_reduction / 100);

    const projectedConsumption = Math.round(
      baseConsumption * demandMultiplier * seasonal_variation * budget_constraint
    );
    
    const projectedWastage = Math.round(
      baseWastage * wastageMultiplier * (1 + supplyRisk * 0.5)
    );
    
    const projectedStockOuts = Math.round(
      baseStockOuts * (1 + supplyRisk) * (1 / budget_constraint)
    );

    const budgetImpact = projectedConsumption * 10; // Assuming $10 per unit
    const confidence = Math.max(50, 95 - (Math.abs(demand_growth) + supply_disruption) / 2);

    // Generate monthly projections
    const monthlyProjections = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i).toLocaleString('default', { month: 'long' });
      const seasonalFactor = 1 + 0.2 * Math.sin((i / 12) * 2 * Math.PI); // Simple seasonal pattern
      
      return {
        month,
        consumption: Math.round(projectedConsumption / 12 * seasonalFactor),
        wastage: Math.round(projectedWastage / 12 * seasonalFactor),
        stockLevel: Math.round(projectedConsumption / 12 * seasonalFactor * 1.5), // 1.5x buffer
      };
    });

    // Generate risk factors and recommendations
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    if (supply_disruption > 20) {
      riskFactors.push('High supply chain disruption risk');
      recommendations.push('Increase safety stock levels');
      recommendations.push('Diversify supplier base');
    }

    if (demand_growth > 20) {
      riskFactors.push('Rapid demand growth may strain capacity');
      recommendations.push('Scale up procurement planning');
    }

    if (budget_constraint < 1.0) {
      riskFactors.push('Budget constraints may limit procurement flexibility');
      recommendations.push('Prioritize high-VEN classification products');
    }

    return {
      scenarioId,
      projectedConsumption,
      projectedWastage,
      projectedStockOuts,
      budgetImpact,
      confidence,
      details: {
        monthlyProjections,
        riskFactors,
        recommendations,
      },
    };
  }

  compareScenarios(scenarioIds: string[], baselineData: any): Array<ScenarioResult & { scenario: Scenario }> {
    return scenarioIds.map(id => {
      const scenario = this.scenarios.get(id);
      if (!scenario) {
        throw new Error(`Scenario ${id} not found`);
      }
      
      const result = this.runScenario(id, baselineData);
      return { ...result, scenario };
    });
  }
}

export const scenarioPlanningEngine = new ScenarioPlanningEngine();

import { z } from 'zod';

// Water quality parameter schema
export const WaterQualityParamsSchema = z.object({
  ph: z.number().min(0).max(14),
  hardness: z.number().min(0).max(1000),
  tds: z.number().min(0).max(2000),
  turbidity: z.number().min(0).max(100),
  alkalinity: z.number().min(0).max(500),
  nitrate: z.number().min(0).max(200),
  fluoride: z.number().min(0).max(10),
  chloride: z.number().min(0).max(1000),
  conductivity: z.number().min(0).max(5000),
  temperature: z.number().min(0).max(50),
});

export type WaterQualityParams = z.infer<typeof WaterQualityParamsSchema>;

// BIS/WHO Standard values for water quality parameters
const STANDARDS = {
  ph: { min: 6.5, max: 8.5, ideal: 7.0, weight: 0.15 },
  hardness: { max: 300, ideal: 100, weight: 0.10 },
  tds: { max: 500, ideal: 200, weight: 0.10 },
  turbidity: { max: 5, ideal: 1, weight: 0.15 },
  alkalinity: { max: 200, ideal: 100, weight: 0.08 },
  nitrate: { max: 45, ideal: 10, weight: 0.15 },
  fluoride: { max: 1.5, ideal: 0.7, weight: 0.12 },
  chloride: { max: 250, ideal: 100, weight: 0.08 },
  conductivity: { max: 1500, ideal: 500, weight: 0.07 },
};

// Calculate sub-index for a parameter (0-100 scale)
function calculateSubIndex(value: number, standard: typeof STANDARDS[keyof typeof STANDARDS]): number {
  if ('min' in standard && 'max' in standard) {
    // For pH (has both min and max)
    const { min, max, ideal } = standard;
    if (value >= min && value <= max) {
      // Within acceptable range
      const deviation = Math.abs(value - ideal);
      const maxDeviation = Math.max(ideal - min, max - ideal);
      return Math.max(0, 100 - (deviation / maxDeviation) * 30);
    } else {
      // Outside acceptable range
      const excess = value < min ? min - value : value - max;
      return Math.max(0, 100 - excess * 10);
    }
  } else {
    // For other parameters (only max limit)
    const { max, ideal } = standard;
    if (value <= max) {
      // Within acceptable range
      return Math.max(0, 100 - ((value - ideal) / max) * 50);
    } else {
      // Exceeds limit
      const excess = value - max;
      return Math.max(0, 100 - excess * 2);
    }
  }
}

// Calculate Water Quality Index (WQI)
export function calculateWQI(params: WaterQualityParams): {
  wqi: number;
  label: 'Good' | 'Moderate' | 'Poor';
  confidence: number;
  warnings: string[];
  parameterContributions: Array<{ parameter: string; contribution: number; impact: 'positive' | 'negative' }>;
} {
  const warnings: string[] = [];
  const parameterContributions: Array<{ parameter: string; contribution: number; impact: 'positive' | 'negative' }> = [];
  
  // Calculate sub-indices
  const subIndices = {
    ph: calculateSubIndex(params.ph, STANDARDS.ph),
    hardness: calculateSubIndex(params.hardness, STANDARDS.hardness),
    tds: calculateSubIndex(params.tds, STANDARDS.tds),
    turbidity: calculateSubIndex(params.turbidity, STANDARDS.turbidity),
    alkalinity: calculateSubIndex(params.alkalinity, STANDARDS.alkalinity),
    nitrate: calculateSubIndex(params.nitrate, STANDARDS.nitrate),
    fluoride: calculateSubIndex(params.fluoride, STANDARDS.fluoride),
    chloride: calculateSubIndex(params.chloride, STANDARDS.chloride),
    conductivity: calculateSubIndex(params.conductivity, STANDARDS.conductivity),
  };

  // Calculate weighted WQI
  let wqi = 0;
  let totalWeight = 0;

  for (const [param, subIndex] of Object.entries(subIndices)) {
    const weight = STANDARDS[param as keyof typeof STANDARDS].weight;
    wqi += subIndex * weight;
    totalWeight += weight;
  }

  wqi = wqi / totalWeight;
  wqi = Math.round(wqi * 100) / 100; // Round to 2 decimal places

  // Determine label
  let label: 'Good' | 'Moderate' | 'Poor';
  if (wqi >= 80) {
    label = 'Good';
  } else if (wqi >= 60) {
    label = 'Moderate';
  } else {
    label = 'Poor';
  }

  // Calculate confidence based on parameter completeness
  const validParams = Object.values(params).filter(v => v !== null && v !== undefined && !isNaN(v)).length;
  const totalParams = Object.keys(params).length;
  const confidence = Math.round((validParams / totalParams) * 100);

  // Generate warnings
  if (params.ph < 6.5) warnings.push('pH is too acidic (below 6.5)');
  if (params.ph > 8.5) warnings.push('pH is too alkaline (above 8.5)');
  if (params.hardness > 300) warnings.push('Hardness exceeds safe limit (300 mg/L)');
  if (params.tds > 500) warnings.push('TDS exceeds safe limit (500 mg/L)');
  if (params.turbidity > 5) warnings.push('Turbidity exceeds safe limit (5 NTU)');
  if (params.nitrate > 45) warnings.push('Nitrate exceeds safe limit (45 mg/L) - unsafe for infants');
  if (params.fluoride > 1.5) warnings.push('Fluoride exceeds safe limit (1.5 mg/L)');
  if (params.chloride > 250) warnings.push('Chloride exceeds safe limit (250 mg/L)');
  if (params.conductivity > 1500) warnings.push('Conductivity indicates high ion content');

  // Calculate parameter contributions
  for (const [param, value] of Object.entries(params)) {
    const standard = STANDARDS[param as keyof typeof STANDARDS];
    const subIndex = subIndices[param as keyof typeof subIndices];
    const contribution = Math.round((1 - subIndex / 100) * 100);
    
    parameterContributions.push({
      parameter: param.charAt(0).toUpperCase() + param.slice(1),
      contribution,
      impact: subIndex >= 70 ? 'positive' : subIndex >= 40 ? 'negative' : 'negative'
    });
  }

  parameterContributions.sort((a, b) => b.contribution - a.contribution);

  return {
    wqi,
    label,
    confidence,
    warnings,
    parameterContributions: parameterContributions.slice(0, 5) // Top 5 contributors
  };
}

// Generate tips and suggestions for poor water quality
export function generateWaterTips(params: WaterQualityParams, wqiResult: ReturnType<typeof calculateWQI>): Array<{
  title: string;
  body: string;
  severity: 'advice' | 'warning';
  linkedParams: string[];
}> {
  const tips = [];

  // General tips for poor water quality
  if (wqiResult.label === 'Poor') {
    tips.push({
      title: 'Immediate Safety Precautions',
      body: 'Avoid direct consumption until treated or re-tested. Use certified RO/UV systems for drinking water.',
      severity: 'warning' as const,
      linkedParams: []
    });

    tips.push({
      title: 'Treatment Options',
      body: 'Consider boiling only for microbial concerns; it does not remove chemicals like nitrates/fluoride. Retest after treatment.',
      severity: 'advice' as const,
      linkedParams: []
    });
  }

  // Parameter-specific tips
  if (params.ph < 6.5) {
    tips.push({
      title: 'Acidic Water Treatment',
      body: 'Water is acidic. Dose lime/soda ash to raise pH; check for pipe corrosion. Target pH: 7.0-8.5.',
      severity: 'warning' as const,
      linkedParams: ['ph']
    });
  }

  if (params.ph > 8.5) {
    tips.push({
      title: 'Alkaline Water Treatment',
      body: 'Water is alkaline. Consider mild acid dosing or carbon filtration. Target pH: 6.5-8.5.',
      severity: 'warning' as const,
      linkedParams: ['ph']
    });
  }

  if (params.hardness > 300) {
    tips.push({
      title: 'Hard Water Solutions',
      body: 'Install ion-exchange softener or RO system; descale appliances regularly. Consider water softening for bathing.',
      severity: 'advice' as const,
      linkedParams: ['hardness']
    });
  }

  if (params.turbidity > 5) {
    tips.push({
      title: 'Turbidity Reduction',
      body: 'Use sediment/multimedia/sand filtration; allow settling time. Check source disturbance and erosion.',
      severity: 'warning' as const,
      linkedParams: ['turbidity']
    });
  }

  if (params.tds > 500) {
    tips.push({
      title: 'High TDS Management',
      body: 'Prefer RO for drinking; blend with better source if feasible. Check for saltwater intrusion or industrial discharge.',
      severity: 'advice' as const,
      linkedParams: ['tds', 'conductivity']
    });
  }

  if (params.nitrate > 45) {
    tips.push({
      title: 'Nitrate Contamination Alert',
      body: 'Avoid for infants and pregnant women. Use nitrate removal (anion exchange/RO). Investigate agricultural runoff.',
      severity: 'warning' as const,
      linkedParams: ['nitrate']
    });
  }

  if (params.fluoride > 1.5) {
    tips.push({
      title: 'Excess Fluoride Treatment',
      body: 'Use defluoridation (Nalgonda/RO/activated alumina). Inform community about dental and skeletal risks.',
      severity: 'warning' as const,
      linkedParams: ['fluoride']
    });
  }

  if (params.chloride > 250) {
    tips.push({
      title: 'High Chloride Levels',
      body: 'Use RO/distillation; check for saline intrusion or industrial discharge. Can affect taste and corrosion.',
      severity: 'advice' as const,
      linkedParams: ['chloride']
    });
  }

  if (params.conductivity > 1500) {
    tips.push({
      title: 'High Conductivity Investigation',
      body: 'Indicates high dissolved ions. Survey for industrial discharge, seawater ingress, or natural mineral deposits.',
      severity: 'advice' as const,
      linkedParams: ['conductivity', 'tds']
    });
  }

  if (params.temperature > 35) {
    tips.push({
      title: 'High Temperature Management',
      body: 'Cool/store before use. High temperature reduces dissolved oxygen and can promote bacterial growth.',
      severity: 'advice' as const,
      linkedParams: ['temperature']
    });
  }

  return tips;
}
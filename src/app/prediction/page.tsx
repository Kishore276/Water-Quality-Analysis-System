'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  BarChart3,
  Lightbulb,
  Save,
  Calculator
} from 'lucide-react';
import { calculateWQI, generateWaterTips, WaterQualityParams } from '@/lib/water-quality';

export default function PredictionPage() {
  const [params, setParams] = useState<Partial<WaterQualityParams>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parameterInfo = {
    ph: { label: 'pH', unit: '', min: 0, max: 14, ideal: '7.0', description: 'Acidity/alkalinity balance' },
    hardness: { label: 'Hardness', unit: 'mg/L', min: 0, max: 1000, ideal: '100', description: 'Mineral content' },
    tds: { label: 'TDS', unit: 'mg/L', min: 0, max: 2000, ideal: '200', description: 'Total dissolved solids' },
    turbidity: { label: 'Turbidity', unit: 'NTU', min: 0, max: 100, ideal: '1', description: 'Water clarity' },
    alkalinity: { label: 'Alkalinity', unit: 'mg/L', min: 0, max: 500, ideal: '100', description: 'Buffer capacity' },
    nitrate: { label: 'Nitrate', unit: 'mg/L', min: 0, max: 200, ideal: '10', description: 'Nitrogen compounds' },
    fluoride: { label: 'Fluoride', unit: 'mg/L', min: 0, max: 10, ideal: '0.7', description: 'Fluorine content' },
    chloride: { label: 'Chloride', unit: 'mg/L', min: 0, max: 1000, ideal: '100', description: 'Salt content' },
    conductivity: { label: 'Conductivity', unit: 'µS/cm', min: 0, max: 5000, ideal: '500', description: 'Ion concentration' },
    temperature: { label: 'Temperature', unit: '°C', min: 0, max: 50, ideal: '25', description: 'Water temperature' }
  };

  const handleInputChange = (key: keyof WaterQualityParams, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setParams(prev => ({ ...prev, [key]: numValue }));
      setErrors(prev => ({ ...prev, [key]: '' }));
    } else if (value === '') {
      setParams(prev => ({ ...prev, [key]: undefined }));
      setErrors(prev => ({ ...prev, [key]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [key]: 'Invalid number' }));
    }
  };

  const validateParams = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasRequired = false;

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        hasRequired = true;
        const info = parameterInfo[key as keyof typeof parameterInfo];
        if (value < info.min || value > info.max) {
          newErrors[key] = `Must be between ${info.min} and ${info.max}`;
        }
      }
    }

    if (!hasRequired) {
      newErrors.general = 'Please enter at least one parameter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateParams()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const wqiResult = calculateWQI(params as WaterQualityParams);
      const tips = generateWaterTips(params as WaterQualityParams, wqiResult);
      
      setResult({
        ...wqiResult,
        tips,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setErrors({ general: 'Failed to calculate WQI. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getWQIColor = (wqi: number) => {
    if (wqi >= 80) return 'text-green-600';
    if (wqi >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getWQIBgColor = (wqi: number) => {
    if (wqi >= 80) return 'bg-green-50 border-green-200';
    if (wqi >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-amber-100 text-amber-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Water Quality Prediction</h1>
              <p className="text-gray-600 mt-1">Calculate Water Quality Index (WQI) from water parameters</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5" />
                  <span>Water Parameters</span>
                </CardTitle>
                <CardDescription>
                  Enter water quality measurements. At least one parameter is required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(parameterInfo).map(([key, info]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="flex items-center space-x-2">
                        <span>{info.label}</span>
                        <span className="text-gray-500 text-sm">({info.unit})</span>
                        <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center" title={info.description}>
                          <Info className="h-2 w-2 text-blue-600" />
                        </div>
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        step="any"
                        placeholder={`Ideal: ${info.ideal}`}
                        min={info.min}
                        max={info.max}
                        value={params[key as keyof WaterQualityParams] || ''}
                        onChange={(e) => handleInputChange(key as keyof WaterQualityParams, e.target.value)}
                        className={errors[key] ? 'border-red-500' : ''}
                      />
                      {errors[key] && (
                        <p className="text-sm text-red-500">{errors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handlePredict} 
                  disabled={loading || Object.keys(params).length === 0}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating WQI...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Water Quality Index
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* WQI Result Card */}
                <Card className={getWQIBgColor(result.wqi)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Water Quality Result</span>
                      </span>
                      <Badge className={getLabelColor(result.label)}>
                        {result.label}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-5xl font-bold ${getWQIColor(result.wqi)}`}>
                        {result.wqi.toFixed(1)}
                      </div>
                      <p className="text-gray-600 mt-2">Water Quality Index</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-semibold text-blue-600">
                          {result.confidence}%
                        </div>
                        <p className="text-sm text-gray-600">Confidence</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-semibold text-purple-600">
                          {Object.keys(params).length}
                        </div>
                        <p className="text-sm text-gray-600">Parameters</p>
                      </div>
                    </div>

                    {result.warnings.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-semibold mb-2">Warnings:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {result.warnings.map((warning: string, index: number) => (
                              <li key={index} className="text-sm">{warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Save Record
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Parameter Contributions */}
                {result.parameterContributions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Parameter Contributions</CardTitle>
                      <CardDescription>
                        Parameters affecting water quality the most
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.parameterContributions.map((param: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{param.parameter}</span>
                                <span className="text-sm text-gray-600">{param.contribution}%</span>
                              </div>
                              <Progress 
                                value={param.contribution} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tips & Suggestions */}
                {result.tips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>Tips & Suggestions</span>
                      </CardTitle>
                      <CardDescription>
                        Actionable recommendations for water quality improvement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="all">All Tips</TabsTrigger>
                          <TabsTrigger value="critical">Critical</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="space-y-4 mt-4">
                          {result.tips.map((tip: any, index: number) => (
                            <Alert key={index} className={tip.severity === 'warning' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
                              {tip.severity === 'warning' ? (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              )}
                              <AlertDescription>
                                <div className="font-semibold mb-1">{tip.title}</div>
                                <div className="text-sm">{tip.body}</div>
                                {tip.linkedParams.length > 0 && (
                                  <div className="mt-2">
                                    {tip.linkedParams.map((param: string, pIndex: number) => (
                                      <Badge key={pIndex} variant="outline" className="text-xs mr-1">
                                        {param}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </TabsContent>
                        <TabsContent value="critical" className="space-y-4 mt-4">
                          {result.tips.filter((tip: any) => tip.severity === 'warning').map((tip: any, index: number) => (
                            <Alert key={index} className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription>
                                <div className="font-semibold mb-1">{tip.title}</div>
                                <div className="text-sm">{tip.body}</div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <Droplets className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                  <p>Enter water parameters and click "Calculate WQI" to see results</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
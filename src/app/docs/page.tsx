'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Beaker, 
  Code, 
  Download, 
  FileText,
  Calculator,
  Droplets,
  AlertTriangle
} from 'lucide-react';

export default function DocsPage() {
  const wqiFormula = `
WQI = Σ (Wi × Si) / Σ Wi

Where:
- Wi = Weight of i-th parameter
- Si = Sub-index of i-th parameter (0-100)
- Sub-index Si = 100 - ((|Vi - Vi_ideal| / Vi_max) × 100)

Parameters and Weights:
- pH: 15% (Ideal: 7.0, Range: 6.5-8.5)
- Hardness: 10% (Max: 300 mg/L)
- TDS: 10% (Max: 500 mg/L)
- Turbidity: 15% (Max: 5 NTU)
- Alkalinity: 8% (Max: 200 mg/L)
- Nitrate: 15% (Max: 45 mg/L)
- Fluoride: 12% (Max: 1.5 mg/L)
- Chloride: 8% (Max: 250 mg/L)
- Conductivity: 7% (Max: 1500 µS/cm)
  `;

  const apiExamples = {
    curl: `curl -X POST https://waterspot.com/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "ph": 7.2,
    "hardness": 150,
    "tds": 200,
    "turbidity": 2.5,
    "alkalinity": 100,
    "nitrate": 15,
    "fluoride": 0.8,
    "chloride": 25,
    "conductivity": 500,
    "temperature": 22
  }'`,

    javascript: `const response = await fetch('/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ph: 7.2,
    hardness: 150,
    tds: 200,
    turbidity: 2.5,
    alkalinity: 100,
    nitrate: 15,
    fluoride: 0.8,
    chloride: 25,
    conductivity: 500,
    temperature: 22
  })
});

const result = await response.json();
console.log('WQI:', result.wqi);
console.log('Label:', result.label);`,

    python: `import requests

response = requests.post('https://waterspot.com/api/predict', json={
    "ph": 7.2,
    "hardness": 150,
    "tds": 200,
    "turbidity": 2.5,
    "alkalinity": 100,
    "nitrate": 15,
    "fluoride": 0.8,
    "chloride": 25,
    "conductivity": 500,
    "temperature": 22
})

result = response.json()
print(f"WQI: {result['wqi']}")
print(f"Label: {result['label']}")`
  };

  const parameterRanges = [
    { parameter: 'pH', range: '6.5-8.5', ideal: '7.0', unit: '', standard: 'BIS/WHO' },
    { parameter: 'Hardness', range: '0-300', ideal: '100', unit: 'mg/L', standard: 'BIS' },
    { parameter: 'TDS', range: '0-500', ideal: '200', unit: 'mg/L', standard: 'WHO' },
    { parameter: 'Turbidity', range: '0-5', ideal: '1', unit: 'NTU', standard: 'WHO' },
    { parameter: 'Alkalinity', range: '0-200', ideal: '100', unit: 'mg/L', standard: 'BIS' },
    { parameter: 'Nitrate', range: '0-45', ideal: '10', unit: 'mg/L', standard: 'WHO' },
    { parameter: 'Fluoride', range: '0-1.5', ideal: '0.7', unit: 'mg/L', standard: 'WHO' },
    { parameter: 'Chloride', range: '0-250', ideal: '100', unit: 'mg/L', standard: 'BIS' },
    { parameter: 'Conductivity', range: '0-1500', ideal: '500', unit: 'µS/cm', standard: 'WHO' },
    { parameter: 'Temperature', range: '0-35', ideal: '25', unit: '°C', standard: 'BIS' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-600 mt-1">Complete guide to WaterSpot features and API</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="wqi" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wqi">WQI Formula</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="wqi" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>WQI Calculation Formula</span>
                  </CardTitle>
                  <CardDescription>
                    Mathematical formula for Water Quality Index calculation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {wqiFormula}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>WQI Classification</CardTitle>
                  <CardDescription>
                    Water quality categories based on WQI values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-green-800">Good</h3>
                        <Badge className="bg-green-100 text-green-800">80-100</Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        Water is suitable for all purposes with minimal treatment required.
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-amber-800">Moderate</h3>
                        <Badge className="bg-amber-100 text-amber-800">60-79</Badge>
                      </div>
                      <p className="text-sm text-amber-700">
                        Water requires treatment before consumption. Suitable for other purposes with caution.
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-red-800">Poor</h3>
                        <Badge className="bg-red-100 text-red-800">0-59</Badge>
                      </div>
                      <p className="text-sm text-red-700">
                        Water is unsafe for consumption and requires immediate treatment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="standards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Beaker className="h-5 w-5" />
                  <span>Parameter Standards & Ranges</span>
                </CardTitle>
                <CardDescription>
                  BIS and WHO standards for water quality parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium">Parameter</th>
                        <th className="text-left p-3 font-medium">Acceptable Range</th>
                        <th className="text-left p-3 font-medium">Ideal Value</th>
                        <th className="text-left p-3 font-medium">Unit</th>
                        <th className="text-left p-3 font-medium">Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameterRanges.map((param, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{param.parameter}</td>
                          <td className="p-3">{param.range}</td>
                          <td className="p-3">{param.ideal}</td>
                          <td className="p-3">{param.unit}</td>
                          <td className="p-3">
                            <Badge variant="outline">{param.standard}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>API Endpoints</span>
                  </CardTitle>
                  <CardDescription>
                    RESTful API for water quality predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">POST /api/predict</h3>
                      <p className="text-gray-600 mb-4">
                        Calculate Water Quality Index from parameters
                      </p>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="text-sm font-mono mb-2">Request Body:</div>
                        <pre className="text-xs overflow-x-auto">
{`{
  "ph": 7.2,
  "hardness": 150,
  "tds": 200,
  "turbidity": 2.5,
  "alkalinity": 100,
  "nitrate": 15,
  "fluoride": 0.8,
  "chloride": 25,
  "conductivity": 500,
  "temperature": 22
}`}
                        </pre>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg mt-4">
                        <div className="text-sm font-mono mb-2">Response:</div>
                        <pre className="text-xs overflow-x-auto">
{`{
  "wqi": 75.5,
  "label": "Moderate",
  "confidence": 90,
  "warnings": ["TDS exceeds safe limit (500 mg/L)"],
  "parameterContributions": [
    {"parameter": "TDS", "contribution": 25, "impact": "negative"}
  ],
  "tips": [
    {
      "title": "High TDS Management",
      "body": "Prefer RO for drinking...",
      "severity": "advice",
      "linkedParams": ["tds"]
    }
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-6">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>
                    Sample code for integrating with the WaterSpot API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curl">
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {apiExamples.curl}
                      </pre>
                    </TabsContent>
                    <TabsContent value="javascript">
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {apiExamples.javascript}
                      </pre>
                    </TabsContent>
                    <TabsContent value="python">
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {apiExamples.python}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Sample Templates</span>
                  </CardTitle>
                  <CardDescription>
                    Download sample CSV templates for bulk uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-semibold">Basic Template</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Simple CSV template with required columns
                      </p>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Download CSV Template
                      </button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-semibold">Sample Data</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Template with sample water quality data
                      </p>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Download Sample Data
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Map, Upload, BarChart3, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">WaterSpot</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/prediction">
                <Button variant="ghost">Prediction</Button>
              </Link>
              <Link href="/analysis">
                <Button variant="ghost">Analysis</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/uploads">
                <Button>Bulk Upload</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Predict & Map Water Quality
            <span className="block text-blue-600">by Area</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced water quality analysis using WQI calculations. Get instant predictions, 
            upload bulk datasets, and visualize water quality patterns on interactive maps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prediction">
              <Button size="lg" className="text-lg px-8 py-6">
                <Droplets className="mr-2 h-5 w-5" />
                Single Prediction
              </Button>
            </Link>
            <Link href="/uploads">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Upload className="mr-2 h-5 w-5" />
                Bulk Upload
              </Button>
            </Link>
            <Link href="/analysis">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Map className="mr-2 h-5 w-5" />
                Area Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Water Quality Analysis
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Instant WQI Prediction</CardTitle>
                <CardDescription>
                  Calculate Water Quality Index in real-time using 10 key parameters 
                  with scientific accuracy and confidence scores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• pH, Hardness, TDS analysis</li>
                  <li>• Turbidity & Chemical parameters</li>
                  <li>• Actionable recommendations</li>
                  <li>• Parameter contribution insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Interactive Mapping</CardTitle>
                <CardDescription>
                  Visualize water quality patterns across geographic areas with 
                  heatmaps, filters, and temporal trend analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Color-coded WQI heatmaps</li>
                  <li>• Time-based trend analysis</li>
                  <li>• Parameter correlation studies</li>
                  <li>• Export capabilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Bulk Data Processing</CardTitle>
                <CardDescription>
                  Upload and process large datasets (50k+ rows) with streaming 
                  validation, error handling, and comprehensive reporting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• CSV & Excel file support</li>
                  <li>• Real-time validation</li>
                  <li>• Chunked processing</li>
                  <li>• Annotated downloads</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How WaterSpot Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Input Parameters</h3>
              <p className="text-sm text-gray-600">
                Enter water quality parameters or upload datasets with measurements
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">WQI Calculation</h3>
              <p className="text-sm text-gray-600">
                Advanced algorithms calculate Water Quality Index using BIS/WHO standards
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Analysis & Insights</h3>
              <p className="text-sm text-gray-600">
                Get detailed analysis, warnings, and actionable recommendations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Visualization</h3>
              <p className="text-sm text-gray-600">
                View results on maps, charts, and export comprehensive reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WQI Info */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Understanding Water Quality Index (WQI)</CardTitle>
              <CardDescription className="text-lg">
                WQI is a single value representing overall water quality based on multiple parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">80-100</div>
                  <div className="font-semibold text-green-800">Good</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Water is suitable for all purposes with minimal treatment
                  </div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600 mb-2">60-79</div>
                  <div className="font-semibold text-amber-800">Moderate</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Water requires treatment before consumption
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">0-59</div>
                  <div className="font-semibold text-red-800">Poor</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Water is unsafe and requires immediate treatment
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600">
                  WQI calculation considers pH, hardness, TDS, turbidity, alkalinity, nitrate, 
                  fluoride, chloride, conductivity, and temperature using weighted sub-indices 
                  based on BIS/WHO standards.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Droplets className="h-6 w-6" />
                <span className="text-xl font-bold">WaterSpot</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced water quality analysis and prediction platform for safer water management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>WQI Prediction</li>
                <li>Bulk Analysis</li>
                <li>Interactive Maps</li>
                <li>Parameter Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/docs#api" className="hover:text-white">API Reference</Link></li>
                <li><Link href="/docs#standards" className="hover:text-white">WQI Standards</Link></li>
                <li><Link href="/docs#examples" className="hover:text-white">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/prediction" className="hover:text-white">Single Prediction</Link></li>
                <li><Link href="/uploads" className="hover:text-white">Bulk Upload</Link></li>
                <li><Link href="/analysis" className="hover:text-white">Area Analysis</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 WaterSpot. Built with Next.js, TypeScript, and scientific accuracy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
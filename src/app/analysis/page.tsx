'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Map, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Calendar,
  Search
} from 'lucide-react';

// Mock data for demonstration
const mockData = [
  { id: 1, area: 'Downtown', latitude: 40.7128, longitude: -74.0060, wqi: 75, label: 'Moderate', date: '2024-01-15' },
  { id: 2, area: 'Riverside', latitude: 40.7580, longitude: -73.9855, wqi: 85, label: 'Good', date: '2024-01-16' },
  { id: 3, area: 'Industrial Zone', latitude: 40.7489, longitude: -73.9680, wqi: 45, label: 'Poor', date: '2024-01-17' },
  { id: 4, area: 'Suburbs', latitude: 40.7831, longitude: -73.9712, wqi: 92, label: 'Good', date: '2024-01-18' },
  { id: 5, area: 'Waterfront', latitude: 40.7061, longitude: -74.0087, wqi: 68, label: 'Moderate', date: '2024-01-19' },
];

export default function AnalysisPage() {
  const [data, setData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const [filters, setFilters] = useState({
    dateRange: ['2024-01-01', '2024-01-31'],
    areaSearch: '',
    parameter: 'all',
    wqiRange: [0, 100],
    label: 'all'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const applyFilters = () => {
    let filtered = [...data];

    // Filter by date range
    if (filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange[0]);
        const endDate = new Date(filters.dateRange[1]);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filter by area search
    if (filters.areaSearch) {
      filtered = filtered.filter(item => 
        item.area.toLowerCase().includes(filters.areaSearch.toLowerCase())
      );
    }

    // Filter by WQI range
    filtered = filtered.filter(item => 
      item.wqi >= filters.wqiRange[0] && item.wqi <= filters.wqiRange[1]
    );

    // Filter by label
    if (filters.label !== 'all') {
      filtered = filtered.filter(item => item.label === filters.label);
    }

    setFilteredData(filtered);
  };

  const getWQIColor = (wqi: number) => {
    if (wqi >= 80) return 'bg-green-500';
    if (wqi >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-amber-100 text-amber-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Area', 'Latitude', 'Longitude', 'WQI', 'Label', 'Date'],
      ...filteredData.map(item => [
        item.area,
        item.latitude,
        item.longitude,
        item.wqi,
        item.label,
        item.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water-quality-analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Map className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Water Quality Analysis</h1>
              <p className="text-gray-600 mt-1">Interactive map and trends analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range */}
                <div>
                  <Label className="text-sm font-medium">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="date"
                      value={filters.dateRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: [e.target.value, prev.dateRange[1]]
                      }))}
                    />
                    <Input
                      type="date"
                      value={filters.dateRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: [prev.dateRange[0], e.target.value]
                      }))}
                    />
                  </div>
                </div>

                {/* Area Search */}
                <div>
                  <Label className="text-sm font-medium">Search Area</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Enter area name..."
                      value={filters.areaSearch}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        areaSearch: e.target.value
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Parameter Filter */}
                <div>
                  <Label className="text-sm font-medium">Parameter</Label>
                  <Select value={filters.parameter} onValueChange={(value) => setFilters(prev => ({ ...prev, parameter: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parameters</SelectItem>
                      <SelectItem value="ph">pH</SelectItem>
                      <SelectItem value="hardness">Hardness</SelectItem>
                      <SelectItem value="tds">TDS</SelectItem>
                      <SelectItem value="turbidity">Turbidity</SelectItem>
                      <SelectItem value="nitrate">Nitrate</SelectItem>
                      <SelectItem value="fluoride">Fluoride</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* WQI Range */}
                <div>
                  <Label className="text-sm font-medium">WQI Range: {filters.wqiRange[0]} - {filters.wqiRange[1]}</Label>
                  <Slider
                    value={filters.wqiRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, wqiRange: value }))}
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Label Filter */}
                <div>
                  <Label className="text-sm font-medium">Quality Label</Label>
                  <Select value={filters.label} onValueChange={(value) => setFilters(prev => ({ ...prev, label: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Labels</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={exportData} className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Water Quality Map</CardTitle>
                    <CardDescription>
                      Geographic visualization of water quality by area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for Map */}
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">Interactive map will be displayed here</p>
                        <p className="text-sm text-gray-500">
                          {filteredData.length} locations found
                        </p>
                      </div>
                    </div>
                    
                    {/* Map Legend */}
                    <div className="mt-4 flex items-center justify-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm">Good (80-100)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-amber-500 rounded"></div>
                        <span className="text-sm">Moderate (60-79)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm">Poor (0-59)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>WQI Trends Over Time</span>
                    </CardTitle>
                    <CardDescription>
                      Water quality changes across different areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for Trends Chart */}
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Trend chart will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="correlations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Parameter Correlations</CardTitle>
                    <CardDescription>
                      Relationships between different water quality parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for Correlation Chart */}
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Correlation matrix will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Data Summary */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Filtered Results</CardTitle>
                <CardDescription>
                  {filteredData.length} locations match your criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{item.area}</h3>
                        <Badge className={getLabelColor(item.label)}>
                          {item.label}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">{item.wqi}</div>
                      <div className="text-sm text-gray-600">
                        <div>Lat: {item.latitude.toFixed(4)}, Lng: {item.longitude.toFixed(4)}</div>
                        <div>Date: {item.date}</div>
                      </div>
                      <div className="mt-2">
                        <div className={`h-2 rounded-full ${getWQIColor(item.wqi)}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
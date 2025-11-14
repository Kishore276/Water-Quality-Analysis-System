'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  Users
} from 'lucide-react';

// Mock data for demonstration
const mockKPIs = {
  totalRecords: 1250,
  areasCovered: 45,
  avgWQI: 72.5,
  lastUpload: '2024-01-20T10:30:00Z',
  distribution: {
    Good: 625,
    Moderate: 450,
    Poor: 175
  }
};

const mockRecentUploads = [
  { id: 1, filename: 'water_data_jan.csv', status: 'completed', rowsTotal: 500, rowsOk: 485, rowsFailed: 15, createdAt: '2024-01-20T10:30:00Z' },
  { id: 2, filename: 'quality_test.xlsx', status: 'completed', rowsTotal: 200, rowsOk: 200, rowsFailed: 0, createdAt: '2024-01-19T15:45:00Z' },
  { id: 3, filename: 'bulk_data.csv', status: 'processing', rowsTotal: 1000, rowsOk: 0, rowsFailed: 0, createdAt: '2024-01-20T09:15:00Z' },
  { id: 4, filename: 'sample_upload.csv', status: 'failed', rowsTotal: 50, rowsOk: 0, rowsFailed: 50, createdAt: '2024-01-18T14:20:00Z' },
];

const mockTrendData = [
  { date: '2024-01-01', wqi: 75 },
  { date: '2024-01-05', wqi: 72 },
  { date: '2024-01-10', wqi: 78 },
  { date: '2024-01-15', wqi: 71 },
  { date: '2024-01-20', wqi: 73 },
];

const mockTopAreas = [
  { area: 'Downtown', wqi: 85, records: 45 },
  { area: 'Riverside', wqi: 82, records: 38 },
  { area: 'Suburbs', wqi: 78, records: 52 },
  { area: 'Industrial Zone', wqi: 45, records: 28 },
  { area: 'Waterfront', wqi: 68, records: 41 },
];

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState(mockKPIs);
  const [recentUploads, setRecentUploads] = useState(mockRecentUploads);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Activity className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getWQIColor = (wqi: number) => {
    if (wqi >= 80) return 'text-green-600';
    if (wqi >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Water quality analytics and insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalRecords.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Areas Covered</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.areasCovered}</div>
              <p className="text-xs text-muted-foreground">
                +3 new areas this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average WQI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getWQIColor(kpiData.avgWQI)}`}>
                {kpiData.avgWQI.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                +2.3 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Upload</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(kpiData.lastUpload).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(kpiData.lastUpload).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Water Quality Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Water Quality Distribution</CardTitle>
              <CardDescription>
                Overview of water quality classifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{kpiData.distribution.Good} records</span>
                    <span className="text-sm font-medium">
                      {((kpiData.distribution.Good / kpiData.totalRecords) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={(kpiData.distribution.Good / kpiData.totalRecords) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium">Moderate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{kpiData.distribution.Moderate} records</span>
                    <span className="text-sm font-medium">
                      {((kpiData.distribution.Moderate / kpiData.totalRecords) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={(kpiData.distribution.Moderate / kpiData.totalRecords) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Poor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{kpiData.distribution.Poor} records</span>
                    <span className="text-sm font-medium">
                      {((kpiData.distribution.Poor / kpiData.totalRecords) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={(kpiData.distribution.Poor / kpiData.totalRecords) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Good Areas</span>
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round((kpiData.distribution.Good / kpiData.totalRecords) * 100)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Need Attention</span>
                  <Badge className="bg-red-100 text-red-800">
                    {Math.round((kpiData.distribution.Poor / kpiData.totalRecords) * 100)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Quality</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    94%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    12
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">WQI Trends</TabsTrigger>
            <TabsTrigger value="areas">Top Areas</TabsTrigger>
            <TabsTrigger value="uploads">Recent Uploads</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>WQI Trends Over Time</CardTitle>
                <CardDescription>
                  Water quality index changes over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for trend chart */}
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Trend chart will be displayed here</p>
                    <div className="mt-4 flex justify-center space-x-8">
                      {mockTrendData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm text-gray-500">{item.date}</div>
                          <div className={`text-lg font-bold ${getWQIColor(item.wqi)}`}>{item.wqi}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="areas" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Areas</CardTitle>
                <CardDescription>
                  Areas ranked by water quality index
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{area.area}</h3>
                          <p className="text-sm text-gray-600">{area.records} records</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getWQIColor(area.wqi)}`}>
                          {area.wqi}
                        </div>
                        <Badge className={area.wqi >= 80 ? 'bg-green-100 text-green-800' : area.wqi >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                          {area.wqi >= 80 ? 'Good' : area.wqi >= 60 ? 'Moderate' : 'Poor'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>
                  Latest file uploads and their processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getStatusIcon(upload.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{upload.filename}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(upload.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(upload.status)}>
                          {upload.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {upload.rowsTotal} rows
                        </div>
                        {upload.status === 'completed' && (
                          <div className="text-sm text-green-600">
                            {upload.rowsOk} success
                          </div>
                        )}
                        {upload.rowsFailed > 0 && (
                          <div className="text-sm text-red-600">
                            {upload.rowsFailed} failed
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
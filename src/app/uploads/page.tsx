'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Loader2,
  Table,
  FileSpreadsheet
} from 'lucide-react';

interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

interface ParsedData {
  headers: string[];
  rows: any[];
  errors: Array<{ row: number; field: string; message: string }>;
}

export default function UploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const requiredColumns = [
    'area', 'latitude', 'longitude', 'date', 'ph', 'hardness', 
    'tds', 'turbidity', 'alkalinity', 'nitrate', 'fluoride', 
    'chloride', 'conductivity', 'temperature'
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
        setUploadProgress({ status: 'idle', progress: 0, message: '' });
        setParsedData(null);
      } else {
        setUploadProgress({
          status: 'error',
          progress: 0,
          message: 'Please upload a CSV or Excel file'
        });
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress({ status: 'idle', progress: 0, message: '' });
      setParsedData(null);
    }
  };

  const parseFile = async () => {
    if (!file) return;

    setUploadProgress({ status: 'uploading', progress: 0, message: 'Reading file...' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate file parsing progress
      for (let i = 0; i <= 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setUploadProgress(prev => ({ ...prev, progress: i }));
      }

      const response = await fetch('/api/uploads/parse', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to parse file');
      }

      const data = await response.json();
      
      // Simulate parsing progress
      for (let i = 30; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        setUploadProgress(prev => ({ ...prev, progress: i }));
      }

      setParsedData(data);
      setUploadProgress({
        status: 'completed',
        progress: 100,
        message: `Successfully parsed ${data.rows.length} rows`
      });
    } catch (error) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: 'Failed to parse file',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const processUpload = async () => {
    if (!parsedData) return;

    setUploadProgress({ status: 'processing', progress: 0, message: 'Processing data...' });

    try {
      const response = await fetch('/api/uploads/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      });

      if (!response.ok) {
        throw new Error('Failed to process data');
      }

      const result = await response.json();
      
      setUploadProgress({
        status: 'completed',
        progress: 100,
        message: `Processed ${result.processed} rows successfully`
      });
    } catch (error) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: 'Failed to process data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const downloadTemplate = () => {
    const csvContent = requiredColumns.join(',') + '\n' + 
      'Sample Area,40.7128,-74.0060,2024-01-01,7.2,150,200,2.5,100,15,0.8,25,500,22';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water-quality-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      case 'uploading': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'uploading': return <Loader2 className="h-4 w-4 animate-spin" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Upload className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Water Quality Upload</h1>
              <p className="text-gray-600 mt-1">Upload CSV or Excel files with water quality data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  <span>File Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload CSV or Excel files with water quality measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold mb-2">
                    {file ? file.name : 'Drop your file here or click to browse'}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Supports CSV and Excel files (.csv, .xlsx, .xls)
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Select File
                    </Button>
                  </label>
                </div>

                {/* File Actions */}
                {file && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="secondary">
                        {(file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={parseFile}
                        disabled={uploadProgress.status === 'uploading' || uploadProgress.status === 'processing'}
                      >
                        {uploadProgress.status === 'uploading' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Parsing...
                          </>
                        ) : (
                          'Parse File'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Progress */}
                {uploadProgress.status !== 'idle' && (
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(uploadProgress.status)}
                      <span className={`text-sm font-medium ${getStatusColor(uploadProgress.status)}`}>
                        {uploadProgress.message}
                      </span>
                    </div>
                    <Progress value={uploadProgress.progress} className="w-full" />
                    {uploadProgress.error && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{uploadProgress.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Preview */}
            {parsedData && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Table className="h-5 w-5" />
                      <span>Data Preview</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {parsedData.rows.length} rows
                      </Badge>
                      {parsedData.errors.length > 0 && (
                        <Badge variant="destructive">
                          {parsedData.errors.length} errors
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    First 50 rows of your data with validation results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList>
                      <TabsTrigger value="preview">Data Preview</TabsTrigger>
                      <TabsTrigger value="errors">Validation Errors</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview">
                      <ScrollArea className="h-96 border rounded-md">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              {parsedData.headers.map((header, index) => (
                                <th key={index} className="px-4 py-2 text-left font-medium">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.rows.slice(0, 50).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t">
                                {parsedData.headers.map((header, colIndex) => (
                                  <td key={colIndex} className="px-4 py-2">
                                    {row[header] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="errors">
                      {parsedData.errors.length > 0 ? (
                        <ScrollArea className="h-96">
                          <div className="space-y-2">
                            {parsedData.errors.map((error, index) => (
                              <Alert key={index} variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  Row {error.row + 1}, Column "{error.field}": {error.message}
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                          <p>No validation errors found</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                    <Button 
                      onClick={processUpload}
                      disabled={uploadProgress.status === 'processing' || parsedData.errors.length > 0}
                    >
                      {uploadProgress.status === 'processing' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Process Data'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Requirements Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Required Columns</CardTitle>
                <CardDescription>
                  Your file must contain these columns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {requiredColumns.map((column) => (
                    <div key={column} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-mono">{column}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Column names should match exactly. 
                    Date format should be YYYY-MM-DD.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>File Format Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">CSV Files:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Comma-separated values</li>
                      <li>UTF-8 encoding</li>
                      <li>Header row required</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Excel Files:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>.xlsx or .xls format</li>
                      <li>First sheet used</li>
                      <li>Header row required</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data Limits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Max file size: 50MB</li>
                      <li>Max rows: 50,000</li>
                      <li>Processing in chunks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
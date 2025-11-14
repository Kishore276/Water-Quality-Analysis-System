import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let data: any[] = [];
    let headers: string[] = [];

    if (file.name.endsWith('.csv')) {
      // Parse CSV
      const text = buffer.toString('utf-8');
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return NextResponse.json(
          { error: 'Empty file' },
          { status: 400 }
        );
      }

      headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length === headers.length) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          data.push(row);
        }
      }
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Parse Excel
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        return NextResponse.json(
          { error: 'Empty file' },
          { status: 400 }
        );
      }

      headers = (jsonData[0] as string[]).map(h => String(h).trim());
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (row.length === headers.length) {
          const rowObj: any = {};
          headers.forEach((header, index) => {
            rowObj[header] = row[index];
          });
          data.push(rowObj);
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Validate required columns
    const requiredColumns = [
      'area', 'latitude', 'longitude', 'date', 'ph', 'hardness', 
      'tds', 'turbidity', 'alkalinity', 'nitrate', 'fluoride', 
      'chloride', 'conductivity', 'temperature'
    ];

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required columns', 
          missingColumns 
        },
        { status: 400 }
      );
    }

    // Validate data rows
    const errors: Array<{ row: number; field: string; message: string }> = [];
    
    data.forEach((row, index) => {
      // Check numeric fields
      const numericFields = [
        'latitude', 'longitude', 'ph', 'hardness', 'tds', 'turbidity', 
        'alkalinity', 'nitrate', 'fluoride', 'chloride', 'conductivity', 'temperature'
      ];

      numericFields.forEach(field => {
        const value = row[field];
        if (value !== undefined && value !== null && value !== '') {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            errors.push({
              row: index,
              field,
              message: 'Must be a valid number'
            });
          } else {
            // Validate ranges
            switch (field) {
              case 'latitude':
                if (numValue < -90 || numValue > 90) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between -90 and 90'
                  });
                }
                break;
              case 'longitude':
                if (numValue < -180 || numValue > 180) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between -180 and 180'
                  });
                }
                break;
              case 'ph':
                if (numValue < 0 || numValue > 14) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 14'
                  });
                }
                break;
              case 'hardness':
                if (numValue < 0 || numValue > 1000) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 1000 mg/L'
                  });
                }
                break;
              case 'tds':
                if (numValue < 0 || numValue > 2000) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 2000 mg/L'
                  });
                }
                break;
              case 'turbidity':
                if (numValue < 0 || numValue > 100) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 100 NTU'
                  });
                }
                break;
              case 'alkalinity':
                if (numValue < 0 || numValue > 500) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 500 mg/L'
                  });
                }
                break;
              case 'nitrate':
                if (numValue < 0 || numValue > 200) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 200 mg/L'
                  });
                }
                break;
              case 'fluoride':
                if (numValue < 0 || numValue > 10) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 10 mg/L'
                  });
                }
                break;
              case 'chloride':
                if (numValue < 0 || numValue > 1000) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 1000 mg/L'
                  });
                }
                break;
              case 'conductivity':
                if (numValue < 0 || numValue > 5000) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 5000 µS/cm'
                  });
                }
                break;
              case 'temperature':
                if (numValue < 0 || numValue > 50) {
                  errors.push({
                    row: index,
                    field,
                    message: 'Must be between 0 and 50°C'
                  });
                }
                break;
            }
          }
        }
      });

      // Validate date
      if (row.date) {
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
          errors.push({
            row: index,
            field: 'date',
            message: 'Must be a valid date (YYYY-MM-DD)'
          });
        }
      }
    });

    return NextResponse.json({
      headers,
      rows: data,
      errors,
      totalRows: data.length,
      errorCount: errors.length
    });

  } catch (error) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    );
  }
}
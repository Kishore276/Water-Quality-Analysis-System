import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateWQI, generateWaterTips } from '@/lib/water-quality';

export async function POST(request: NextRequest) {
  try {
    const { rows, headers } = await request.json();
    
    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process rows in chunks
    const chunkSize = 100;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      
      for (const row of chunk) {
        try {
          // Extract area information
          const areaName = row.area;
          const latitude = parseFloat(row.latitude);
          const longitude = parseFloat(row.longitude);
          const date = new Date(row.date);

          // Find or create area
          let area = await db.area.findFirst({
            where: {
              name: areaName
            }
          });

          if (!area) {
            area = await db.area.create({
              data: {
                name: areaName,
                latitude: latitude || null,
                longitude: longitude || null
              }
            });
          }

          // Extract water quality parameters
          const params = {
            ph: parseFloat(row.ph) || undefined,
            hardness: parseFloat(row.hardness) || undefined,
            tds: parseFloat(row.tds) || undefined,
            turbidity: parseFloat(row.turbidity) || undefined,
            alkalinity: parseFloat(row.alkalinity) || undefined,
            nitrate: parseFloat(row.nitrate) || undefined,
            fluoride: parseFloat(row.fluoride) || undefined,
            chloride: parseFloat(row.chloride) || undefined,
            conductivity: parseFloat(row.conductivity) || undefined,
            temperature: parseFloat(row.temperature) || undefined,
          };

          // Calculate WQI if we have valid parameters
          let wqi = null;
          let label = null;
          let confidence = null;
          
          const validParams = Object.values(params).filter(v => v !== undefined && !isNaN(v));
          if (validParams.length > 0) {
            const wqiResult = calculateWQI(params as any);
            wqi = wqiResult.wqi;
            label = wqiResult.label;
            confidence = wqiResult.confidence;
          }

          // Create record
          await db.record.create({
            data: {
              areaId: area.id,
              date: date,
              ph: params.ph,
              hardness: params.hardness,
              tds: params.tds,
              turbidity: params.turbidity,
              alkalinity: params.alkalinity,
              nitrate: params.nitrate,
              fluoride: params.fluoride,
              chloride: params.chloride,
              conductivity: params.conductivity,
              temperature: params.temperature,
              wqi: wqi,
              label: label,
              confidence: confidence,
              source: 'bulk_upload'
            }
          });

          processed++;
        } catch (error) {
          failed++;
          errors.push(`Row ${i + chunk.indexOf(row) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return NextResponse.json({
      processed,
      failed,
      errors: errors.slice(0, 10), // Return first 10 errors
      totalRows: rows.length
    });

  } catch (error) {
    console.error('Data processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}
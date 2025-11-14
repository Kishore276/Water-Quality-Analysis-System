import { NextRequest, NextResponse } from 'next/server';
import { calculateWQI, generateWaterTips, WaterQualityParamsSchema } from '@/lib/water-quality';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedParams = WaterQualityParamsSchema.partial().parse(body);
    
    if (Object.keys(validatedParams).length === 0) {
      return NextResponse.json(
        { error: 'At least one parameter is required' },
        { status: 400 }
      );
    }

    // Calculate WQI
    const wqiResult = calculateWQI(validatedParams as any);
    
    // Generate tips
    const tips = generateWaterTips(validatedParams as any, wqiResult);
    
    // Return results
    const response = {
      ...wqiResult,
      tips,
      timestamp: new Date().toISOString(),
      parameters: validatedParams
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Prediction API error:', error);
    
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: 'Invalid parameters provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
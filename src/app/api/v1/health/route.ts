import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;

    // 1 = connected
    if (state === 1) {
      return NextResponse.json(
        {
          success: true,
          status: 'healthy',
          database: 'connected',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        database: `state:${state}`,
      },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database connection failed',
      },
      { status: 503 }
    );
  }
}

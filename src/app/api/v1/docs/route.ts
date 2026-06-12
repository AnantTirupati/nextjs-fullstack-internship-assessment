import { getSwaggerSpec } from '@/lib/swagger';
import { NextResponse } from 'next/server';

export async function GET() {
  const spec = getSwaggerSpec();

  // Return the Swagger spec as JSON
  return NextResponse.json(spec);
}

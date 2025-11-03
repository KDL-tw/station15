import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Check database connectivity
  return NextResponse.json({ status: 'ready' });
}


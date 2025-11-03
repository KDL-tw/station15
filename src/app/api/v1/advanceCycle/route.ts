import { NextRequest, NextResponse } from 'next/server';
import { AdvanceCycleRequest, AdvanceCycleResponse } from '@/lib/types';

const FEATURE_DEMO_SIM = process.env.FEATURE_DEMO_SIM === 'true';
const FEATURE_FAKE_AUTH = process.env.FEATURE_FAKE_AUTH === 'true';
const ENGINE_SHARED_SECRET = process.env.ENGINE_SHARED_SECRET || 'local-dev-secret-key-12345';

export async function POST(request: NextRequest) {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    if (!FEATURE_FAKE_AUTH || !authHeader?.includes(ENGINE_SHARED_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AdvanceCycleRequest = await request.json();
    
    // Check if demo simulation is enabled
    if (!FEATURE_DEMO_SIM) {
      return NextResponse.json(
        { error: 'Cycle advancement only available in demo mode' },
        { status: 403 }
      );
    }

    const days = body.days || 30;

    const response: AdvanceCycleResponse = {
      success: true,
      simulatedDays: days,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { UpdateRulesRequest, UpdateRulesResponse } from '@/lib/types';

const FEATURE_FAKE_AUTH = process.env.FEATURE_FAKE_AUTH === 'true';
const ENGINE_SHARED_SECRET = process.env.ENGINE_SHARED_SECRET || 'local-dev-secret-key-12345';

export async function POST(request: NextRequest) {
  try {
    // Simple auth check (admin only)
    const authHeader = request.headers.get('authorization');
    if (!FEATURE_FAKE_AUTH || !authHeader?.includes(ENGINE_SHARED_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateRulesRequest = await request.json();

    // Mock rules update response
    const response: UpdateRulesResponse = {
      rulesConfig: {
        id: `rules-${Date.now()}`,
        version: 1,
        rules: body.rules,
        effectiveAt: body.effectiveAt || new Date().toISOString(),
        createdBy: 'admin-user',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


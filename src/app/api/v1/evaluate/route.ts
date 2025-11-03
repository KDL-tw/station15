import { NextRequest, NextResponse } from 'next/server';
import { EvaluateRequest, EvaluateResponse } from '@/lib/types';

// Feature flags
const FEATURE_FAKE_AUTH = process.env.FEATURE_FAKE_AUTH === 'true';
const ENGINE_SHARED_SECRET = process.env.ENGINE_SHARED_SECRET || 'local-dev-secret-key-12345';

export async function POST(request: NextRequest) {
  try {
    // Simple auth check (demo mode)
    const authHeader = request.headers.get('authorization');
    if (!FEATURE_FAKE_AUTH || !authHeader?.includes(ENGINE_SHARED_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: EvaluateRequest = await request.json();
    
    // Check idempotency (simplified - would use database in production)
    const idempotencyKey = request.headers.get('idempotency-key');
    
    // Mock decision response
    const response: EvaluateResponse = {
      decision: {
        id: `decision-${Date.now()}`,
        decisionType: 'underwrite',
        limit: 50000,
        term: 30,
        reason: 'Standard underwriting evaluation',
        reasonCodes: ['charge_card_limit_calculated', 'flex_eligible'],
        aprBand: 'standard',
        decision: {
          approved: true,
          charge_limit: 50000,
          flex_eligible: true,
          flex_limit: 25000,
        },
        createdAt: new Date().toISOString(),
      },
      ruleEvents: [
        {
          id: `event-${Date.now()}`,
          ruleId: 'charge_card_limit_v0',
          ruleName: 'Phase Card Limit Calculation',
          trigger: { avg_balance_30d: 12500 },
          triggerDetail: { avg_balance_30d: 12500 },
          outcome: 'calculated',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


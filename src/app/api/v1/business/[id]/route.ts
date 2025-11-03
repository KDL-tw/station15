import { NextRequest, NextResponse } from 'next/server';
import { BusinessMetrics } from '@/lib/types';

const FEATURE_FAKE_AUTH = process.env.FEATURE_FAKE_AUTH === 'true';
const ENGINE_SHARED_SECRET = process.env.ENGINE_SHARED_SECRET || 'local-dev-secret-key-12345';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    if (!FEATURE_FAKE_AUTH || !authHeader?.includes(ENGINE_SHARED_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: businessId } = await params;

    // Mock business metrics response
    const response: BusinessMetrics = {
      business: {
        id: businessId,
        name: 'Demo Business Corp',
        balance: 12500,
        recurringPct: 68.5,
        volatility: 12.3,
        chargeLimit: 50000,
        currentBalance: 12500,
        flexState: { riskLevel: 'low', lastReview: '2024-01-15' },
        cycleCount: 4,
        onTimeRate: 0.96,
        liquidity: 1.2,
      },
      recentTransactions: [
        {
          id: '1',
          amount: -2500,
          type: 'outflow',
          description: 'Office supplies',
          date: '2024-01-10',
          transactionDate: '2024-01-10',
        },
        {
          id: '2',
          amount: 15000,
          type: 'recurring',
          description: 'Recurring revenue',
          date: '2024-01-08',
          transactionDate: '2024-01-08',
        },
      ],
      upcomingInvoices: [
        {
          id: '1',
          customerId: 'customer-1',
          amount: 3500,
          dueDate: '2024-01-25',
          paid: false,
        },
      ],
      lastDecision: {
        id: 'decision-1',
        decisionType: 'underwrite',
        limit: 50000,
        term: 30,
        reason: 'Standard underwriting evaluation',
        reasonCodes: ['charge_card_limit_calculated'],
        aprBand: 'standard',
        decision: { approved: true },
        createdAt: '2024-01-10T10:00:00Z',
      },
      utilizationPercentage: 25,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


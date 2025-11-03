// Data fetching abstraction layer
// Switch between mock and real API easily

import { BusinessMetrics } from './types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // Default to true

export async function fetchBusinessMetrics(businessId: string): Promise<BusinessMetrics> {
  if (USE_MOCK_DATA) {
    // Mock data - return immediately
    return {
      business: {
        id: businessId,
        name: 'ABC Corp',
        balance: 12500,
        recurringPct: 68.5,
        volatility: 12.3,
        chargeLimit: 50000,
        currentBalance: 12500,
        flexState: { riskLevel: 'low', lastReview: '2024-01-15' },
        cycleCount: 12,
        onTimeRate: 0.96,
        liquidity: 1.2,
        sector: 'Technology',
      },
      recentTransactions: [
        { id: '1', amount: -2500, type: 'outflow', description: 'Office supplies', date: '2024-01-10', transactionDate: '2024-01-10' },
        { id: '2', amount: 15000, type: 'recurring', description: 'Recurring revenue', date: '2024-01-08', transactionDate: '2024-01-08' },
        { id: '3', amount: -5000, type: 'outflow', description: 'Equipment purchase', date: '2024-01-05', transactionDate: '2024-01-05' },
        { id: '4', amount: 12000, type: 'recurring', description: 'Monthly subscription', date: '2024-01-01', transactionDate: '2024-01-01' },
      ],
      upcomingInvoices: [
        { id: '1', customerId: 'customer-1', amount: 3500, dueDate: '2024-01-25', paid: false },
        { id: '2', customerId: 'customer-2', amount: 2800, dueDate: '2024-01-28', paid: false },
      ],
      utilizationPercentage: 25,
    };
  }

  // Real API call - when Supabase is connected
  const response = await fetch(`/api/v1/business/${businessId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY || ''}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch business metrics');
  }
  
  return response.json();
}

export async function fetchCreditHistory(businessId: string): Promise<any[]> {
  if (USE_MOCK_DATA) {
    // Mock historical data for charts
    const days = 90;
    const history = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      history.push({
        date: date.toISOString().split('T')[0],
        balance: 10000 + Math.random() * 10000,
        recurringRevenue: 12000 + Math.random() * 3000,
        onTimePayments: 0.90 + Math.random() * 0.1,
        liquidity: 1.0 + Math.random() * 0.5,
        cycleNumber: Math.floor(i / 30) + 1,
      });
    }
    
    return history;
  }

  // Real API call - when Supabase is connected
  const response = await fetch(`/api/v1/business/${businessId}/history`);
  return response.json();
}

export async function fetchTransactions(businessId: string, limit: number = 50): Promise<any[]> {
  if (USE_MOCK_DATA) {
    // Mock transactions - generate more detailed data
    const transactions = [];
    const today = new Date();
    const types = ['inflow', 'outflow', 'recurring', 'one_time'];
    const descriptions = {
      inflow: ['Payment received', 'Client payment', 'Invoice paid', 'Revenue deposit'],
      outflow: ['Vendor payment', 'Office supplies', 'Equipment purchase', 'Service fee'],
      recurring: ['Monthly subscription', 'Recurring revenue', 'Retainer payment', 'Subscription revenue'],
      one_time: ['One-time payment', 'Special project', 'Bonus payment'],
    };

    for (let i = 0; i < limit; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      
      const type = types[Math.floor(Math.random() * types.length)];
      const typeDescriptions = descriptions[type as keyof typeof descriptions] || descriptions.outflow;
      const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
      
      let amount;
      if (type === 'inflow' || type === 'recurring') {
        amount = Math.random() * 20000 + 5000;
      } else {
        amount = -(Math.random() * 15000 + 1000);
      }

      transactions.push({
        id: `tx-${i}`,
        amount: Math.round(amount * 100) / 100,
        type,
        description,
        date: date.toISOString().split('T')[0],
        transactionDate: date.toISOString().split('T')[0],
      });
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Real API call - when Supabase is connected
  const response = await fetch(`/api/v1/transactions/${businessId}?limit=${limit}`);
  return response.json();
}


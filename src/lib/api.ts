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


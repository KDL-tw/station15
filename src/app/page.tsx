'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { BusinessMetrics } from "@/lib/types";
import Image from "next/image";

// PRD Brand Colors: Indigo #312E81 / Crimson #DC143C
const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  indigoLight: '#5B57A3',
  indigoLighter: '#E8E7F0',
  crimsonLight: '#FF4569',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch business metrics from Next.js API routes
    // For now using mock data (API routes are available at /api/v1/business/:id)
    const mockMetrics: BusinessMetrics = {
      business: {
        id: "demo-business-1",
        name: "Demo Business Corp",
        balance: 12500,
        recurringPct: 68.5,
        volatility: 12.3,
        chargeLimit: 50000,
        currentBalance: 12500,
        flexState: { riskLevel: "low", lastReview: "2024-01-15" }
      },
      recentTransactions: [
        { id: "1", amount: -2500, type: "outflow", description: "Office supplies", date: "2024-01-10", transactionDate: "2024-01-10" },
        { id: "2", amount: 15000, type: "recurring", description: "Recurring revenue", date: "2024-01-08", transactionDate: "2024-01-08" },
      ],
      upcomingInvoices: [
        { id: "1", customerId: "customer-1", amount: 3500, dueDate: "2024-01-25", paid: false },
      ],
      utilizationPercentage: 25,
    };
    // Use setTimeout to ensure state update happens
    setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 100);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.gray50 }}>
        <div className="text-lg font-medium" style={{ color: COLORS.indigo }}>Loading...</div>
      </div>
    );
  }

  if (!metrics) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.gray50 }}>No data available</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Header - Enhanced with better spacing */}
      <header className="bg-white border-b" style={{ borderColor: COLORS.gray200, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: COLORS.indigo }}>Station 15</h1>
                <span className="text-sm font-medium" style={{ color: COLORS.gray500 }}>Keep Moving</span>
              </div>
            </div>
            <nav className="flex items-center space-x-1">
              <Link 
                href="/checking" 
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50" 
                style={{ color: COLORS.gray700 }}
              >
                Checking
              </Link>
              <Link 
                href="/charge-card" 
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50" 
                style={{ color: COLORS.gray700 }}
              >
                Charge Card
              </Link>
              <Link 
                href="/flex" 
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50" 
                style={{ color: COLORS.gray700 }}
              >
                Flex
              </Link>
              <Link 
                href="/admin" 
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ml-2"
                style={{ 
                  color: '#FFFFFF',
                  backgroundColor: COLORS.crimson,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.crimsonLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.crimson;
                }}
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced Dashboard */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Business Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: COLORS.gray900 }}>
            {metrics.business.name}
          </h2>
          <p className="text-base" style={{ color: COLORS.gray600 }}>
            Dashboard – Aggregate balances, cash-flow line, quick actions
          </p>
        </div>

        {/* Key Metrics Cards - Enhanced with better spacing and visual hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Balance Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md" style={{ borderColor: COLORS.gray200 }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <dt className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Current Balance</dt>
                <span className="text-xl" style={{ color: COLORS.indigo }}>→</span>
              </div>
              <dd className="text-3xl font-bold tracking-tight mb-1" style={{ color: COLORS.indigo }}>
                ${metrics.business.currentBalance.toLocaleString()}
              </dd>
              <p className="text-xs" style={{ color: COLORS.gray500 }}>Available now</p>
            </div>
          </div>

          {/* Charge Limit Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md" style={{ borderColor: COLORS.gray200 }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <dt className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Charge Limit</dt>
                <span className="text-xl" style={{ color: COLORS.indigo }}>→</span>
              </div>
              <dd className="text-3xl font-bold tracking-tight mb-1" style={{ color: COLORS.indigo }}>
                ${metrics.business.chargeLimit.toLocaleString()}
              </dd>
              <p className="text-xs" style={{ color: COLORS.gray500 }}>Entry product (20% avg balance)</p>
            </div>
          </div>

          {/* Utilization Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md" style={{ borderColor: COLORS.gray200 }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <dt className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Utilization</dt>
                <span className="text-xl" style={{ color: COLORS.crimson }}>→</span>
              </div>
              <dd className="text-3xl font-bold tracking-tight mb-1" style={{ color: COLORS.crimson }}>
                {metrics.utilizationPercentage}%
              </dd>
              <p className="text-xs" style={{ color: COLORS.gray500 }}>Current usage</p>
            </div>
          </div>
        </div>

        {/* Cash Flow & Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cash Flow Visualization */}
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                Cash Flow
              </h3>
              <span className="text-sm" style={{ color: COLORS.gray500 }}>See more →</span>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg" style={{ borderColor: COLORS.gray300, backgroundColor: COLORS.gray50 }}>
              <div className="text-center">
                <p className="text-sm font-medium mb-1" style={{ color: COLORS.gray600 }}>Cash flow visualization</p>
                <p className="text-xs" style={{ color: COLORS.gray400 }}>Recharts integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Link 
                href="/charge-card" 
                className="block p-4 rounded-lg border transition-all hover:shadow-sm group"
                style={{ 
                  borderColor: COLORS.gray200,
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.indigo;
                  e.currentTarget.style.backgroundColor = COLORS.indigoLighter;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gray200;
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base" style={{ color: COLORS.gray900 }}>Charge Card</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1" style={{ color: COLORS.indigo }}>→</span>
                </div>
                <span className="text-sm" style={{ color: COLORS.gray600 }}>Entry product (20% avg balance)</span>
              </Link>
              <Link 
                href="/flex" 
                className="block p-4 rounded-lg border transition-all hover:shadow-sm group"
                style={{ 
                  borderColor: COLORS.gray200,
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.indigo;
                  e.currentTarget.style.backgroundColor = COLORS.indigoLighter;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gray200;
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base" style={{ color: COLORS.gray900 }}>Flex Loan / AP Mgmt</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1" style={{ color: COLORS.indigo }}>→</span>
                </div>
                <span className="text-sm" style={{ color: COLORS.gray600 }}>Net-term slider → Days Gained</span>
              </Link>
              <Link 
                href="/transfers" 
                className="block p-4 rounded-lg border transition-all hover:shadow-sm group"
                style={{ 
                  borderColor: COLORS.gray200,
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.indigo;
                  e.currentTarget.style.backgroundColor = COLORS.indigoLighter;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gray200;
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base" style={{ color: COLORS.gray900 }}>Transfers / Sweeps</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1" style={{ color: COLORS.indigo }}>→</span>
                </div>
                <span className="text-sm" style={{ color: COLORS.gray600 }}>Visualize internal flows</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.gray200 }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Recent Transactions</h3>
                <span className="text-sm cursor-pointer hover:underline" style={{ color: COLORS.indigo }}>View all →</span>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: COLORS.gray200 }}>
              {metrics.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1" style={{ color: COLORS.gray900 }}>{transaction.description}</p>
                    <p className="text-xs" style={{ color: COLORS.gray500 }}>{transaction.transactionDate}</p>
                  </div>
                  <span className={`text-sm font-semibold ${
                    transaction.amount > 0 ? '' : ''
                  }`}
                  style={{ 
                    color: transaction.amount > 0 ? '#10B981' : COLORS.gray900 
                  }}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Invoices */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.gray200 }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Upcoming Invoices</h3>
                <span className="text-sm cursor-pointer hover:underline" style={{ color: COLORS.indigo }}>View all →</span>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: COLORS.gray200 }}>
              {metrics.upcomingInvoices.map((invoice) => (
                <div key={invoice.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1" style={{ color: COLORS.gray900 }}>Invoice #{invoice.id}</p>
                    <p className="text-xs" style={{ color: COLORS.gray500 }}>Due: {invoice.dueDate}</p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: COLORS.gray900 }}>
                    ${invoice.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

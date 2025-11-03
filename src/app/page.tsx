'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { BusinessMetrics } from "@/lib/types";

// PRD Brand Colors: Indigo #312E81 / Crimson #DC143C
const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <div className="text-lg" style={{ color: COLORS.indigo }}>Loading...</div>
      </div>
    );
  }

  if (!metrics) {
    return <div className="min-h-screen flex items-center justify-center">No data available</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header - Branded */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: `${COLORS.indigo}20` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold" style={{ color: COLORS.indigo }}>Station 15</h1>
              <span className="text-xs font-medium text-gray-500">Keep Moving</span>
            </div>
            <nav className="flex space-x-4">
              <Link href="/checking" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.indigo }}>
                Checking
              </Link>
              <Link href="/charge-card" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.indigo }}>
                Charge Card
              </Link>
              <Link href="/flex" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.indigo }}>
                Flex
              </Link>
              <Link href="/admin" className="px-3 py-2 text-sm font-medium hover:opacity-80" style={{ color: COLORS.crimson }}>
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Dashboard */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Business Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-2" style={{ color: COLORS.indigo }}>
              {metrics.business.name}
            </h2>
            <p className="text-gray-600">Dashboard – Aggregate balances, cash-flow line, quick actions</p>
          </div>

          {/* Aggregate Balances - Clean Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Current Balance Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
                  <span className="text-lg">→</span>
                </div>
                <dd className="text-2xl font-semibold" style={{ color: COLORS.indigo }}>
                  ${metrics.business.currentBalance.toLocaleString()}
                </dd>
              </div>
            </div>

            {/* Charge Limit Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <dt className="text-sm font-medium text-gray-500">Charge Limit</dt>
                  <span className="text-lg">→</span>
                </div>
                <dd className="text-2xl font-semibold" style={{ color: COLORS.indigo }}>
                  ${metrics.business.chargeLimit.toLocaleString()}
                </dd>
              </div>
            </div>

            {/* Utilization Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <dt className="text-sm font-medium text-gray-500">Utilization</dt>
                  <span className="text-lg">→</span>
                </div>
                <dd className="text-2xl font-semibold" style={{ color: COLORS.crimson }}>
                  {metrics.utilizationPercentage}%
                </dd>
              </div>
            </div>
          </div>

          {/* Cash Flow Line - Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cash Flow Visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium mb-4" style={{ color: COLORS.indigo }}>
                Cash Flow
              </h3>
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                <p className="text-gray-400">Cash flow line chart (Recharts integration)</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium mb-4" style={{ color: COLORS.indigo }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/charge-card" 
                  className="block p-3 rounded border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Charge Card</span>
                    <span className="text-lg">→</span>
                  </div>
                  <span className="text-sm text-gray-500">Entry product (20% avg balance)</span>
                </Link>
                <Link 
                  href="/flex" 
                  className="block p-3 rounded border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Flex Loan / AP Mgmt</span>
                    <span className="text-lg">→</span>
                  </div>
                  <span className="text-sm text-gray-500">Net-term slider → Days Gained</span>
                </Link>
                <Link 
                  href="/transfers" 
                  className="block p-3 rounded border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Transfers / Sweeps</span>
                    <span className="text-lg">→</span>
                  </div>
                  <span className="text-sm text-gray-500">Visualize internal flows</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium" style={{ color: COLORS.indigo }}>Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {metrics.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.transactionDate}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium" style={{ color: COLORS.indigo }}>Upcoming Invoices</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {metrics.upcomingInvoices.map((invoice) => (
                  <div key={invoice.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Invoice #{invoice.id}</p>
                      <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
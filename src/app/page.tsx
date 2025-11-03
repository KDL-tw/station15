'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BusinessMetrics } from "@/lib/types";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import UtilizationCircle from "@/components/UtilizationCircle";
import { getUtilizationColor } from "@/components/UtilizationCircle";
import CreditLimitTooltip from "@/components/CreditLimitTooltip";

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
  const { sidebarWidth } = useSidebar();

  useEffect(() => {
    // Fetch business metrics from Next.js API routes
    // For now using mock data (API routes are available at /api/v1/business/:id)
    const mockMetrics: BusinessMetrics = {
      business: {
        id: "demo-business-1",
        name: "ABC Corp",
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
    setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 100);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: '256px' }} >
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg font-medium" style={{ color: COLORS.indigo }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: '256px' }}>
          <div className="flex items-center justify-center h-screen">
            <div>No data available</div>
          </div>
        </div>
      </div>
    );
  }

  const availableCredit = metrics.business.chargeLimit - metrics.business.currentBalance;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        {/* Header with S15 Icon */}
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/s15-icon.png"
                alt="Station 15"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Home</h1>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Business Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: COLORS.gray900 }}>
              {metrics.business.name}
            </h2>
          </div>

          {/* Key Metrics - Three columns + Utilization */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Current Balance */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="text-sm font-medium mb-2" style={{ color: COLORS.gray600 }}>Current Balance</div>
              <div className="text-3xl font-bold tracking-tight" style={{ color: COLORS.indigo }}>
                ${metrics.business.currentBalance.toLocaleString()}
              </div>
            </div>

            {/* Credit Limit */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="text-sm font-medium mb-2 flex items-center" style={{ color: COLORS.gray600 }}>
                Credit Limit
                <CreditLimitTooltip />
              </div>
              <div className="text-3xl font-bold tracking-tight" style={{ color: COLORS.indigo }}>
                ${metrics.business.chargeLimit.toLocaleString()}
              </div>
            </div>

            {/* Available Credit */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="text-sm font-medium mb-2" style={{ color: COLORS.gray600 }}>Available Credit</div>
              <div className="text-3xl font-bold tracking-tight" style={{ color: COLORS.indigo }}>
                ${availableCredit.toLocaleString()}
              </div>
            </div>

            {/* Utilization */}
            <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col items-center justify-center" style={{ borderColor: COLORS.gray200 }}>
              <UtilizationCircle percentage={metrics.utilizationPercentage} />
              <div className="mt-3 text-sm font-medium" style={{ color: getUtilizationColor(metrics.utilizationPercentage) }}>
                {metrics.utilizationPercentage}% utilized
              </div>
            </div>
          </div>

          {/* Credit Profile & Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Credit Profile Card */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Your Credit Profile</h3>
                <span className="text-sm cursor-pointer hover:underline" style={{ color: COLORS.indigo }}>See details →</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">✓</span>
                  <div>
                    <div className="font-medium" style={{ color: COLORS.gray900 }}>Payment timing: <span style={{ color: COLORS.indigo }}>Excellent</span></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">✓</span>
                  <div>
                    <div className="font-medium" style={{ color: COLORS.gray900 }}>Revenue consistency: <span style={{ color: COLORS.indigo }}>Strong</span></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">○</span>
                  <div>
                    <div className="font-medium" style={{ color: COLORS.gray900 }}>Account age: <span style={{ color: COLORS.gray600 }}>Building (Day 12)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/charge-card"
                  className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm group"
                  style={{ 
                    borderColor: COLORS.gray200,
                    backgroundColor: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.indigo;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.gray200;
                  }}
                >
                  <span className="font-medium" style={{ color: COLORS.gray900 }}>Make a payment</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1" style={{ color: COLORS.crimson }}>→</span>
                </Link>
                <Link 
                  href="/charge-card"
                  className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm group"
                  style={{ 
                    borderColor: COLORS.gray200,
                    backgroundColor: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.indigo;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.gray200;
                  }}
                >
                  <span className="font-medium" style={{ color: COLORS.gray900 }}>Request credit increase</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1" style={{ color: COLORS.crimson }}>→</span>
                </Link>
                <Link 
                  href="/flex"
                  className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm group"
                  style={{ 
                    borderColor: COLORS.gray200,
                    backgroundColor: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.indigo;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.gray200;
                  }}
                >
                  <span className="font-medium" style={{ color: COLORS.gray900 }}>Apply for Flex Loan</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1" style={{ color: COLORS.crimson }}>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.gray200 }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 }}>
              <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Recent Transactions</h3>
              <span className="text-sm cursor-pointer hover:underline" style={{ color: COLORS.indigo }}>View all →</span>
            </div>
            <div className="divide-y" style={{ borderColor: COLORS.gray200 }}>
              {metrics.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1" style={{ color: COLORS.gray900 }}>{transaction.description}</div>
                    <div className="text-xs" style={{ color: COLORS.gray500 }}>{transaction.transactionDate}</div>
                  </div>
                  <span 
                    className="text-sm font-semibold"
                    style={{ 
                      color: transaction.amount > 0 ? '#10B981' : COLORS.gray900 
                    }}
                  >
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer with Disclosure */}
        <footer className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6 border-t" style={{ borderColor: COLORS.gray200 }}>
          <Link 
            href="#" 
            className="text-sm hover:underline"
            style={{ color: COLORS.gray600 }}
            onClick={(e) => {
              e.preventDefault();
              // TODO: Open disclosure modal
              alert('Understanding Your Credit\n\nStarting Limit\nYour initial credit limit is 20% of your average account balance over the past 30 days.\n\nHow Limits Increase\nAfter 90 days, limits can exceed your balance based on:\n- Payment timing and consistency\n- Recurring revenue patterns\n- Account stability\n\nWe review your limit every 15 days and adjust automatically.');
            }}
          >
            How credit limits work
          </Link>
        </footer>
      </div>
    </div>
  );
}

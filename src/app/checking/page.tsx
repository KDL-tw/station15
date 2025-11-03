'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import { fetchBusinessMetrics, fetchTransactions } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { 
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = {
  indigo: '#312E81',
  crimson: '#DC143C',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

// Heatmap data preparation
function prepareHeatmapData(transactions: Transaction[]) {
  // Group transactions by date
  const dateMap = new Map<string, { inflows: number; outflows: number; count: number }>();
  
  transactions.forEach((tx) => {
    const date = tx.date;
    if (!dateMap.has(date)) {
      dateMap.set(date, { inflows: 0, outflows: 0, count: 0 });
    }
    
    const dayData = dateMap.get(date)!;
    dayData.count += 1;
    
    if (tx.amount > 0) {
      dayData.inflows += tx.amount;
    } else {
      dayData.outflows += Math.abs(tx.amount);
    }
  });

  // Convert to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      ...data,
      net: data.inflows - data.outflows,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getHeatmapColor(value: number, max: number): string {
  if (value === 0) return COLORS.gray200;
  const intensity = Math.abs(value) / max;
  if (value > 0) {
    // Green for inflows
    const opacity = Math.min(intensity * 0.8 + 0.2, 1);
    return `rgba(16, 185, 129, ${opacity})`;
  } else {
    // Red for outflows
    const opacity = Math.min(intensity * 0.8 + 0.2, 1);
    return `rgba(239, 68, 68, ${opacity})`;
  }
}

export default function CheckingPage() {
  const { sidebarWidth } = useSidebar();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashflow, setCashflow] = useState<{ inflow: number; outflow: number; net: number }>({
    inflow: 0,
    outflow: 0,
    net: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, transactionsData] = await Promise.all([
          fetchBusinessMetrics('demo-business-1'),
          fetchTransactions('demo-business-1', 50),
        ]);
        
        setBalance(metricsData.business.currentBalance);
        setTransactions(transactionsData);

        // Calculate cashflow (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTx = transactionsData.filter(
          (tx) => new Date(tx.date) >= thirtyDaysAgo
        );

        const inflow = recentTx
          .filter((tx) => tx.amount > 0)
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        const outflow = recentTx
          .filter((tx) => tx.amount < 0)
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        setCashflow({
          inflow,
          outflow,
          net: inflow - outflow,
        });
      } catch (error) {
        console.error('Failed to load checking data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTestTransaction = () => {
    // Placeholder - will connect to API later
    alert('Test transaction feature - coming soon!\n\nThis will add a test withdrawal or deposit that applies to all relevant areas.');
  };

  const heatmapData = prepareHeatmapData(transactions);
  const maxValue = Math.max(...heatmapData.map((d) => Math.max(Math.abs(d.inflows), Math.abs(d.outflows))));

  // Group transactions by date for display
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const date = tx.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg font-medium" style={{ color: COLORS.indigo }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        {/* Header */}
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/s15-icon.png"
                  alt="Station 15"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Checking</h1>
              </div>
              <button
                onClick={handleAddTestTransaction}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: COLORS.green,
                  color: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.green;
                }}
              >
                Add Test Transaction
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Balance and Cashflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Current Balance</h2>
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: COLORS.indigo }}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm" style={{ color: COLORS.gray500 }}>
                Available now
              </div>
            </div>

            {/* Cashflow Card */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Cashflow (30 Days)</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: COLORS.gray600 }}>Inflow</span>
                  <span className="text-lg font-semibold" style={{ color: COLORS.green }}>
                    ${cashflow.inflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: COLORS.gray600 }}>Outflow</span>
                  <span className="text-lg font-semibold" style={{ color: COLORS.red }}>
                    -${cashflow.outflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t pt-3" style={{ borderColor: COLORS.gray200 }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: COLORS.gray900 }}>Net</span>
                    <span
                      className="text-xl font-bold"
                      style={{
                        color: cashflow.net >= 0 ? COLORS.green : COLORS.red,
                      }}
                    >
                      {cashflow.net >= 0 ? '+' : ''}${cashflow.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Heatmap */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8" style={{ borderColor: COLORS.gray200 }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>
              Transaction Activity Heatmap
            </h2>
            <div className="mb-4">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.gray200 }} />
                  <span style={{ color: COLORS.gray600 }}>No activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.6)' }} />
                  <span style={{ color: COLORS.gray600 }}>Inflow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }} />
                  <span style={{ color: COLORS.gray600 }}>Outflow</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {heatmapData.map((day, index) => {
                  const value = day.inflows > day.outflows ? day.inflows : -day.outflows;
                  const color = getHeatmapColor(value, maxValue);
                  
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                      title={`${day.date}: ${day.count} transactions`}
                    >
                      <div
                        className="w-8 h-8 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs" style={{ color: COLORS.gray500 }}>
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transaction Feed */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.gray200 }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 }}>
              <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Recent Transactions</h2>
              <span className="text-sm" style={{ color: COLORS.gray500 }}>
                {transactions.length} transactions
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: COLORS.gray200 }}>
              {sortedDates.length === 0 ? (
                <div className="px-6 py-8 text-center" style={{ color: COLORS.gray500 }}>
                  No transactions found
                </div>
              ) : (
                sortedDates.map((date) => (
                  <div key={date}>
                    <div className="px-6 py-2" style={{ backgroundColor: COLORS.gray50 }}>
                      <span className="text-sm font-medium" style={{ color: COLORS.gray700 }}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    {groupedTransactions[date].map((transaction) => (
                      <div
                        key={transaction.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: transaction.amount > 0 ? COLORS.green : COLORS.red,
                              }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1" style={{ color: COLORS.gray900 }}>
                                {transaction.description || `${transaction.type} transaction`}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className="text-xs px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: COLORS.gray100,
                                    color: COLORS.gray600,
                                  }}
                                >
                                  {transaction.type}
                                </span>
                                <span className="text-xs" style={{ color: COLORS.gray500 }}>
                                  {new Date(transaction.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-sm font-semibold ml-4"
                          style={{
                            color: transaction.amount > 0 ? COLORS.green : COLORS.gray900,
                          }}
                        >
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

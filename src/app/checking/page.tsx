'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import { fetchBusinessMetrics, fetchTransactions } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { getCheckingAccounts, saveCheckingAccounts, CheckingAccount } from "@/lib/checkingAccounts";
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

interface AccountCard {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  type: 'checking' | 'savings' | 'envelope';
}

export default function CheckingPage() {
  const { sidebarWidth } = useSidebar();
  const [accounts, setAccounts] = useState<AccountCard[]>([]);
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
        // Load checking accounts from localStorage
        const checkingAccounts = getCheckingAccounts();
        const [metricsData, transactionsData] = await Promise.all([
          fetchBusinessMetrics('demo-business-1'),
          fetchTransactions('demo-business-1', 50),
        ]);
        
        // Convert checking accounts to AccountCard format and update balance from metrics
        const accountCards: AccountCard[] = checkingAccounts.map((acc) => ({
          id: acc.id,
          name: acc.name,
          balance: acc.id === '1' ? metricsData.business.currentBalance : acc.balance,
          accountNumber: `****${acc.accountNumber}`,
          type: acc.type,
        }));
        
        setAccounts(accountCards);
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

        // Save updated accounts back to localStorage (with updated balance)
        const updatedAccounts: CheckingAccount[] = checkingAccounts.map((acc) => ({
          ...acc,
          balance: acc.id === '1' ? metricsData.business.currentBalance : acc.balance,
        }));
        saveCheckingAccounts(updatedAccounts);

        // Notify sidebar of change
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('checkingAccountsChanged'));
        }
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
          {/* Account Cards Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: COLORS.gray900 }}>Account Cards</h2>
              <div className="flex space-x-3">
                <Link
                  href="/checking/virtual-cards"
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                  style={{
                    backgroundColor: COLORS.indigo,
                    color: '#FFFFFF',
                  }}
                >
                  Make New Virtual Card
                </Link>
                <Link
                  href="/checking/envelope-accounts"
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                  style={{
                    backgroundColor: COLORS.indigo,
                    color: '#FFFFFF',
                  }}
                >
                  Make New Account
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow"
                  style={{ borderColor: COLORS.gray200 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                      {account.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded capitalize"
                      style={{
                        backgroundColor: COLORS.gray100,
                        color: COLORS.gray700,
                      }}
                    >
                      {account.type}
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: COLORS.indigo }}>
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm mb-1" style={{ color: COLORS.gray500 }}>
                    Account: {account.accountNumber}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.gray500 }}>
                    Available now
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cashflow Card */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8" style={{ borderColor: COLORS.gray200 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Cashflow (30 Days)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm mb-2" style={{ color: COLORS.gray600 }}>Inflow</div>
                <div className="text-2xl font-bold" style={{ color: COLORS.green }}>
                  ${cashflow.inflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-sm mb-2" style={{ color: COLORS.gray600 }}>Outflow</div>
                <div className="text-2xl font-bold" style={{ color: COLORS.red }}>
                  -${cashflow.outflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-sm mb-2" style={{ color: COLORS.gray600 }}>Net</div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: cashflow.net >= 0 ? COLORS.green : COLORS.red,
                  }}
                >
                  {cashflow.net >= 0 ? '+' : ''}${cashflow.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

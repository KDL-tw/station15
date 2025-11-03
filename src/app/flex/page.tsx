'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import { fetchTransactions } from "@/lib/api";
import { Transaction } from "@/lib/types";

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
};

export default function FlexPage() {
  const { sidebarWidth } = useSidebar();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [authorizedAmount, setAuthorizedAmount] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [calculationDetails, setCalculationDetails] = useState({
    avgDeposits30d: 0,
    avgWithdrawals15d: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch enough transactions to cover 30 days
        const txData = await fetchTransactions('demo-business-1', 100);
        setTransactions(txData);

        // Calculate authorized amount
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        // Get deposits from last 30 days
        const deposits30d = txData.filter((tx: Transaction) => {
          const txDate = new Date(tx.date);
          return txDate >= thirtyDaysAgo && tx.amount > 0;
        });

        // Get withdrawals from last 15 days
        const withdrawals15d = txData.filter((tx: Transaction) => {
          const txDate = new Date(tx.date);
          return txDate >= fifteenDaysAgo && tx.amount < 0;
        });

        // Calculate averages
        const totalDeposits30d = deposits30d.reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
        const avgDeposits30d = deposits30d.length > 0 ? totalDeposits30d / deposits30d.length : 0;

        const totalWithdrawals15d = withdrawals15d.reduce((sum: number, tx: Transaction) => sum + Math.abs(tx.amount), 0);
        const avgWithdrawals15d = withdrawals15d.length > 0 ? totalWithdrawals15d / withdrawals15d.length : 0;

        // Calculate authorized amount: (avg deposits 30d - avg withdrawals 15d) / 3
        const authorized = Math.max(0, (avgDeposits30d - avgWithdrawals15d) / 3);

        setAuthorizedAmount(Math.round(authorized * 100) / 100);
        setSelectedAmount(Math.round(authorized * 100) / 100); // Default to max authorized
        setCalculationDetails({
          avgDeposits30d: Math.round(avgDeposits30d * 100) / 100,
          avgWithdrawals15d: Math.round(avgWithdrawals15d * 100) / 100,
        });
      } catch (error) {
        console.error('Failed to load flex data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSelectedAmount(value);
  };

  // Calculate loan details
  const loanTerm = 30; // Default 30 days
  const estimatedApr = 12.5; // Example APR
  const dailyRate = estimatedApr / 365 / 100;
  const interestAmount = selectedAmount * dailyRate * loanTerm;
  const totalRepayment = selectedAmount + interestAmount;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Flex Loan / AP Mgmt</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg font-medium" style={{ color: COLORS.indigo }}>Loading...</div>
            </div>
          ) : (
            <>
              {/* Authorized Amount Display */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-8" style={{ borderColor: COLORS.gray200 }}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray900 }}>
                    Authorized Loan Amount
                  </h2>
                  <div className="text-4xl font-bold mb-2" style={{ color: COLORS.indigo }}>
                    ${authorizedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm" style={{ color: COLORS.gray600 }}>
                    Based on: (30-day avg deposits - 15-day avg withdrawals) ÷ 3
                  </p>
                </div>
                
                {/* Calculation Breakdown */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: COLORS.gray200 }}>
                  <div>
                    <div className="text-xs mb-1" style={{ color: COLORS.gray500 }}>30-Day Avg Deposits</div>
                    <div className="text-lg font-semibold" style={{ color: COLORS.green }}>
                      ${calculationDetails.avgDeposits30d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: COLORS.gray500 }}>15-Day Avg Withdrawals</div>
                    <div className="text-lg font-semibold" style={{ color: COLORS.crimson }}>
                      ${calculationDetails.avgWithdrawals15d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Selector Slider */}
              <div className="bg-white rounded-xl border shadow-sm p-6 mb-8" style={{ borderColor: COLORS.gray200 }}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                      Select Loan Amount
                    </h2>
                    <div className="text-3xl font-bold" style={{ color: COLORS.indigo }}>
                      ${selectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={authorizedAmount}
                    step="100"
                    value={selectedAmount}
                    onChange={handleSliderChange}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${COLORS.indigo} 0%, ${COLORS.indigo} ${(selectedAmount / authorizedAmount) * 100}%, ${COLORS.gray200} ${(selectedAmount / authorizedAmount) * 100}%, ${COLORS.gray200} 100%)`,
                    }}
                  />
                  
                  <div className="flex justify-between text-xs mt-2" style={{ color: COLORS.gray600 }}>
                    <span>$0</span>
                    <span>${authorizedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[0.25, 0.5, 0.75, 1.0].map((multiplier) => {
                    const quickAmount = Math.round((authorizedAmount * multiplier) / 100) * 100;
                    return (
                      <button
                        key={multiplier}
                        onClick={() => setSelectedAmount(quickAmount)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedAmount === quickAmount ? 'text-white' : ''
                        }`}
                        style={{
                          backgroundColor: selectedAmount === quickAmount ? COLORS.indigo : COLORS.gray100,
                          color: selectedAmount === quickAmount ? '#FFFFFF' : COLORS.gray700,
                        }}
                      >
                        {multiplier * 100}%
                      </button>
                    );
                  })}
                </div>

                {/* Loan Terms & Repayment */}
                <div className="border-t pt-6" style={{ borderColor: COLORS.gray200 }}>
                  <h3 className="text-md font-semibold mb-4" style={{ color: COLORS.gray900 }}>
                    Loan Terms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm mb-2" style={{ color: COLORS.gray600 }}>Term</div>
                      <div className="text-xl font-semibold" style={{ color: COLORS.gray900 }}>
                        {loanTerm} days
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2" style={{ color: COLORS.gray600 }}>Estimated APR</div>
                      <div className="text-xl font-semibold" style={{ color: COLORS.gray900 }}>
                        {estimatedApr}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2" style={{ color: COLORS.gray600 }}>Total Repayment</div>
                      <div className="text-xl font-semibold" style={{ color: COLORS.indigo }}>
                        ${totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs mt-1" style={{ color: COLORS.gray500 }}>
                        (${selectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${interestAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} interest)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Status */}
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: authorizedAmount > 0 ? COLORS.green : COLORS.amber,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1" style={{ color: COLORS.gray900 }}>
                        Eligibility Status
                      </div>
                      <div className="text-sm" style={{ color: COLORS.gray600 }}>
                        {authorizedAmount > 0 ? (
                          <>
                            Eligible for Flex Loan. Based on current eligibility: (cycles≥3) AND (on_time≥0.95) AND (recurring≥0.65) AND (liquidity≥1.1)
                          </>
                        ) : (
                          <>
                            Currently not eligible. Increase your deposit average or reduce withdrawals to qualify.
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  disabled={selectedAmount === 0 || authorizedAmount === 0}
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{
                    backgroundColor: selectedAmount > 0 && authorizedAmount > 0 ? COLORS.indigo : COLORS.gray300,
                    color: '#FFFFFF',
                  }}
                >
                  Request Flex Loan
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

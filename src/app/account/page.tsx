'use client';

import Image from "next/image";
import { useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import BackButton from "@/components/BackButton";
import { getCheckingAccounts } from "@/lib/checkingAccounts";
import { getEnvelopeAccounts } from "@/lib/envelopeAccounts";

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

export default function AccountPage() {
  const { sidebarWidth } = useSidebar();
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'statements' | 'documents'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'accounts', name: 'Accounts' },
    { id: 'statements', name: 'Statements' },
    { id: 'documents', name: 'Documents' },
  ];

  // Load accounts data
  const checkingAccounts = typeof window !== 'undefined' ? getCheckingAccounts() : [];
  const envelopeAccounts = typeof window !== 'undefined' ? getEnvelopeAccounts() : [];

  const accountSummary = {
    totalBalance: checkingAccounts.reduce((sum, acc) => sum + acc.balance, 0),
    totalCreditLimit: 50000,
    availableCredit: 37500,
    activeAccounts: checkingAccounts.length + envelopeAccounts.length,
  };

  const recentStatements = [
    { id: '1', period: 'January 2024', amount: 12500, status: 'paid', date: '2024-02-01' },
    { id: '2', period: 'December 2023', amount: 11800, status: 'paid', date: '2024-01-01' },
    { id: '3', period: 'November 2023', amount: 10950, status: 'paid', date: '2023-12-01' },
  ];

  const documents = [
    { id: '1', name: 'Account Agreement', type: 'PDF', date: '2024-01-15', size: '245 KB' },
    { id: '2', name: 'Terms of Service', type: 'PDF', date: '2024-01-15', size: '189 KB' },
    { id: '3', name: 'Privacy Policy', type: 'PDF', date: '2024-01-15', size: '156 KB' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="mb-3">
              <BackButton customBackPath="/" customLabel="Home" />
            </div>
            <div className="flex items-center space-x-3">
              <Image
                src="/s15-icon.png"
                alt="Station 15"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Account</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 border" style={{ borderColor: COLORS.gray200 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? COLORS.indigo : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : COLORS.gray700,
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                  <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Total Balance</div>
                  <div className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>
                    ${accountSummary.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                  <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Credit Limit</div>
                  <div className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>
                    ${accountSummary.totalCreditLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                  <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Available Credit</div>
                  <div className="text-2xl font-bold" style={{ color: COLORS.green }}>
                    ${accountSummary.availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                  <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Active Accounts</div>
                  <div className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>
                    {accountSummary.activeAccounts}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.gray900 }}>Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.gray200 }}>
                    <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>Make Payment</div>
                    <div className="text-sm" style={{ color: COLORS.gray600 }}>Pay your balance</div>
                  </button>
                  <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.gray200 }}>
                    <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>Transfer Funds</div>
                    <div className="text-sm" style={{ color: COLORS.gray600 }}>Move money</div>
                  </button>
                  <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.gray200 }}>
                    <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>Request Increase</div>
                    <div className="text-sm" style={{ color: COLORS.gray600 }}>Credit limit</div>
                  </button>
                  <button className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.gray200 }}>
                    <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>View Statements</div>
                    <div className="text-sm" style={{ color: COLORS.gray600 }}>Billing history</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Your Accounts</h2>
              <div className="space-y-4">
                {/* Checking Accounts */}
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.gray700 }}>Checking Accounts</h3>
                  <div className="space-y-3">
                    {checkingAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                        style={{ borderColor: COLORS.gray200 }}
                      >
                        <div>
                          <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>{account.name}</div>
                          <div className="text-sm" style={{ color: COLORS.gray600 }}>
                            Account: ****{account.accountNumber} • Balance: ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                          style={{
                            borderColor: COLORS.indigo,
                            color: COLORS.indigo,
                            backgroundColor: 'transparent',
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Envelope Accounts */}
                {envelopeAccounts.length > 0 && (
                  <div className="mt-6 pt-6 border-t" style={{ borderColor: COLORS.gray200 }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.gray700 }}>Envelope Accounts</h3>
                    <div className="space-y-3">
                      {envelopeAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                          style={{ borderColor: COLORS.gray200 }}
                        >
                          <div>
                            <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>{account.name}</div>
                            <div className="text-sm" style={{ color: COLORS.gray600 }}>
                              Account: ****{account.accountNumber} • Balance: ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                            style={{
                              borderColor: COLORS.indigo,
                              color: COLORS.indigo,
                              backgroundColor: 'transparent',
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statements Tab */}
          {activeTab === 'statements' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Billing Statements</h2>
              <div className="space-y-3">
                {recentStatements.map((statement) => (
                  <div
                    key={statement.id}
                    className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                    style={{ borderColor: COLORS.gray200 }}
                  >
                    <div>
                      <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>{statement.period}</div>
                      <div className="text-sm" style={{ color: COLORS.gray600 }}>
                        Amount: ${statement.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • Due: {statement.date}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        statement.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {statement.status}
                      </span>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                        style={{
                          borderColor: COLORS.indigo,
                          color: COLORS.indigo,
                          backgroundColor: 'transparent',
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Account Documents</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                    style={{ borderColor: COLORS.gray200 }}
                  >
                    <div>
                      <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>{doc.name}</div>
                      <div className="text-sm" style={{ color: COLORS.gray600 }}>
                        {doc.type} • {doc.size} • {doc.date}
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{
                        borderColor: COLORS.indigo,
                        color: COLORS.indigo,
                        backgroundColor: 'transparent',
                      }}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


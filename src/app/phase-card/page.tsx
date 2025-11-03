'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
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
};

interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  addedDate: string;
}

interface PerkOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export default function PhaseCardPage() {
  const { sidebarWidth } = useSidebar();
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@abccorp.com',
      status: 'active',
      addedDate: '2024-01-05',
    },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  const cardDetails = {
    number: '4562 1234 5678 9010',
    name: 'ABC CORP',
    expiry: '12/26',
    cvv: '***',
    limit: 50000,
    availableCredit: 37500,
    currentBalance: 12500,
    paymentDue: 0,
    nextPaymentDate: '2024-02-01',
  };

  const perkOffers: PerkOffer[] = [
    {
      id: '1',
      title: 'Office Supplies Cashback',
      description: 'Earn 3% cashback on office supplies',
      category: 'Cashback',
      icon: '📦',
    },
    {
      id: '2',
      title: 'Business Travel Rewards',
      description: '5x points on business travel expenses',
      category: 'Travel',
      icon: '✈️',
    },
    {
      id: '3',
      title: 'Software Subscriptions',
      description: '2% cashback on SaaS subscriptions',
      category: 'Tech',
      icon: '💻',
    },
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txData = await fetchTransactions('demo-business-1', 20);
        setTransactions(txData.filter((tx: Transaction) => 
          tx.type === 'outflow' || tx.type === 'one_time'
        ));
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleAddAuthorizedUser = () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;

    const newUser: AuthorizedUser = {
      id: Date.now().toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      status: 'pending',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setAuthorizedUsers([...authorizedUsers, newUser]);
    setNewUserForm({ name: '', email: '' });
    setShowAddUser(false);
  };

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        {/* Header */}
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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>S15 Phase Card</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Card Display Section - AMEX Style */}
          <div className="mb-8">
            <div
              className="relative rounded-2xl p-8 text-white overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${COLORS.indigo} 0%, ${COLORS.crimson} 100%)`,
                minHeight: '220px',
              }}
            >
              {/* Card Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ backgroundColor: '#FFFFFF', transform: 'translate(50%, -50%)' }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ backgroundColor: '#FFFFFF', transform: 'translate(-50%, 50%)' }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm opacity-90 mb-1">S15 PHASE CARD</div>
                    <div className="text-lg font-semibold">{cardDetails.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90 mb-1">Available Credit</div>
                    <div className="text-2xl font-bold">${cardDetails.availableCredit.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xl font-mono tracking-wider mb-2">
                    {cardDetails.number.split(' ').map((segment, i) => (
                      <span key={i} className="mr-4">{segment}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{cardDetails.expiry}</span>
                    <span>{cardDetails.cvv}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="opacity-90">Credit Limit</div>
                    <div className="text-lg font-semibold">${cardDetails.limit.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="opacity-90">Current Balance</div>
                    <div className="text-lg font-semibold">${cardDetails.currentBalance.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Payment Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow text-left"
              style={{ borderColor: COLORS.gray200 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold" style={{ color: COLORS.gray900 }}>Make Payment</h3>
                <span className="text-xl">💳</span>
              </div>
              <p className="text-sm" style={{ color: COLORS.gray600 }}>
                Pay your current balance
              </p>
              {cardDetails.paymentDue > 0 && (
                <div className="mt-3 text-sm font-semibold" style={{ color: COLORS.crimson }}>
                  Due: ${cardDetails.paymentDue.toLocaleString()}
                </div>
              )}
            </button>

            <button
              className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow text-left"
              style={{ borderColor: COLORS.gray200 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold" style={{ color: COLORS.gray900 }}>Auto Pay</h3>
                <span className="text-xl">⚙️</span>
              </div>
              <p className="text-sm" style={{ color: COLORS.gray600 }}>
                Set up automatic payments
              </p>
            </button>

            <button
              className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow text-left"
              style={{ borderColor: COLORS.gray200 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold" style={{ color: COLORS.gray900 }}>Request Increase</h3>
                <span className="text-xl">📈</span>
              </div>
              <p className="text-sm" style={{ color: COLORS.gray600 }}>
                Request credit limit increase
              </p>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Authorized Users Section */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                  Authorized Users
                </h2>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md"
                  style={{ backgroundColor: COLORS.indigo }}
                >
                  + Add User
                </button>
              </div>

              {showAddUser && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddAuthorizedUser}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                        style={{ backgroundColor: COLORS.green }}
                      >
                        Add User
                      </button>
                      <button
                        onClick={() => {
                          setShowAddUser(false);
                          setNewUserForm({ name: '', email: '' });
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ color: COLORS.gray600, backgroundColor: COLORS.gray100 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {authorizedUsers.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: COLORS.gray500 }}>
                    No authorized users yet
                  </p>
                ) : (
                  authorizedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ borderColor: COLORS.gray200 }}
                    >
                      <div className="flex-1">
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>
                          {user.name}
                        </div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className="text-xs px-2 py-1 rounded capitalize"
                          style={{
                            backgroundColor:
                              user.status === 'active' ? COLORS.green : COLORS.gray300,
                            color: user.status === 'active' ? '#FFFFFF' : COLORS.gray700,
                          }}
                        >
                          {user.status}
                        </span>
                        <button
                          className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                          style={{ color: COLORS.crimson }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.gray200 }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 }}>
                <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                  Recent Transactions
                </h2>
                <button
                  className="text-sm font-medium hover:underline"
                  style={{ color: COLORS.indigo }}
                >
                  View All
                </button>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: COLORS.gray200 }}>
                {loading ? (
                  <div className="px-6 py-8 text-center" style={{ color: COLORS.gray500 }}>
                    Loading...
                  </div>
                ) : sortedDates.length === 0 ? (
                  <div className="px-6 py-8 text-center" style={{ color: COLORS.gray500 }}>
                    No transactions found
                  </div>
                ) : (
                  sortedDates.slice(0, 5).map((date) => (
                    <div key={date}>
                      <div className="px-6 py-2" style={{ backgroundColor: COLORS.gray50 }}>
                        <span className="text-xs font-medium" style={{ color: COLORS.gray700 }}>
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {groupedTransactions[date].slice(0, 3).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1" style={{ color: COLORS.gray900 }}>
                              {transaction.description || `${transaction.type} transaction`}
                            </div>
                            <div className="text-xs" style={{ color: COLORS.gray500 }}>
                              {new Date(transaction.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: COLORS.gray900 }}
                          >
                            ${Math.abs(transaction.amount).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Perks Section */}
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
            <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>
              Available Perks & Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {perkOffers.map((perk) => (
                <div
                  key={perk.id}
                  className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderColor: COLORS.gray200 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{perk.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: COLORS.gray900 }}>
                        {perk.title}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: COLORS.gray100,
                          color: COLORS.gray600,
                        }}
                      >
                        {perk.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.gray600 }}>
                    {perk.description}
                  </p>
                  <button
                    className="mt-3 text-sm font-medium hover:underline"
                    style={{ color: COLORS.indigo }}
                  >
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import BackButton from "@/components/BackButton";
import { getEnvelopeAccounts, addEnvelopeAccount, EnvelopeAccount } from "@/lib/envelopeAccounts";

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

export default function EnvelopeAccountsPage() {
  const { sidebarWidth } = useSidebar();
  const [accounts, setAccounts] = useState<EnvelopeAccount[]>([]);

  // Load accounts on mount
  useEffect(() => {
    const loadedAccounts = getEnvelopeAccounts();
    setAccounts(loadedAccounts);
  }, []);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    targetAmount: '',
  });
  const [creatingStep, setCreatingStep] = useState(0);

  const handleCreateAccount = () => {
    if (!formData.name.trim()) return;
    
    setIsCreating(true);
    setCreatingStep(1);
    
    // Mock process: step 1 -> step 2 -> step 3 -> complete
    setTimeout(() => {
      setCreatingStep(2);
      setTimeout(() => {
        setCreatingStep(3);
        setTimeout(() => {
          // Generate account number (last 4 digits)
          const accountNumber = Math.floor(Math.random() * 9000 + 1000).toString();
          
          const newAccount: EnvelopeAccount = {
            id: Date.now().toString(),
            name: formData.name,
            balance: 0,
            accountNumber: accountNumber,
            targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
            purpose: formData.purpose || 'Savings envelope',
            createdAt: new Date().toISOString().split('T')[0],
          };
          
          // Save to localStorage and update state
          addEnvelopeAccount(newAccount);
          setAccounts([...accounts, newAccount]);
          
          // Notify sidebar of change
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('envelopeAccountsChanged'));
          }
          
          setIsCreating(false);
          setFormData({ name: '', purpose: '', targetAmount: '' });
          setCreatingStep(0);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        {/* Header */}
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="mb-3">
              <BackButton />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/s15-icon.png"
                  alt="Station 15"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Envelope Accounts</h1>
              </div>
              <button
                onClick={handleCreateAccount}
                disabled={isCreating}
                className="px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: COLORS.indigo,
                  color: '#FFFFFF',
                }}
              >
                {isCreating ? 'Creating...' : 'Make New Account'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Creation Process Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4" style={{ borderColor: COLORS.gray200 }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.gray900 }}>
                  Create Envelope Account
                </h2>
                
                {creatingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                        Account Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Tax Reserve"
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ borderColor: COLORS.gray300 }}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                        Purpose
                      </label>
                      <input
                        type="text"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="What is this envelope for?"
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ borderColor: COLORS.gray300 }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                        Target Amount (optional)
                      </label>
                      <input
                        type="number"
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ borderColor: COLORS.gray300 }}
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setFormData({ name: '', purpose: '', targetAmount: '' });
                          setCreatingStep(0);
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ color: COLORS.gray600, backgroundColor: COLORS.gray100 }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setCreatingStep(2)}
                        disabled={!formData.name.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: COLORS.indigo }}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                )}

                {creatingStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.indigo }}></div>
                    </div>
                    <p className="text-center" style={{ color: COLORS.gray600 }}>
                      Creating envelope account...
                    </p>
                  </div>
                )}

                {creatingStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.green }}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-center font-semibold" style={{ color: COLORS.gray900 }}>
                      Envelope account created!
                    </p>
                    <p className="text-center text-sm" style={{ color: COLORS.gray600 }}>
                      Start transferring funds to your new envelope.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => {
              const progress = account.targetAmount
                ? (account.balance / account.targetAmount) * 100
                : 0;

              return (
                <div
                  key={account.id}
                  className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow"
                  style={{ borderColor: COLORS.gray200 }}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.gray900 }}>
                      {account.name}
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.gray600 }}>
                      {account.purpose}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm mb-1" style={{ color: COLORS.gray600 }}>Current Balance</div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.indigo }}>
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {account.targetAmount && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span style={{ color: COLORS.gray600 }}>Target</span>
                        <span style={{ color: COLORS.gray700 }}>
                          ${account.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: COLORS.indigo,
                          }}
                        />
                      </div>
                      <div className="text-xs mt-1" style={{ color: COLORS.gray500 }}>
                        {progress.toFixed(1)}% complete
                      </div>
                    </div>
                  )}

                  <div className="text-xs" style={{ color: COLORS.gray500 }}>
                    Created {new Date(account.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}

            {accounts.length === 0 && !isCreating && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg" style={{ color: COLORS.gray500 }}>
                  No envelope accounts yet. Create your first one!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


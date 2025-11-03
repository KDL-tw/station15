'use client';

import Image from "next/image";
import { useState } from "react";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import BackButton from "@/components/BackButton";

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

interface Transfer {
  id: string;
  type: 'ach' | 'wire' | 'internal' | 'auto';
  fromAccount: string;
  toAccount: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description?: string;
}

interface AutoTransferRule {
  id: string;
  name: string;
  fromAccount: string;
  toAccount: string;
  amount?: number;
  percentage?: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  trigger: 'balance_threshold' | 'schedule' | 'deposit';
  threshold?: number;
  nextExecution?: string;
  enabled: boolean;
}

export default function TransfersPage() {
  const { sidebarWidth } = useSidebar();
  const [activeTab, setActiveTab] = useState<'ach' | 'wire' | 'internal' | 'auto'>('ach');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showAutoRuleForm, setShowAutoRuleForm] = useState(false);
  const [transferForm, setTransferForm] = useState({
    type: 'ach' as 'ach' | 'wire' | 'internal',
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
  });
  const [autoRuleForm, setAutoRuleForm] = useState({
    name: '',
    fromAccount: '',
    toAccount: '',
    amountType: 'fixed' as 'fixed' | 'percentage',
    amount: '',
    percentage: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    trigger: 'schedule' as 'balance_threshold' | 'schedule' | 'deposit',
    threshold: '',
  });

  const accounts = [
    { id: '1', name: 'Primary Checking', number: '****1234', balance: 12500 },
    { id: '2', name: 'Tax Reserve', number: '****5678', balance: 5000 },
    { id: '3', name: 'Equipment Fund', number: '****9012', balance: 2500 },
  ];

  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: '1',
      type: 'ach',
      fromAccount: 'Primary Checking',
      toAccount: 'External - Vendor Payment',
      amount: 2500,
      status: 'completed',
      date: '2024-01-15',
      description: 'Monthly vendor payment',
    },
    {
      id: '2',
      type: 'wire',
      fromAccount: 'Primary Checking',
      toAccount: 'External - Client Refund',
      amount: 5000,
      status: 'completed',
      date: '2024-01-12',
      description: 'Urgent client refund',
    },
    {
      id: '3',
      type: 'internal',
      fromAccount: 'Primary Checking',
      toAccount: 'Tax Reserve',
      amount: 1000,
      status: 'completed',
      date: '2024-01-10',
      description: 'Monthly tax reserve deposit',
    },
  ]);

  const [autoRules, setAutoRules] = useState<AutoTransferRule[]>([
    {
      id: '1',
      name: 'Monthly Tax Reserve',
      fromAccount: 'Primary Checking',
      toAccount: 'Tax Reserve',
      amount: 1000,
      frequency: 'monthly',
      trigger: 'schedule',
      nextExecution: '2024-02-01',
      enabled: true,
    },
    {
      id: '2',
      name: 'Equipment Fund Auto-Save',
      fromAccount: 'Primary Checking',
      toAccount: 'Equipment Fund',
      percentage: 5,
      frequency: 'monthly',
      trigger: 'deposit',
      enabled: true,
    },
  ]);

  const handleTransfer = () => {
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) return;

    const newTransfer: Transfer = {
      id: Date.now().toString(),
      type: transferForm.type,
      fromAccount: transferForm.fromAccount,
      toAccount: transferForm.toAccount,
      amount: parseFloat(transferForm.amount),
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      description: transferForm.description,
    };

    setTransfers([newTransfer, ...transfers]);
    setTransferForm({ type: 'ach', fromAccount: '', toAccount: '', amount: '', description: '' });
    setShowTransferForm(false);
  };

  const handleCreateAutoRule = () => {
    if (!autoRuleForm.name || !autoRuleForm.fromAccount || !autoRuleForm.toAccount) return;

    const newRule: AutoTransferRule = {
      id: Date.now().toString(),
      name: autoRuleForm.name,
      fromAccount: autoRuleForm.fromAccount,
      toAccount: autoRuleForm.toAccount,
      amount: autoRuleForm.amountType === 'fixed' ? parseFloat(autoRuleForm.amount) : undefined,
      percentage: autoRuleForm.amountType === 'percentage' ? parseFloat(autoRuleForm.percentage) : undefined,
      frequency: autoRuleForm.frequency,
      trigger: autoRuleForm.trigger,
      threshold: autoRuleForm.threshold ? parseFloat(autoRuleForm.threshold) : undefined,
      nextExecution: autoRuleForm.trigger === 'schedule' ? '2024-02-01' : undefined,
      enabled: true,
    };

    setAutoRules([...autoRules, newRule]);
    setAutoRuleForm({
      name: '',
      fromAccount: '',
      toAccount: '',
      amountType: 'fixed',
      amount: '',
      percentage: '',
      frequency: 'monthly',
      trigger: 'schedule',
      threshold: '',
    });
    setShowAutoRuleForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.green;
      case 'pending':
        return COLORS.amber;
      case 'failed':
        return COLORS.crimson;
      default:
        return COLORS.gray500;
    }
  };

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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Transfers</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 border" style={{ borderColor: COLORS.gray200 }}>
            {(['ach', 'wire', 'internal', 'auto'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: activeTab === tab ? COLORS.indigo : 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : COLORS.gray700,
                }}
              >
                {tab === 'ach' ? 'ACH' : tab === 'wire' ? 'Wire' : tab === 'internal' ? 'Internal' : 'Auto Rules'}
              </button>
            ))}
          </div>

          {/* ACH Tab */}
          {activeTab === 'ach' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>ACH Transfers</h2>
                  <button
                    onClick={() => {
                      setShowTransferForm(true);
                      setTransferForm({ ...transferForm, type: 'ach' });
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: COLORS.indigo }}
                  >
                    + New ACH Transfer
                  </button>
                </div>

                {showTransferForm && transferForm.type === 'ach' && (
                  <div className="mb-6 p-5 rounded-lg border" style={{ backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 }}>
                    <h3 className="font-semibold mb-4" style={{ color: COLORS.gray900 }}>Create ACH Transfer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>From Account</label>
                        <select
                          value={transferForm.fromAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        >
                          <option value="">Select account</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.name}>
                              {acc.name} ({acc.number}) - ${acc.balance.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>To Account / Routing Info</label>
                        <input
                          type="text"
                          value={transferForm.toAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                          placeholder="Enter account number or routing information"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Amount</label>
                        <input
                          type="number"
                          value={transferForm.amount}
                          onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Description (optional)</label>
                        <input
                          type="text"
                          value={transferForm.description}
                          onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                          placeholder="Payment description"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleTransfer}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: COLORS.green }}
                        >
                          Submit ACH Transfer
                        </button>
                        <button
                          onClick={() => {
                            setShowTransferForm(false);
                            setTransferForm({ type: 'ach', fromAccount: '', toAccount: '', amount: '', description: '' });
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
                  {transfers.filter((t) => t.type === 'ach').map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{ borderColor: COLORS.gray200 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="text-sm font-medium" style={{ color: COLORS.gray900 }}>
                            {transfer.fromAccount} → {transfer.toAccount}
                          </div>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getStatusColor(transfer.status) + '20',
                              color: getStatusColor(transfer.status),
                            }}
                          >
                            {transfer.status}
                          </span>
                        </div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>
                          {transfer.description || 'No description'} • {transfer.date}
                        </div>
                      </div>
                      <div className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                        ${transfer.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Wire Tab */}
          {activeTab === 'wire' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray900 }}>Wire Transfers</h2>
                    <p className="text-sm" style={{ color: COLORS.gray600 }}>
                      Same-day transfers for urgent payments. Higher fees apply.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTransferForm(true);
                      setTransferForm({ ...transferForm, type: 'wire' });
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: COLORS.indigo }}
                  >
                    + New Wire Transfer
                  </button>
                </div>

                {showTransferForm && transferForm.type === 'wire' && (
                  <div className="mb-6 p-5 rounded-lg border" style={{ backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 }}>
                    <h3 className="font-semibold mb-4" style={{ color: COLORS.gray900 }}>Create Wire Transfer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>From Account</label>
                        <select
                          value={transferForm.fromAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        >
                          <option value="">Select account</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.name}>
                              {acc.name} ({acc.number}) - ${acc.balance.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Recipient Bank Info</label>
                        <input
                          type="text"
                          value={transferForm.toAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                          placeholder="Bank name, account number, routing number"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Amount</label>
                        <input
                          type="number"
                          value={transferForm.amount}
                          onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Description (optional)</label>
                        <input
                          type="text"
                          value={transferForm.description}
                          onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                          placeholder="Wire transfer description"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.amber + '20', borderColor: COLORS.amber }}>
                        <p className="text-xs" style={{ color: COLORS.gray700 }}>
                          ⚠️ Wire transfers are processed same-day but incur higher fees (~$25-50). Please verify all details before submitting.
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleTransfer}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: COLORS.crimson }}
                        >
                          Submit Wire Transfer
                        </button>
                        <button
                          onClick={() => {
                            setShowTransferForm(false);
                            setTransferForm({ type: 'wire', fromAccount: '', toAccount: '', amount: '', description: '' });
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
                  {transfers.filter((t) => t.type === 'wire').map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{ borderColor: COLORS.gray200 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="text-sm font-medium" style={{ color: COLORS.gray900 }}>
                            {transfer.fromAccount} → {transfer.toAccount}
                          </div>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getStatusColor(transfer.status) + '20',
                              color: getStatusColor(transfer.status),
                            }}
                          >
                            {transfer.status}
                          </span>
                        </div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>
                          {transfer.description || 'No description'} • {transfer.date}
                        </div>
                      </div>
                      <div className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                        ${transfer.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Internal Transfer Tab */}
          {activeTab === 'internal' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray900 }}>Internal Transfers</h2>
                    <p className="text-sm" style={{ color: COLORS.gray600 }}>
                      Move funds between your accounts instantly. No fees.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTransferForm(true);
                      setTransferForm({ ...transferForm, type: 'internal' });
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: COLORS.indigo }}
                  >
                    + New Internal Transfer
                  </button>
                </div>

                {showTransferForm && transferForm.type === 'internal' && (
                  <div className="mb-6 p-5 rounded-lg border" style={{ backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 }}>
                    <h3 className="font-semibold mb-4" style={{ color: COLORS.gray900 }}>Create Internal Transfer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>From Account</label>
                        <select
                          value={transferForm.fromAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        >
                          <option value="">Select account</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.name}>
                              {acc.name} ({acc.number}) - ${acc.balance.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>To Account</label>
                        <select
                          value={transferForm.toAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        >
                          <option value="">Select account</option>
                          {accounts
                            .filter((acc) => acc.name !== transferForm.fromAccount)
                            .map((acc) => (
                              <option key={acc.id} value={acc.name}>
                                {acc.name} ({acc.number}) - ${acc.balance.toLocaleString()}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Amount</label>
                        <input
                          type="number"
                          value={transferForm.amount}
                          onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Description (optional)</label>
                        <input
                          type="text"
                          value={transferForm.description}
                          onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                          placeholder="Transfer description"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleTransfer}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: COLORS.green }}
                        >
                          Transfer Funds
                        </button>
                        <button
                          onClick={() => {
                            setShowTransferForm(false);
                            setTransferForm({ type: 'internal', fromAccount: '', toAccount: '', amount: '', description: '' });
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
                  {transfers.filter((t) => t.type === 'internal').map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{ borderColor: COLORS.gray200 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="text-sm font-medium" style={{ color: COLORS.gray900 }}>
                            {transfer.fromAccount} → {transfer.toAccount}
                          </div>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getStatusColor(transfer.status) + '20',
                              color: getStatusColor(transfer.status),
                            }}
                          >
                            {transfer.status}
                          </span>
                        </div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>
                          {transfer.description || 'No description'} • {transfer.date}
                        </div>
                      </div>
                      <div className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>
                        ${transfer.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Auto Transfer Rules Tab */}
          {activeTab === 'auto' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray900 }}>Auto Transfer Rules</h2>
                    <p className="text-sm" style={{ color: COLORS.gray600 }}>
                      Automate transfers based on schedule, balance thresholds, or deposits.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAutoRuleForm(true)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: COLORS.indigo }}
                  >
                    + Create Auto Rule
                  </button>
                </div>

                {showAutoRuleForm && (
                  <div className="mb-6 p-5 rounded-lg border" style={{ backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 }}>
                    <h3 className="font-semibold mb-4" style={{ color: COLORS.gray900 }}>Create Auto Transfer Rule</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Rule Name</label>
                        <input
                          type="text"
                          value={autoRuleForm.name}
                          onChange={(e) => setAutoRuleForm({ ...autoRuleForm, name: e.target.value })}
                          placeholder="e.g., Monthly Tax Reserve"
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>From Account</label>
                          <select
                            value={autoRuleForm.fromAccount}
                            onChange={(e) => setAutoRuleForm({ ...autoRuleForm, fromAccount: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                            style={{ borderColor: COLORS.gray300 }}
                          >
                            <option value="">Select account</option>
                            {accounts.map((acc) => (
                              <option key={acc.id} value={acc.name}>
                                {acc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>To Account</label>
                          <select
                            value={autoRuleForm.toAccount}
                            onChange={(e) => setAutoRuleForm({ ...autoRuleForm, toAccount: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                            style={{ borderColor: COLORS.gray300 }}
                          >
                            <option value="">Select account</option>
                            {accounts.map((acc) => (
                              <option key={acc.id} value={acc.name}>
                                {acc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Transfer Amount</label>
                        <div className="flex space-x-2 mb-2">
                          <button
                            onClick={() => setAutoRuleForm({ ...autoRuleForm, amountType: 'fixed' })}
                            className={`px-3 py-1 rounded text-sm ${
                              autoRuleForm.amountType === 'fixed' ? 'text-white' : ''
                            }`}
                            style={{
                              backgroundColor: autoRuleForm.amountType === 'fixed' ? COLORS.indigo : COLORS.gray100,
                              color: autoRuleForm.amountType === 'fixed' ? '#FFFFFF' : COLORS.gray700,
                            }}
                          >
                            Fixed Amount
                          </button>
                          <button
                            onClick={() => setAutoRuleForm({ ...autoRuleForm, amountType: 'percentage' })}
                            className={`px-3 py-1 rounded text-sm ${
                              autoRuleForm.amountType === 'percentage' ? 'text-white' : ''
                            }`}
                            style={{
                              backgroundColor: autoRuleForm.amountType === 'percentage' ? COLORS.indigo : COLORS.gray100,
                              color: autoRuleForm.amountType === 'percentage' ? '#FFFFFF' : COLORS.gray700,
                            }}
                          >
                            Percentage
                          </button>
                        </div>
                        <input
                          type="number"
                          value={autoRuleForm.amountType === 'fixed' ? autoRuleForm.amount : autoRuleForm.percentage}
                          onChange={(e) =>
                            setAutoRuleForm({
                              ...autoRuleForm,
                              amount: autoRuleForm.amountType === 'fixed' ? e.target.value : '',
                              percentage: autoRuleForm.amountType === 'percentage' ? e.target.value : '',
                            })
                          }
                          placeholder={autoRuleForm.amountType === 'fixed' ? 'Amount' : 'Percentage'}
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Frequency</label>
                          <select
                            value={autoRuleForm.frequency}
                            onChange={(e) =>
                              setAutoRuleForm({
                                ...autoRuleForm,
                                frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                            style={{ borderColor: COLORS.gray300 }}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Trigger</label>
                          <select
                            value={autoRuleForm.trigger}
                            onChange={(e) =>
                              setAutoRuleForm({
                                ...autoRuleForm,
                                trigger: e.target.value as 'balance_threshold' | 'schedule' | 'deposit',
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                            style={{ borderColor: COLORS.gray300 }}
                          >
                            <option value="schedule">Schedule</option>
                            <option value="balance_threshold">Balance Threshold</option>
                            <option value="deposit">On Deposit</option>
                          </select>
                        </div>
                      </div>
                      {autoRuleForm.trigger === 'balance_threshold' && (
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>Balance Threshold</label>
                          <input
                            type="number"
                            value={autoRuleForm.threshold}
                            onChange={(e) => setAutoRuleForm({ ...autoRuleForm, threshold: e.target.value })}
                            placeholder="Minimum balance to trigger transfer"
                            className="w-full px-4 py-2 border rounded-lg"
                            style={{ borderColor: COLORS.gray300 }}
                          />
                        </div>
                      )}
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCreateAutoRule}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: COLORS.green }}
                        >
                          Create Rule
                        </button>
                        <button
                          onClick={() => {
                            setShowAutoRuleForm(false);
                            setAutoRuleForm({
                              name: '',
                              fromAccount: '',
                              toAccount: '',
                              amountType: 'fixed',
                              amount: '',
                              percentage: '',
                              frequency: 'monthly',
                              trigger: 'schedule',
                              threshold: '',
                            });
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
                  {autoRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-lg border"
                      style={{ borderColor: COLORS.gray200 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold" style={{ color: COLORS.gray900 }}>
                            {rule.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                            <span className="text-xs" style={{ color: COLORS.gray600 }}>
                              {rule.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                        <button
                          className="text-sm px-3 py-1 rounded hover:bg-gray-100"
                          style={{ color: COLORS.crimson }}
                        >
                          {rule.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <span style={{ color: COLORS.gray600 }}>From:</span>{' '}
                          <span style={{ color: COLORS.gray900 }}>{rule.fromAccount}</span>
                        </div>
                        <div>
                          <span style={{ color: COLORS.gray600 }}>To:</span>{' '}
                          <span style={{ color: COLORS.gray900 }}>{rule.toAccount}</span>
                        </div>
                        <div>
                          <span style={{ color: COLORS.gray600 }}>Amount:</span>{' '}
                          <span style={{ color: COLORS.gray900 }}>
                            {rule.amount
                              ? `$${rule.amount.toLocaleString()}`
                              : `${rule.percentage}%`}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: COLORS.gray600 }}>Frequency:</span>{' '}
                          <span style={{ color: COLORS.gray900 }} className="capitalize">
                            {rule.frequency}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs" style={{ color: COLORS.gray500 }}>
                        Trigger: {rule.trigger.replace('_', ' ')}{' '}
                        {rule.nextExecution && `• Next: ${rule.nextExecution}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

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
};

export default function SettingsPage() {
  const { sidebarWidth } = useSidebar();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'billing'>('general');
  const [settings, setSettings] = useState({
    // General
    businessName: 'ABC Corp',
    email: 'abc@corp.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD',
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    transactionAlerts: true,
    paymentReminders: true,
    creditLimitAlerts: true,
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    // Billing
    billingAddress: '123 Business St, Suite 100, New York, NY 10001',
    paymentMethod: 'Bank Account ending in 1234',
  });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'billing', name: 'Billing', icon: '💳' },
  ];

  const handleSave = () => {
    // TODO: Save settings to API
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.gray50 }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: sidebarWidth }}>
        <header className="bg-white border-b" style={{ borderColor: COLORS.gray200 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
            <div className="mb-3">
              <BackButton customBackPath="/" customLabel="Home" />
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
                <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Settings</h1>
              </div>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                style={{ backgroundColor: COLORS.indigo, color: '#FFFFFF' }}
              >
                Save Changes
              </button>
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
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>General Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Notification Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.gray700 }}>Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>Email Notifications</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>Receive notifications via email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>SMS Notifications</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>Receive notifications via text message</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>Push Notifications</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>Receive browser push notifications</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6" style={{ borderColor: COLORS.gray200 }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.gray700 }}>Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>Transaction Alerts</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>Get notified of incoming and outgoing transactions</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.transactionAlerts}
                          onChange={(e) => setSettings({ ...settings, transactionAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>Payment Reminders</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>Reminders for upcoming payments</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentReminders}
                          onChange={(e) => setSettings({ ...settings, paymentReminders: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.gray900 }}>Credit Limit Alerts</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>Alerts when approaching credit limits</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.creditLimitAlerts}
                          onChange={(e) => setSettings({ ...settings, creditLimitAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Security Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.gray200 }}>
                  <div>
                    <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>Two-Factor Authentication</div>
                    <div className="text-sm" style={{ color: COLORS.gray600 }}>Add an extra layer of security to your account</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm px-3 py-1 rounded font-medium ${
                      settings.twoFactorAuth ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{
                        borderColor: COLORS.indigo,
                        color: COLORS.indigo,
                        backgroundColor: 'transparent',
                      }}
                    >
                      {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: COLORS.gray200 }}>
                  <div>
                    <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>Login Alerts</div>
                    <div className="text-sm" style={{ color: COLORS.gray600 }}>Get notified when someone logs into your account</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.loginAlerts}
                      onChange={(e) => setSettings({ ...settings, loginAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.gray200 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
                    min="5"
                    max="120"
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                  <div className="text-xs mt-1" style={{ color: COLORS.gray600 }}>
                    Automatically log out after {settings.sessionTimeout} minutes of inactivity
                  </div>
                </div>
                <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.gray200 }}>
                  <h3 className="font-medium mb-3" style={{ color: COLORS.gray900 }}>Change Password</h3>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{
                      borderColor: COLORS.indigo,
                      color: COLORS.indigo,
                      backgroundColor: 'transparent',
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Billing Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Billing Address
                  </label>
                  <textarea
                    value={settings.billingAddress}
                    onChange={(e) => setSettings({ ...settings, billingAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Payment Method
                  </label>
                  <div className="p-4 border rounded-lg flex items-center justify-between" style={{ borderColor: COLORS.gray200 }}>
                    <span style={{ color: COLORS.gray900 }}>{settings.paymentMethod}</span>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{
                        borderColor: COLORS.indigo,
                        color: COLORS.indigo,
                        backgroundColor: 'transparent',
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg" style={{ borderColor: COLORS.gray200, backgroundColor: COLORS.gray50 }}>
                  <h3 className="font-medium mb-2" style={{ color: COLORS.gray900 }}>Billing History</h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.gray600 }}>
                    View and download your billing statements and invoices
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{
                      borderColor: COLORS.indigo,
                      color: COLORS.indigo,
                      backgroundColor: 'transparent',
                    }}
                  >
                    View Billing History
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


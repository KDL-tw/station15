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

export default function ProfilePage() {
  const { sidebarWidth } = useSidebar();
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'team'>('personal');
  const [profile, setProfile] = useState({
    // Personal
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@abccorp.com',
    phone: '+1 (555) 123-4567',
    title: 'CEO',
    // Business
    businessName: 'ABC Corp',
    businessType: 'LLC',
    ein: '12-3456789',
    foundedYear: '2018',
    industry: 'Technology Services',
    website: 'www.abccorp.com',
    description: 'ABC Corp is a leading technology services company specializing in business solutions.',
    // Team
    teamMembers: [
      { id: '1', name: 'Jane Smith', email: 'jane@abccorp.com', role: 'CFO', status: 'active' },
      { id: '2', name: 'Bob Johnson', email: 'bob@abccorp.com', role: 'CTO', status: 'active' },
    ],
  });

  const tabs = [
    { id: 'personal', name: 'Personal', icon: '👤' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'team', name: 'Team', icon: '👥' },
  ];

  const handleSave = () => {
    // TODO: Save profile to API
    alert('Profile updated successfully!');
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
                <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Profile</h1>
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
          {/* Profile Header */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6" style={{ borderColor: COLORS.gray200 }}>
            <div className="flex items-center space-x-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ backgroundColor: COLORS.indigo, color: '#FFFFFF' }}
              >
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ color: COLORS.gray900 }}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm mb-2" style={{ color: COLORS.gray600 }}>{profile.title} at {profile.businessName}</p>
                <p className="text-sm" style={{ color: COLORS.gray600 }}>{profile.email}</p>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  borderColor: COLORS.indigo,
                  color: COLORS.indigo,
                  backgroundColor: 'transparent',
                }}
              >
                Change Photo
              </button>
            </div>
          </div>

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

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Personal Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Information Tab */}
          {activeTab === 'business' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.gray900 }}>Business Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={profile.businessName}
                      onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Business Type
                    </label>
                    <select
                      value={profile.businessType}
                      onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    >
                      <option value="LLC">LLC</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      EIN / Tax ID
                    </label>
                    <input
                      type="text"
                      value={profile.ein}
                      onChange={(e) => setProfile({ ...profile, ein: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Year Founded
                    </label>
                    <input
                      type="text"
                      value={profile.foundedYear}
                      onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Industry
                    </label>
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                      Website
                    </label>
                    <input
                      type="text"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      style={{ borderColor: COLORS.gray300 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.gray700 }}>
                    Business Description
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.gray300 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.gray200 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold" style={{ color: COLORS.gray900 }}>Team Members</h2>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
                  style={{ backgroundColor: COLORS.indigo, color: '#FFFFFF' }}
                >
                  + Add Team Member
                </button>
              </div>
              <div className="space-y-4">
                {profile.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                    style={{ borderColor: COLORS.gray200 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: COLORS.indigo, color: '#FFFFFF' }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium mb-1" style={{ color: COLORS.gray900 }}>{member.name}</div>
                        <div className="text-sm" style={{ color: COLORS.gray600 }}>
                          {member.email} • {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.status}
                      </span>
                      <button
                        className="px-3 py-1 rounded text-sm font-medium transition-colors"
                        style={{
                          borderColor: COLORS.crimson,
                          color: COLORS.crimson,
                          backgroundColor: 'transparent',
                        }}
                      >
                        Remove
                      </button>
                    </div>
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


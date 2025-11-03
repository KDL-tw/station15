'use client';

import Image from "next/image";
import Sidebar, { useSidebar } from "@/components/Sidebar";

const COLORS = {
  indigo: '#312E81',
  indigo900: '#312E81',
  indigo800: '#3730A3',
  crimson: '#DC143C',
  red600: '#DC2626',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate600: '#475569',
  slate700: '#334155',
  white: '#FFFFFF',
};

interface Perk {
  title: string;
  description: string;
  hook: string;
}

interface Category {
  name: string;
  perks: Perk[];
}

export default function PerksPage() {
  const { sidebarWidth } = useSidebar();

  const categories: Category[] = [
    {
      name: 'Business Essentials',
      perks: [
        {
          title: 'Payroll Fast-Track',
          description: 'Get paid daily through Everee with instant payouts and fee-free ACH.',
          hook: 'Your money, same day.',
        },
        {
          title: 'Fractional Services Credit',
          description: 'Access vetted pros by the hour—no retainers, no long-term contracts.',
          hook: 'Tap expert help, pay only for what you use.',
        },
        {
          title: 'Trade Credit Line',
          description: 'Net-15 microcredit built into your member wallet for short-term project costs.',
          hook: 'Buy now, pay next project.',
        },
        {
          title: 'Smart Invoicing Suite',
          description: 'Track invoices automatically and send polite reminders with one click.',
          hook: 'Stop chasing payments.',
        },
        {
          title: 'Digital Escrow',
          description: 'Secure payments between members with instant release on completion.',
          hook: 'Trust-backed transactions.',
        },
      ],
    },
    {
      name: 'Financial Wellness',
      perks: [
        {
          title: 'Commons Fund Access',
          description: 'Join pooled funds that offer zero-interest micro-loans to members.',
          hook: 'Borrow from your peers, not the bank.',
        },
        {
          title: 'Credit-Builder Charge Card',
          description: 'Build credit automatically every time you pay a vendor or invoice.',
          hook: 'Every transaction builds your future.',
        },
        {
          title: 'Partner Banking',
          description: 'Access Station-approved banking partners with no hidden fees or traps.',
          hook: 'Fair banking for founders.',
        },
        {
          title: 'Revenue Advance Option',
          description: 'Get an advance on predictable recurring income to keep projects moving.',
          hook: 'Smooth your cashflow curve.',
        },
        {
          title: 'Insurance Navigator',
          description: 'Bundle liability, health, or equipment coverage at member rates.',
          hook: 'Protection that scales with you.',
        },
      ],
    },
    {
      name: 'Growth & Learning',
      perks: [
        {
          title: 'Founder Clinics',
          description: 'Monthly live sessions on funding, compliance, and scaling your business.',
          hook: 'Learn what schools don\'t teach.',
        },
        {
          title: '1:1 Office Hours',
          description: 'Book time with vetted experts in finance, policy, or brand design.',
          hook: 'Talk to someone who's been there.',
        },
        {
          title: 'Playbooks Library',
          description: 'Templates, guides, and calculators built by Station 15 to make business easier.',
          hook: 'Cut the learning curve in half.',
        },
        {
          title: 'Certification Reimbursement',
          description: 'Partial reimbursement when you complete an approved course.',
          hook: 'Earn skills, get cash back.',
        },
      ],
    },
    {
      name: 'Community & Wellness',
      perks: [
        {
          title: 'Peer Lounge Access',
          description: 'Connect with other members, swap referrals, and share resources.',
          hook: 'Find your next collaborator.',
        },
        {
          title: 'Commons Events',
          description: 'Quarterly mixers and retreats designed for connection and collaboration.',
          hook: 'Build your circle offline.',
        },
        {
          title: 'Wellness Stipend',
          description: 'Monthly stipend toward gym, therapy, or meditation apps.',
          hook: 'Your health is part of your hustle.',
        },
        {
          title: 'Care Credit',
          description: 'Subsidized childcare or eldercare access through the Commons pool.',
          hook: 'Support beyond the workspace.',
        },
      ],
    },
    {
      name: 'Access & Exclusives',
      perks: [
        {
          title: 'Vendor Marketplace Discounts',
          description: 'Member pricing on hardware, software, and professional tools.',
          hook: 'Save on the things you actually use.',
        },
        {
          title: 'Grant Watchlist',
          description: 'Early alerts for grants and local funding programs you qualify for.',
          hook: 'Never miss free money again.',
        },
        {
          title: 'Partner Offers',
          description: 'Rotating deals with aligned brands and co-ops inside the ecosystem.',
          hook: 'Exclusive perks from mission-driven partners.',
        },
        {
          title: 'Commons Match',
          description: 'Station 15 matches a portion of your spend on verified member-to-member transactions.',
          hook: 'Get rewarded for staying in the ecosystem.',
        },
        {
          title: 'Priority Beta Access',
          description: 'Be first to test and influence upcoming Station 15 features.',
          hook: 'Lead what's next.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.slate50 }}>
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
              <h1 className="text-2xl font-bold" style={{ color: COLORS.gray900 }}>Perks</h1>
            </div>
          </div>
        </header>

        <section className="py-20 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-semibold text-center mb-4" style={{ color: COLORS.indigo900 }}>
              Station 15 Perks
            </h2>
            <p className="text-lg text-center mb-12 max-w-2xl mx-auto" style={{ color: COLORS.slate600 }}>
              Membership that actually gives back — tools, funding, and community designed to keep your business moving.
            </p>

            {categories.map((category) => (
              <div key={category.name} className="mb-16">
                <h3 className="text-2xl font-semibold mb-6" style={{ color: COLORS.indigo800 }}>
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.perks.map((perk) => (
                    <div
                      key={perk.title}
                      className="bg-white rounded-2xl shadow-sm p-6 border transition-all duration-200"
                      style={{
                        borderColor: COLORS.slate100,
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                      }}
                    >
                      <h4 className="text-xl font-semibold mb-2" style={{ color: COLORS.indigo900 }}>
                        {perk.title}
                      </h4>
                      <p className="mb-3" style={{ color: COLORS.slate600 }}>
                        {perk.description}
                      </p>
                      <p className="font-medium" style={{ color: COLORS.red600 }}>
                        {perk.hook}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

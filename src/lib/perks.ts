// Shared perks data and visibility management
// Used by both admin and user-facing perks page

export interface Perk {
  title: string;
  description: string;
  hook: string;
}

export interface Category {
  name: string;
  perks: Perk[];
}

export interface PerkVisibility {
  [categoryName: string]: {
    [perkTitle: string]: boolean; // true = visible, false = hidden
  };
}

// All perks data structure
export const ALL_PERKS: Category[] = [
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
        hook: 'Talk to someone who\'s been there.',
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
        hook: 'Lead what\'s next.',
      },
    ],
  },
];

// Get visibility state from localStorage
export function getPerkVisibility(): PerkVisibility {
  if (typeof window === 'undefined') {
    return {};
  }
  const stored = localStorage.getItem('s15_perk_visibility');
  if (!stored) {
    // Initialize all perks as visible by default
    const initial: PerkVisibility = {};
    ALL_PERKS.forEach((category) => {
      initial[category.name] = {};
      category.perks.forEach((perk) => {
        initial[category.name][perk.title] = true;
      });
    });
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

// Save visibility state to localStorage
export function savePerkVisibility(visibility: PerkVisibility): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('s15_perk_visibility', JSON.stringify(visibility));
}

// Toggle visibility for a specific perk
export function togglePerkVisibility(
  categoryName: string,
  perkTitle: string,
  visible: boolean
): PerkVisibility {
  const visibility = getPerkVisibility();
  if (!visibility[categoryName]) {
    visibility[categoryName] = {};
  }
  visibility[categoryName][perkTitle] = visible;
  savePerkVisibility(visibility);
  return visibility;
}

// Get filtered categories with only visible perks
export function getVisiblePerks(): Category[] {
  const visibility = getPerkVisibility();
  return ALL_PERKS.map((category) => ({
    name: category.name,
    perks: category.perks.filter((perk) => {
      const isVisible = visibility[category.name]?.[perk.title] !== false;
      return isVisible;
    }),
  })).filter((category) => category.perks.length > 0); // Remove empty categories
}


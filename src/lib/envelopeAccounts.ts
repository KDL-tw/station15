// Shared envelope accounts data and management
// Used by sidebar navigation and envelope accounts page

export interface EnvelopeAccount {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  targetAmount?: number;
  purpose: string;
  createdAt: string;
}

// Get envelope accounts from localStorage
export function getEnvelopeAccounts(): EnvelopeAccount[] {
  if (typeof window === 'undefined') {
    return getDefaultEnvelopeAccounts();
  }
  const stored = localStorage.getItem('s15_envelope_accounts');
  if (!stored) {
    const defaultAccounts = getDefaultEnvelopeAccounts();
    saveEnvelopeAccounts(defaultAccounts);
    return defaultAccounts;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultEnvelopeAccounts();
  }
}

// Save envelope accounts to localStorage
export function saveEnvelopeAccounts(accounts: EnvelopeAccount[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('s15_envelope_accounts', JSON.stringify(accounts));
}

// Get default envelope accounts
function getDefaultEnvelopeAccounts(): EnvelopeAccount[] {
  return []; // Start with empty - users will create their own accounts
}

// Add new envelope account
export function addEnvelopeAccount(account: EnvelopeAccount): void {
  const accounts = getEnvelopeAccounts();
  accounts.push(account);
  saveEnvelopeAccounts(accounts);
}

// Format account name for navigation (e.g., "Checking 4853")
export function formatAccountNameForNav(account: EnvelopeAccount): string {
  return `Checking ${account.accountNumber}`;
}


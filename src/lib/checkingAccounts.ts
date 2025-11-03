// Shared checking accounts data and management
// Used by sidebar navigation and checking page

export interface CheckingAccount {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  type: 'checking' | 'savings' | 'envelope';
}

// Get checking accounts from localStorage
export function getCheckingAccounts(): CheckingAccount[] {
  if (typeof window === 'undefined') {
    return getDefaultCheckingAccounts();
  }
  const stored = localStorage.getItem('s15_checking_accounts');
  if (!stored) {
    const defaultAccounts = getDefaultCheckingAccounts();
    saveCheckingAccounts(defaultAccounts);
    return defaultAccounts;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultCheckingAccounts();
  }
}

// Save checking accounts to localStorage
export function saveCheckingAccounts(accounts: CheckingAccount[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('s15_checking_accounts', JSON.stringify(accounts));
}

// Get default checking accounts
function getDefaultCheckingAccounts(): CheckingAccount[] {
  return [
    {
      id: '1',
      name: 'Primary Checking',
      balance: 12500.00,
      accountNumber: '1234',
      type: 'checking',
    },
  ];
}

// Add new checking account
export function addCheckingAccount(account: CheckingAccount): void {
  const accounts = getCheckingAccounts();
  accounts.push(account);
  saveCheckingAccounts(accounts);
}

// Format account name for navigation (e.g., "Checking 1234")
export function formatAccountNameForNav(account: CheckingAccount): string {
  return `${account.name} ${account.accountNumber}`;
}


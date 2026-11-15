import { StudentEntryData } from '../pages/EntryFormPage';

const REG_DRAFT_KEY = 'medix_prime_reg_draft_v1';
const SAVED_ACCOUNTS_KEY = 'medix_prime_saved_accounts_v1';
const REMEMBERED_LOGIN_KEY = 'medix_prime_remembered_login_v1';

export interface RegistrationDraft {
  name: string;
  studentClass: 'SSC' | 'HSC';
  institution: string;
  phone: string;
  updatedAt: string;
}

export interface SavedStudentAccount extends StudentEntryData {
  pin: string;
}

export interface RememberedLogin {
  phone: string;
  pin: string;
  name?: string;
  autoSaveEnabled: boolean;
  savedAt: string;
}

export function loadRegistrationDraft(): RegistrationDraft | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(REG_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RegistrationDraft>;
    if (!parsed) return null;
    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      studentClass: parsed.studentClass === 'SSC' ? 'SSC' : 'HSC',
      institution: typeof parsed.institution === 'string' ? parsed.institution : '',
      phone: typeof parsed.phone === 'string' ? parsed.phone : '',
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveRegistrationDraft(draft: Omit<RegistrationDraft, 'updatedAt'>): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const hasAnyContent =
      draft.name.trim().length > 0 ||
      draft.institution.trim().length > 0 ||
      draft.phone.trim().length > 0;
    if (!hasAnyContent) {
      window.localStorage.removeItem(REG_DRAFT_KEY);
      return;
    }
    const payload: RegistrationDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(REG_DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors
  }
}

export function clearRegistrationDraft(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(REG_DRAFT_KEY);
  } catch {
    // Ignore
  }
}

export function loadSavedAccounts(): SavedStudentAccount[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedStudentAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveStudentAccountLocally(account: SavedStudentAccount): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const accounts = loadSavedAccounts();
    const existingIdx = accounts.findIndex((a) => a.phone === account.phone);
    const merged: SavedStudentAccount = {
      ...account,
      studentPhoto: account.studentPhoto || (existingIdx >= 0 ? accounts[existingIdx].studentPhoto : undefined),
    };
    if (existingIdx >= 0) {
      accounts[existingIdx] = merged;
    } else {
      accounts.unshift(merged);
    }
    window.localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts.slice(0, 5)));
  } catch {
    // Ignore
  }
}

export function findSavedAccount(phone: string): SavedStudentAccount | null {
  const accounts = loadSavedAccounts();
  return accounts.find((a) => a.phone === phone) || null;
}

export function loadRememberedLogin(): RememberedLogin | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(REMEMBERED_LOGIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RememberedLogin>;
    if (!parsed || typeof parsed.phone !== 'string' || typeof parsed.pin !== 'string') {
      return null;
    }
    return {
      phone: parsed.phone,
      pin: parsed.pin,
      name: typeof parsed.name === 'string' ? parsed.name : undefined,
      autoSaveEnabled: parsed.autoSaveEnabled !== false,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveRememberedLogin(data: Omit<RememberedLogin, 'savedAt'>): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (!data.autoSaveEnabled) {
      window.localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      return;
    }
    const payload: RememberedLogin = {
      ...data,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(REMEMBERED_LOGIN_KEY, JSON.stringify(payload));
  } catch {
    // Ignore
  }
}

export function clearRememberedLogin(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(REMEMBERED_LOGIN_KEY);
  } catch {
    // Ignore
  }
}

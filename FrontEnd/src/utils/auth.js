const ACCOUNTS_KEY = 'mmb_accounts';
const CURRENT_USER_KEY = 'currentUser';
const OWNER_KEY = 'mmb_owner_profile';

// Owner account is provisioned directly in the system, not through public signup.
// Edits made in the profile modal are saved as overrides on top of these defaults.
const OWNER_DEFAULTS = {
  email: 'owner@mmobilebar.com',
  password: 'Owner@123',
  fullname: 'M Mobile Bar Owner',
  username: 'owner',
  role: 'owner',
};

function getAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getOwnerAccount() {
  const overrides = JSON.parse(localStorage.getItem(OWNER_KEY) || '{}');
  return { ...OWNER_DEFAULTS, ...overrides, role: 'owner' };
}

function saveOwnerOverrides(updates) {
  const overrides = JSON.parse(localStorage.getItem(OWNER_KEY) || '{}');
  localStorage.setItem(OWNER_KEY, JSON.stringify({ ...overrides, ...updates }));
}

// The session never stores the password.
function toSession(account) {
  return {
    fullname: account.fullname,
    username: account.username || '',
    email: account.email,
    role: account.role,
    avatar: account.avatar || '',
  };
}

function setSession(account) {
  const session = toSession(account);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
  return session;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// --- Validation ---

function emailTaken(email, exceptEmail = '') {
  const target = email.trim().toLowerCase();
  if (target === exceptEmail.toLowerCase()) return false;
  if (getOwnerAccount().email.toLowerCase() === target) return true;
  return getAccounts().some((a) => a.email.toLowerCase() === target);
}

function passwordError(password) {
  if (!password) return 'Password is required.';
  if (/\s/.test(password)) return 'Password cannot contain spaces.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include both letters and numbers.';
  }
  return '';
}

function validateBasics({ fullname, username, email }, exceptEmail = '') {
  const errors = {};

  if (!fullname || !fullname.trim()) {
    errors.fullname = 'Full name is required.';
  } else if (fullname.trim().length < 2) {
    errors.fullname = 'Full name is too short.';
  }

  if (!username || !username.trim()) {
    errors.username = 'Username is required.';
  } else if (/\s/.test(username)) {
    errors.username = 'Username cannot contain spaces.';
  } else if (username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email is required.';
  } else if (/\s/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  } else if (emailTaken(email, exceptEmail)) {
    errors.email = 'An account with this email already exists.';
  }

  return errors;
}

export function validateSignup({ fullname, username, email, password, confirmPassword }) {
  const errors = validateBasics({ fullname, username, email });

  const pwError = passwordError(password);
  if (pwError) errors.password = pwError;

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateProfileUpdate(values, originalEmail) {
  return validateBasics(values, originalEmail);
}

export function validateNewPassword(newPassword, confirmPassword) {
  const errors = {};

  const pwError = passwordError(newPassword);
  if (pwError) errors.next = pwError;

  if (newPassword !== confirmPassword) {
    errors.confirm = 'Passwords do not match.';
  }

  return errors;
}

// --- Actions ---

export function signup({ fullname, username, email, password }) {
  const accounts = getAccounts();
  const newAccount = {
    fullname: fullname.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password, // plain text: fine for a local demo, not for production
    role: 'client',
    avatar: '',
  };
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

export function login(email, password, expectedRole) {
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (expectedRole === 'owner') {
    const owner = getOwnerAccount();
    if (trimmedEmail === owner.email.toLowerCase() && password === owner.password) {
      return { success: true, user: setSession(owner) };
    }
    return { success: false, error: 'Invalid owner email or password.' };
  }

  const match = getAccounts().find((a) => a.email === trimmedEmail && a.password === password);
  if (match) {
    return { success: true, user: setSession(match) };
  }
  return { success: false, error: 'Invalid email or password.' };
}

// Bookings, messages, notifications and settings are keyed by the client's full name,
// so a rename has to move them over or the client would lose their history.
function renameClientData(oldName, newName) {
  const bookings = JSON.parse(localStorage.getItem('mmb_bookings') || '[]');
  localStorage.setItem(
    'mmb_bookings',
    JSON.stringify(bookings.map((b) => (b.client === oldName ? { ...b, client: newName } : b)))
  );

  const threads = JSON.parse(localStorage.getItem('mmb_messages') || '{}');
  if (threads[oldName]) {
    threads[newName] = [...(threads[newName] || []), ...threads[oldName]];
    delete threads[oldName];
    localStorage.setItem('mmb_messages', JSON.stringify(threads));
  }

  const notifications = JSON.parse(localStorage.getItem('mmb_notifications') || '[]');
  localStorage.setItem(
    'mmb_notifications',
    JSON.stringify(notifications.map((n) => (n.to === oldName ? { ...n, to: newName } : n)))
  );

  const settings = JSON.parse(localStorage.getItem('mmb_settings') || '{}');
  if (settings[oldName]) {
    settings[newName] = settings[oldName];
    delete settings[oldName];
    localStorage.setItem('mmb_settings', JSON.stringify(settings));
  }
}

export function updateProfile(updates) {
  const current = getCurrentUser();
  if (!current) return null;

  const patch = {
    fullname: updates.fullname.trim(),
    username: updates.username.trim(),
    email: updates.email.trim().toLowerCase(),
    avatar: updates.avatar || '',
  };

  if (current.role === 'owner') {
    saveOwnerOverrides(patch);
    return setSession(getOwnerAccount());
  }

  const accounts = getAccounts().map((a) =>
    a.email === current.email ? { ...a, ...patch } : a
  );
  saveAccounts(accounts);

  if (patch.fullname !== current.fullname) {
    renameClientData(current.fullname, patch.fullname);
  }

  return setSession(accounts.find((a) => a.email === patch.email));
}

export function changePassword(currentPassword, newPassword) {
  const current = getCurrentUser();
  if (!current) return { success: false, error: 'You are not logged in.' };

  if (current.role === 'owner') {
    if (getOwnerAccount().password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    saveOwnerOverrides({ password: newPassword });
    return { success: true };
  }

  const accounts = getAccounts();
  const account = accounts.find((a) => a.email === current.email);
  if (!account || account.password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  saveAccounts(
    accounts.map((a) => (a.email === current.email ? { ...a, password: newPassword } : a))
  );
  return { success: true };
}
const ACCOUNTS_KEY = 'mmb_accounts';
const CURRENT_USER_KEY = 'currentUser';

const OWNER_CREDENTIALS = {
  email: 'owner@mmobilebar.com',
  password: 'Owner@123',
  fullname: 'M Mobile Bar Owner',
  role: 'owner',
};

function getAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// --- Validation ---

export function validateSignup({ fullname, username, email, password, confirmPassword }) {
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
  } else if (getAccounts().some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
    errors.email = 'An account with this email already exists.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (/\s/.test(password)) {
    errors.password = 'Password cannot contain spaces.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password must include both letters and numbers.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateProfileUpdate({ fullname, username, email }, originalEmail) {
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
  } else if (
    email.trim().toLowerCase() !== originalEmail.toLowerCase() &&
    getAccounts().some((a) => a.email.toLowerCase() === email.trim().toLowerCase())
  ) {
    errors.email = 'An account with this email already exists.';
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
    password,
    role: 'client',
  };
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

export function login(email, password, expectedRole) {
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (expectedRole === 'owner') {
    if (trimmedEmail === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(OWNER_CREDENTIALS));
      return { success: true, user: OWNER_CREDENTIALS };
    }
    return { success: false, error: 'Invalid owner email or password.' };
  }

  const accounts = getAccounts();
  const match = accounts.find((a) => a.email === trimmedEmail && a.password === password);
  if (match) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(match));
    return { success: true, user: match };
  }
  return { success: false, error: 'Invalid email or password.' };
}

export function updateProfile(originalEmail, updates) {
  const accounts = getAccounts();
  const newEmail = updates.email.trim().toLowerCase();

  const updatedAccounts = accounts.map((a) =>
    a.email === originalEmail
      ? { ...a, fullname: updates.fullname.trim(), username: updates.username.trim(), email: newEmail }
      : a
  );
  saveAccounts(updatedAccounts);

  const updatedAccount = updatedAccounts.find((a) => a.email === newEmail);
  if (updatedAccount) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedAccount));
  }
  return updatedAccount;
}

export function changePassword(email, currentPassword, newPassword) {
  const accounts = getAccounts();
  const account = accounts.find((a) => a.email === email);
  if (!account || account.password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const updatedAccounts = accounts.map((a) =>
    a.email === email ? { ...a, password: newPassword } : a
  );
  saveAccounts(updatedAccounts);

  const updatedAccount = updatedAccounts.find((a) => a.email === email);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedAccount));
  return { success: true };
}
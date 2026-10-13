
const ACCOUNTS_KEY = 'mmb_accounts';
const CURRENT_USER_KEY = 'currentUser';
const OWNER_KEY = 'mmb_owner_profile';

// Owner account defaults
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
  localStorage.setItem(
    OWNER_KEY,
    JSON.stringify({ ...overrides, ...updates })
  );
}

// Session never stores the password.
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

  if (target === exceptEmail.toLowerCase()) {
    return false;
  }

  if (getOwnerAccount().email.toLowerCase() === target) {
    return true;
  }

  return getAccounts().some(
    (account) => account.email.toLowerCase() === target
  );
}

function passwordError(password) {
  if (!password) {
    return 'Password is required.';
  }

  if (/\s/.test(password)) {
    return 'Password cannot contain spaces.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include both letters and numbers.';
  }

  return '';
}

function validateBasics(
  { fullname, username, email },
  exceptEmail = ''
) {
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
  } else if (
    /\s/.test(email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.email = 'Enter a valid email address.';
  } else if (emailTaken(email, exceptEmail)) {
    errors.email = 'An account with this email already exists.';
  }

  return errors;
}

export function validateSignup({
  fullname,
  username,
  email,
  password,
  confirmPassword,
}) {
  const errors = validateBasics({ fullname, username, email });

  const pwError = passwordError(password);

  if (pwError) {
    errors.password = pwError;
  }

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

  if (pwError) {
    errors.next = pwError;
  }

  if (newPassword !== confirmPassword) {
    errors.confirm = 'Passwords do not match.';
  }

  return errors;
}

// --- Signup ---

export function signup({ fullname, username, email, password }) {
  const accounts = getAccounts();

  const newAccount = {
    fullname: fullname.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: 'client',
    avatar: '',
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  return newAccount;
}

// --- Login ---

export function login(email, password, expectedRole) {
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (expectedRole === 'owner') {
    const owner = getOwnerAccount();

    if (
      trimmedEmail === owner.email.toLowerCase() &&
      password === owner.password
    ) {
      return {
        success: true,
        user: setSession(owner),
      };
    }

    return {
      success: false,
      error: 'Invalid owner email or password.',
    };
  }

  const match = getAccounts().find(
    (account) =>
      account.email.toLowerCase() === trimmedEmail &&
      account.password === password &&
      account.role === 'client'
  );

  if (match) {
    return {
      success: true,
      user: setSession(match),
    };
  }

  return {
    success: false,
    error: 'Invalid email or password.',
  };
}

// --- Keep client data when a client changes their name ---

function renameClientData(oldName, newName) {
  const bookings = JSON.parse(
    localStorage.getItem('mmb_bookings') || '[]'
  );

  localStorage.setItem(
    'mmb_bookings',
    JSON.stringify(
      bookings.map((booking) =>
        booking.client === oldName
          ? { ...booking, client: newName }
          : booking
      )
    )
  );

  const threads = JSON.parse(
    localStorage.getItem('mmb_messages') || '{}'
  );

  if (threads[oldName]) {
    threads[newName] = [
      ...(threads[newName] || []),
      ...threads[oldName],
    ];

    delete threads[oldName];

    localStorage.setItem('mmb_messages', JSON.stringify(threads));
  }

  const notifications = JSON.parse(
    localStorage.getItem('mmb_notifications') || '[]'
  );

  localStorage.setItem(
    'mmb_notifications',
    JSON.stringify(
      notifications.map((notification) =>
        notification.to === oldName
          ? { ...notification, to: newName }
          : notification
      )
    )
  );

  const settings = JSON.parse(
    localStorage.getItem('mmb_settings') || '{}'
  );

  if (settings[oldName]) {
    settings[newName] = settings[oldName];
    delete settings[oldName];

    localStorage.setItem('mmb_settings', JSON.stringify(settings));
  }
}

// --- Update Profile ---

export function updateProfile(updates) {
  const current = getCurrentUser();

  if (!current) {
    return null;
  }

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

  const accounts = getAccounts().map((account) =>
    account.email === current.email
      ? { ...account, ...patch }
      : account
  );

  saveAccounts(accounts);

  if (patch.fullname !== current.fullname) {
    renameClientData(current.fullname, patch.fullname);
  }

  const updatedAccount = accounts.find(
    (account) => account.email === patch.email
  );

  if (!updatedAccount) {
    return null;
  }

  return setSession(updatedAccount);
}

// --- Change Password for a logged-in user ---

export function changePassword(currentPassword, newPassword) {
  const current = getCurrentUser();

  if (!current) {
    return {
      success: false,
      error: 'You are not logged in.',
    };
  }

  const passwordMessage = passwordError(newPassword);

  if (passwordMessage) {
    return {
      success: false,
      error: passwordMessage,
    };
  }

  if (current.role === 'owner') {
    if (getOwnerAccount().password !== currentPassword) {
      return {
        success: false,
        error: 'Current password is incorrect.',
      };
    }

    saveOwnerOverrides({ password: newPassword });

    return { success: true };
  }

  const accounts = getAccounts();

  const account = accounts.find(
    (item) => item.email === current.email
  );

  if (!account || account.password !== currentPassword) {
    return {
      success: false,
      error: 'Current password is incorrect.',
    };
  }

  saveAccounts(
    accounts.map((item) =>
      item.email === current.email
        ? { ...item, password: newPassword }
        : item
    )
  );

  return { success: true };
}

// --- Forgot Password / Reset Password ---

export function resetPassword(
  email,
  role,
  newPassword,
  confirmPassword
) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      success: false,
      error: 'Please enter your email address.',
    };
  }

  const passwordErrors = validateNewPassword(
    newPassword,
    confirmPassword
  );

  if (passwordErrors.next) {
    return {
      success: false,
      error: passwordErrors.next,
    };
  }

  if (passwordErrors.confirm) {
    return {
      success: false,
      error: passwordErrors.confirm,
    };
  }

  if (role === 'owner') {
    const owner = getOwnerAccount();

    if (
      normalizedEmail !== owner.email.trim().toLowerCase()
    ) {
      return {
        success: false,
        error: 'No owner account was found with that email.',
      };
    }

    saveOwnerOverrides({ password: newPassword });

    return {
      success: true,
      message: 'Password reset successfully! You can now log in.',
    };
  }

  const accounts = getAccounts();

  const accountExists = accounts.some(
    (account) =>
      account.email.trim().toLowerCase() === normalizedEmail &&
      account.role === 'client'
  );

  if (!accountExists) {
    return {
      success: false,
      error: 'No client account was found with that email.',
    };
  }

  saveAccounts(
    accounts.map((account) =>
      account.email.trim().toLowerCase() === normalizedEmail &&
      account.role === 'client'
        ? { ...account, password: newPassword }
        : account
    )
  );

  return {
    success: true,
    message: 'Password reset successfully! You can now log in.',
  };
}

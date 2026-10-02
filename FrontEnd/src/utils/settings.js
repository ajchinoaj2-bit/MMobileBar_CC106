const KEY = 'mmb_settings';
const read = () => JSON.parse(localStorage.getItem(KEY) || '{}');

export function getSettings(recipient) {
  return { notificationsEnabled: true, ...(read()[recipient] || {}) };
}

export function saveSettings(recipient, updates) {
  const all = read();
  all[recipient] = { ...getSettings(recipient), ...updates };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export const isNotificationsEnabled = (recipient) =>
  getSettings(recipient).notificationsEnabled;
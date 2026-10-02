const KEYS = ['mmb_bookings', 'mmb_packages', 'mmb_messages', 'mmb_notifications'];
const LAST_KEY = 'mmb_last_backup';

export function getLastBackup() {
  return localStorage.getItem(LAST_KEY);
}

export function createBackup() {
  const data = {};
  KEYS.forEach((k) => {
    data[k] = localStorage.getItem(k);
  });

  const payload = {
    app: 'mmobilebar-backup',
    version: 1,
    createdAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mmobilebar-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  const now = new Date().toLocaleString();
  localStorage.setItem(LAST_KEY, now);
  return now;
}

export function restoreBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.app !== 'mmobilebar-backup' || !parsed.data) throw new Error();
        KEYS.forEach((k) => {
          if (parsed.data[k] === null || parsed.data[k] === undefined) {
            localStorage.removeItem(k);
          } else {
            localStorage.setItem(k, parsed.data[k]);
          }
        });
        resolve();
      } catch {
        reject(new Error('That file is not a valid M Mobile Bar backup.'));
      }
    };
    reader.readAsText(file);
  });
}
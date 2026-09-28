const KEY = 'mmb_notifications';
const read = () => JSON.parse(localStorage.getItem(KEY) || '[]');
const write = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('mmb_notif_change'));
};

export function addNotification({ to, title, body, link }) {
  write([{ id: Date.now() + Math.random(), to, title, body, link,
           time: new Date().toISOString(), read: false }, ...read()]);
}
export const getNotifications = (to) => read().filter((n) => n.to === to);
export function markRead(id) {
  write(read().map((n) => (n.id === id ? { ...n, read: true } : n)));
}
export function markAllRead(to) {
  write(read().map((n) => (n.to === to ? { ...n, read: true } : n)));
}
export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
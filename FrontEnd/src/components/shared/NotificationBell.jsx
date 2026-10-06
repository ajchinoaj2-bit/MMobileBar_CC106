import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { getNotifications, markRead, markAllRead, timeAgo } from '../../utils/notifications';

export default function NotificationBell({ recipient }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setItems(getNotifications(recipient));
    refresh();
    window.addEventListener('mmb_notif_change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('mmb_notif_change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [recipient]);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center text-charcoal-500 hover:text-forest-700 text-lg transition-colors"
      >
        <FaBell />
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border border-brass-100 z-50">
          <div className="flex justify-between items-center p-3 border-b border-brass-100 text-sm">
            <span className="font-semibold text-charcoal-800">Notifications</span>
            <button onClick={() => markAllRead(recipient)} className="text-xs text-forest-700 hover:text-brass-600">
              Mark all read
            </button>
          </div>
          {items.length === 0 && <p className="p-4 text-sm text-charcoal-500">No notifications yet.</p>}
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => { markRead(n.id); setOpen(false); if (n.link) navigate(n.link); }}
              className={`w-full text-left p-3 border-b border-gray-100 last:border-0 hover:bg-ivory-50 transition-colors ${n.read ? '' : 'bg-brass-100/40'}`}
            >
              <p className="text-sm font-medium text-charcoal-800">{n.title}</p>
              <p className="text-xs text-charcoal-500">{n.body}</p>
              <p className="text-[10px] text-charcoal-500/70">{timeAgo(n.time)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
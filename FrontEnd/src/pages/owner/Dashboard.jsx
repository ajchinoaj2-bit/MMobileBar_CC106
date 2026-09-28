import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { getBookings } from '../../utils/bookings';
import { getNotifications, markRead, timeAgo } from '../../utils/notifications';

const STATUS_COLORS = {
  Approved: '#15803d',
  Pending: '#eab308',
  Declined: '#dc2626',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const refresh = () => {
      setBookings(getBookings());
      setNotifications(getNotifications('owner').slice(0, 4));
    };
    refresh();
    window.addEventListener('mmb_notif_change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('mmb_notif_change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const totalBookings = bookings.length;
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const pendingApprovals = bookings.filter((b) => b.status === 'Pending').length;
  const activeBookings = bookings.filter((b) => b.status === 'Approved').length;

  const stats = [
    { label: 'Total Bookings', value: totalBookings.toLocaleString(), note: 'All-time' },
    { label: 'Total Earnings', value: `₱${totalEarnings.toLocaleString()}`, note: 'All-time' },
    { label: 'Pending Approvals', value: pendingApprovals.toString(), note: 'Requires action', alert: true },
    { label: 'Active Bookings', value: activeBookings.toString(), note: 'Approved' },
  ];

  // Payment Status Overview — count of bookings per status
  const statusCounts = ['Approved', 'Pending', 'Declined'].map((status) => ({
    name: status,
    value: bookings.filter((b) => b.status === status).length,
  })).filter((s) => s.value > 0);

  // Bookings Over Time — group by month of submission
  const monthCounts = {};
  bookings.forEach((b) => {
    if (!b.submitted) return;
    const parsed = new Date(b.submitted);
    if (isNaN(parsed)) return;
    const key = `${MONTH_NAMES[parsed.getMonth()]} ${parsed.getFullYear()}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const bookingsOverTime = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-18">
        {stats.map((s) => (
         <div key={s.label} className="bg-[#15803d] text-white rounded-lg p-4" >
            <p className="text-sm opacity-90">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className={`text-xs mt-1 ${s.alert ? 'text-[#FFFFFF]' : 'opacity-80'}`}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* Payment status + Notifications */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Payment Status Overview</h2>
            <button className="text-xs text-green-700">Export</button>
          </div>
          {statusCounts.length === 0 ? (
            <div className="h-40 flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded">
              No bookings yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusCounts.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Notifications</h2>
            {notifications.some((n) => !n.read) && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">New</span>
            )}
          </div>
          {notifications.length === 0 && (
            <p className="text-sm text-gray-400">No notifications yet.</p>
          )}
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="text-sm border-b pb-2 last:border-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className={`font-medium ${n.read ? '' : 'text-green-800'}`}>{n.title}</p>
                    <p className="text-gray-500 text-xs">{n.body}</p>
                    <p className="text-gray-400 text-[10px]">{timeAgo(n.time)}</p>
                  </div>
                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={() => markRead(n.id)}
                      className="shrink-0 text-xs bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800"
                    >
                      View
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bookings over time */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3">Bookings Over Time</h2>
        {bookingsOverTime.length === 0 ? (
          <div className="h-32 flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded">
            No bookings yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bookingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#15803d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
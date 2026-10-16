
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { getBookings } from '../../utils/bookings';
import {
  getNotifications,
  markRead,
  timeAgo,
} from '../../utils/notifications';

const STATUS_COLORS = {
  Approved: '#2a4d38',
  Pending: '#c9a961',
  Declined: '#b23b3b',
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

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

  const totalEarnings = bookings.reduce(
    (sum, b) => sum + (b.price || 0),
    0
  );

  const pendingApprovals = bookings.filter(
    (b) => b.status === 'Pending'
  ).length;

  const activeBookings = bookings.filter(
    (b) => b.status === 'Approved'
  ).length;

  const stats = [
    {
      label: 'Total Bookings',
      value: totalBookings.toLocaleString(),
      note: 'All-time',
    },
    {
      label: 'Total Earnings',
      value: `₱${totalEarnings.toLocaleString()}`,
      note: 'All-time',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals.toString(),
      note: 'Requires action',
      alert: true,
    },
    {
      label: 'Active Bookings',
      value: activeBookings.toString(),
      note: 'Approved',
    },
  ];

  const statusCounts = ['Approved', 'Pending', 'Declined']
    .map((status) => ({
      name: status,
      value: bookings.filter((b) => b.status === status).length,
    }))
    .filter((s) => s.value > 0);

  const totalForStatus = statusCounts.reduce(
    (sum, s) => sum + s.value,
    0
  );

  const monthCounts = {};

  bookings.forEach((b) => {
    if (!b.submitted) return;

    const parsed = new Date(b.submitted);
    if (isNaN(parsed)) return;

    const key = `${MONTH_NAMES[parsed.getMonth()]} ${parsed.getFullYear()}`;

    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });

  const bookingsOverTime = Object.entries(monthCounts).map(
    ([month, count]) => ({ month, count })
  );

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-12 lg:mb-18">
        {stats.map((s) => (
          <div
            key={s.label}
            className="min-w-0 bg-gradient-to-br from-bottle-900 to-forest-700 text-ivory-50 rounded-lg p-3 sm:p-4"
          >
            <p className="text-xs sm:text-sm text-ivory-100/70 leading-snug">
              {s.label}
            </p>

            <p className="text-lg sm:text-2xl font-display font-semibold mt-2 text-brass-400 break-words [overflow-wrap:anywhere]">
              {s.value}
            </p>

            <p
              className={`text-[10px] sm:text-xs mt-1 leading-snug ${
                s.alert
                  ? 'text-brass-300'
                  : 'text-ivory-100/60'
              }`}
            >
              {s.note}
            </p>
          </div>
        ))}
      </div>

      {/* Payment Status + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Payment Status Overview */}
        <div className="min-w-0 bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <h2 className="font-display font-semibold text-bottle-900 text-sm sm:text-base">
              Payment Status Overview
            </h2>

            <button
              type="button"
              className="text-xs text-forest-700 hover:text-brass-600"
            >
              Export
            </button>
          </div>

          {statusCounts.length === 0 ? (
            <div className="h-40 flex items-center justify-center bg-ivory-50 text-charcoal-500 text-sm rounded">
              No bookings yet.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Pie Chart */}
              <div className="relative w-36 h-36 sm:w-36 sm:h-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={64}
                      paddingAngle={statusCounts.length > 1 ? 3 : 0}
                      stroke="none"
                    >
                      {statusCounts.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display text-2xl font-semibold text-bottle-900">
                    {totalForStatus}
                  </span>

                  <span className="text-[10px] text-charcoal-500 tracking-wide">
                    Bookings
                  </span>
                </div>
              </div>

              {/* Status Legend */}
              <div className="w-full min-w-0 flex-1 space-y-3">
                {statusCounts.map((s) => {
                  const pct = Math.round(
                    (s.value / totalForStatus) * 100
                  );

                  return (
                    <div key={s.name}>
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm mb-1">
                        <span className="flex items-center gap-2 text-charcoal-800 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{
                              backgroundColor: STATUS_COLORS[s.name],
                            }}
                          />

                          <span>{s.name}</span>
                        </span>

                        <span className="text-charcoal-500 shrink-0">
                          {s.value} · {pct}%
                        </span>
                      </div>

                      <div className="h-1.5 bg-ivory-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: STATUS_COLORS[s.name],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="min-w-0 bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <h2 className="font-display font-semibold text-bottle-900 text-sm sm:text-base">
              Recent Notifications
            </h2>

            {notifications.some((n) => !n.read) && (
              <span className="text-xs bg-brass-500 text-bottle-900 font-medium px-2 py-0.5 rounded">
                New
              </span>
            )}
          </div>

          {notifications.length === 0 && (
            <p className="text-sm text-charcoal-500">
              No notifications yet.
            </p>
          )}

          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="text-sm border-b border-brass-100 pb-2 last:border-0"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-medium break-words ${
                        n.read
                          ? 'text-charcoal-800'
                          : 'text-forest-700'
                      }`}
                    >
                      {n.title}
                    </p>

                    <p className="text-charcoal-500 text-xs mt-1 break-words">
                      {n.body}
                    </p>

                    <p className="text-charcoal-500/70 text-[10px] mt-1">
                      {timeAgo(n.time)}
                    </p>
                  </div>

                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={() => markRead(n.id)}
                      className="shrink-0 text-xs bg-brass-500 text-bottle-900 font-medium px-2 py-1 rounded hover:bg-brass-600 transition-colors"
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

      {/* Bookings Over Time */}
      <div className="min-w-0 bg-white rounded-lg shadow p-3 sm:p-4">
        <h2 className="font-display font-semibold text-bottle-900 text-sm sm:text-base mb-3">
          Bookings Over Time
        </h2>

        {bookingsOverTime.length === 0 ? (
          <div className="h-32 flex items-center justify-center bg-ivory-50 text-charcoal-500 text-sm rounded">
            No bookings yet.
          </div>
        ) : (
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={bookingsOverTime}
                margin={{
                  top: 5,
                  right: 8,
                  left: -18,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eee"
                />

                <XAxis
                  dataKey="month"
                  fontSize={11}
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />

                <YAxis
                  allowDecimals={false}
                  fontSize={11}
                  width={35}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#c9a961"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}


import { useEffect, useState } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getBookings } from '../../utils/bookings';

const statusColor = {
  Approved: 'bg-forest-700/10 text-forest-700',
  Pending: 'bg-brass-100 text-brass-600',
  Declined: 'bg-red-50 text-red-600',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesTab =
      tab === 'all' || (b.status || '').toLowerCase() === tab;

    const matchesSearch = (b.client || '')
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full min-w-0 max-w-full">
      {/* Calendar and History Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-2 mb-1">
        <div />

        <div className="grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto">
          <Link
            to="/owner/bookings/calendar"
            className="w-full sm:w-auto justify-center border border-brass-400/60 text-forest-700 px-3 py-2 rounded flex items-center gap-2 text-sm hover:bg-brass-100 transition-colors"
          >
            <FaCalendarAlt />
            Calendar/Schedule
          </Link>

          <Link
            to="/owner/bookings/history"
            className="w-full sm:w-auto text-center bg-brass-500 text-bottle-900 font-medium px-3 py-2 rounded text-sm hover:bg-brass-600 transition-colors"
          >
            Booking History
          </Link>
        </div>
      </div>

      {/* Search and Status Tabs */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 my-6 md:my-15">
        <div className="relative w-full sm:w-150 sm:max-w-full min-w-0">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500 text-sm" />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 pl-9 pr-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-brass-500"
          />
        </div>

        <div className="grid grid-cols-3 sm:flex gap-2 sm:gap-4 text-sm w-full sm:w-auto">
          {['all', 'approved', 'pending'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`min-w-0 px-2 sm:px-3 sm:w-24 py-2 sm:py-1 rounded-full capitalize text-center transition-colors ${
                tab === t
                  ? 'bg-brass-500 text-bottle-900 font-medium'
                  : 'bg-gray-100 text-charcoal-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE: Booking Cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-charcoal-500 text-sm">
            No bookings found.
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 min-w-0"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-charcoal-500 mb-1">
                    Client Name
                  </p>
                  <p className="font-semibold text-bottle-900 text-sm break-words">
                    {b.client || '—'}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
                    statusColor[b.status] ||
                    'bg-gray-100 text-gray-600'
                  }`}
                >
                  {b.status || 'Unknown'}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-x-3 gap-y-4">
                <div className="min-w-0">
                  <p className="text-xs text-charcoal-500 mb-1">
                    Event Name
                  </p>
                  <p className="text-sm text-charcoal-800 break-words">
                    {b.event || '—'}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-charcoal-500 mb-1">
                    Date
                  </p>
                  <p className="text-sm text-charcoal-800 break-words">
                    {b.date || '—'}
                  </p>
                </div>

                <div className="min-w-0 col-span-2">
                  <p className="text-xs text-charcoal-500 mb-1">
                    Package
                  </p>
                  <p className="text-sm text-charcoal-800 break-words">
                    {b.package || '—'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3">
                <Link
                  to={`/owner/bookings/${b.id}`}
                  className="block w-full text-center bg-brass-500 text-bottle-900 font-medium text-sm px-3 py-2 rounded hover:bg-brass-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP: Original Booking Table */}
      <div className="hidden sm:block w-full min-w-0 max-w-full bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-ivory-50 text-charcoal-500 text-left">
            <tr>
              <th className="px-4 py-3">Client Name</th>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-charcoal-500"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-charcoal-800">
                    {b.client || '—'}
                  </td>

                  <td className="px-4 py-3 text-charcoal-800">
                    {b.event || '—'}
                  </td>

                  <td className="px-4 py-3 text-charcoal-800">
                    {b.date || '—'}
                  </td>

                  <td className="px-4 py-3 text-charcoal-800">
                    {b.package || '—'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        statusColor[b.status] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {b.status || 'Unknown'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/owner/bookings/${b.id}`}
                      className="text-forest-700 hover:text-brass-600 text-xs underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

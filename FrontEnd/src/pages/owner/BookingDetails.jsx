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
    const matchesTab = tab === 'all' || b.status.toLowerCase() === tab;
    const matchesSearch = (b.client || '').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div></div>
        <div className="flex gap-2">
          <Link
            to="/owner/bookings/calendar"
            className="border border-brass-400/60 text-forest-700 px-3 py-2 rounded flex items-center gap-2 text-sm hover:bg-brass-100 transition-colors"
          >
            <FaCalendarAlt /> Calendar/Schedule
          </Link>
          <Link
            to="/owner/bookings/history"
            className="bg-brass-500 text-bottle-900 font-medium px-3 py-2 rounded text-sm hover:bg-brass-600 transition-colors"
          >
            Booking History
          </Link>
        </div>
      </div>

      {/* Search + tabs */}
      <div className="flex justify-between items-center my-15">
        <div className="relative w-150">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500 text-sm" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-brass-500"
          />
        </div>
        <div className="flex gap-4 text-sm">
          {['all', 'approved', 'pending'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-24 py-1 rounded-full capitalize text-center transition-colors ${
                tab === t ? 'bg-brass-500 text-bottle-900 font-medium' : 'bg-gray-100 text-charcoal-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-ivory-50 text-charcoal-500 text-left">
            <tr>
              <th className="px-4 py-3 w-1/6">Client Name</th>
              <th className="px-4 py-3 w-1/6">Event Name</th>
              <th className="px-4 py-3 w-1/6">Date</th>
              <th className="px-4 py-3 w-1/6">Package</th>
              <th className="px-4 py-3 w-1/6">Status</th>
              <th className="px-4 py-3 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-charcoal-500">
                  No bookings yet.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-charcoal-800">{b.client}</td>
                  <td className="px-4 py-3 text-charcoal-800">{b.event || '—'}</td>
                  <td className="px-4 py-3 text-charcoal-800">{b.date || '—'}</td>
                  <td className="px-4 py-3 text-charcoal-800">{b.package}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/owner/bookings/${b.id}`} className="text-forest-700 hover:text-brass-600 text-xs underline">
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
import { useEffect, useState } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getBookings } from '../../utils/bookings';

const statusColor = {
  Approved: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Declined: 'bg-red-100 text-red-700',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('all'); // 'all' | 'approved' | 'pending'
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
          <Link to="/owner/bookings/calendar" className="border px-3 py-2 rounded flex items-center gap-2 text-sm">
            <FaCalendarAlt /> Calendar/Schedule
          </Link>
          <Link to="/owner/bookings/history" className="bg-green-700 text-white px-3 py-2 rounded text-sm">
            Booking History
          </Link>
        </div>
      </div>

      {/* Search + tabs */}
      <div className="flex justify-between items-center my-15">
        <div className="relative w-150">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded text-sm"
          />
        </div>
        <div className="flex gap-4 text-sm">
          {['all', 'approved', 'pending'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-24 py-1 rounded-full capitalize text-center ${
                tab === t ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'
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
          <thead className="bg-gray-50 text-gray-500 text-left">
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
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No bookings yet.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3">{b.client}</td>
                  <td className="px-4 py-3">{b.event || '—'}</td>
                  <td className="px-4 py-3">{b.date || '—'}</td>
                  <td className="px-4 py-3">{b.package}</td>
                  <td className="px-4 py-3">
                    <span className={`px-4 py-3 rounded text-xs ${statusColor[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/owner/bookings/${b.id}`} className="text-green-700 text-xs underline">View Details</Link>
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
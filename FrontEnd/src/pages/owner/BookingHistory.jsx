import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookings } from '../../utils/bookings';

const statusStyle = {
  Completed: { dot: 'bg-green-500', text: 'text-green-700' },
  Cancelled: { dot: 'bg-red-500', text: 'text-red-600' },
};

export default function BookingHistory() {
  const [clientFilter, setClientFilter] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const history = bookings
    .filter((b) => b.status === 'Approved' || b.status === 'Declined')
    .map((b) => ({
      id: b.id,
      event: b.event || 'Untitled Event',
      client: b.client,
      date: b.form?.eventDate || '—',
      time: b.form?.eventTime || '—',
      revenue: b.status === 'Approved' ? `₱${(b.price || 0).toLocaleString()}.00` : '₱0.00',
      status: b.status === 'Approved' ? 'Completed' : 'Cancelled',
    }));

  const filtered = history.filter((h) =>
    (h.client || '').toLowerCase().includes(clientFilter.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filter by Client"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <select className="border rounded px-3 py-2 text-sm">
            <option>All Dates</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Event / Client</th>
              <th className="px-4 py-3">Date / Time</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No booking history yet.
                </td>
              </tr>
            ) : (
              filtered.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusStyle[h.status].dot}`} />
                      <span className={statusStyle[h.status].text}>{h.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{h.event}</p>
                    <p className="text-gray-400 text-xs">{h.client}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{h.date}</p>
                    <p className="text-gray-400 text-xs">{h.time}</p>
                  </td>
                  <td className="px-4 py-3">{h.revenue}</td>
                  <td className="px-4 py-3">
                    <Link to={`/owner/bookings/${h.id}`} className="text-green-700 text-xs underline">
                      {h.status === 'Cancelled' ? 'Details' : 'View Summary'}
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
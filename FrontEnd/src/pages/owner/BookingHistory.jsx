import { useState } from 'react';
import { Link } from 'react-router-dom';

const history = [
  { id: 1, event: 'Corporate Mixer', client: 'Acme Corp / John Smith', date: 'Oct 15, 2023', time: '6:00 PM - 10:00 PM', revenue: '₱1,250.00', status: 'Completed' },
  { id: 2, event: 'Wedding Reception', client: 'Sarah & James', date: 'Sep 28, 2023', time: '4:00 PM - 9:00 PM', revenue: '₱0.00', status: 'Cancelled' },
  { id: 3, event: 'Birthday Bash 40th', client: 'Mike Johnson', date: 'Sep 12, 2023', time: '8:00 PM - 12:00 AM', revenue: '₱850.00', status: 'Completed' },
  { id: 4, event: 'Summer Festival VIP', client: 'City Events Co.', date: 'Aug 06, 2023', time: '12:00 PM - 8:00 PM', revenue: '₱3,400.00', status: 'Completed' },
];

const statusStyle = {
  Completed: { dot: 'bg-green-500', text: 'text-green-700' },
  Cancelled: { dot: 'bg-red-500', text: 'text-red-600' },
};

export default function BookingHistory() {
  const [clientFilter, setClientFilter] = useState('');

  const filtered = history.filter((h) =>
    h.client.toLowerCase().includes(clientFilter.toLowerCase())
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
            {filtered.map((h) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
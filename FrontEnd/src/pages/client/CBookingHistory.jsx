import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings } from '../../utils/bookings';

const statusStyle = {
  Pending: { badge: 'bg-yellow-100 text-yellow-700', dateBg: 'bg-yellow-600' },
  Approved: { badge: 'bg-green-100 text-green-700', dateBg: 'bg-green-700' },
  Rejected: { badge: 'bg-red-100 text-red-600', dateBg: 'bg-red-600' },
  Completed: { badge: 'bg-green-100 text-green-700', dateBg: 'bg-green-700' },
};

const tabs = ['Pending', 'Approved', 'Rejected', 'Completed'];

function parseDateParts(dateStr) {
  if (!dateStr) return { month: '—', day: '—', year: '—' };
  const [year, month, day] = dateStr.split('-');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return { month: monthNames[Number(month) - 1] || '—', day: Number(day), year };
}

function isPastDate(dateStr) {
  if (!dateStr) return false;
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
}

export default function CBookingHistory() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const all = getBookings();
    const mine = currentUser ? all.filter((b) => b.client === currentUser.fullname) : all;
    setBookings(mine);
  }, []);

  const mapped = bookings.map((b) => {
    const eventPassed = isPastDate(b.form?.eventDate);
    const displayStatus =
      b.status === 'Declined' ? 'Rejected' :
      b.status === 'Approved' && eventPassed ? 'Completed' :
      b.status;

    return {
      id: b.id,
      event: b.event || 'Untitled Event',
      package: b.package,
      date: parseDateParts(b.form?.eventDate),
      status: displayStatus,
      statusNote:
        displayStatus === 'Pending' ? 'Pending Confirmation' :
        displayStatus === 'Approved' ? 'Approved — Upcoming' :
        displayStatus === 'Rejected' ? 'Rejected' :
        displayStatus === 'Completed' ? 'Event Completed' : displayStatus,
      created: b.submitted,
    };
  });

  const filtered = mapped.filter((b) => b.status === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'bg-green-700 text-white rounded-t'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm">No {activeTab.toLowerCase()} bookings.</p>
        )}

        {filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className={`${statusStyle[b.status].dateBg} text-white rounded-lg text-center px-3 py-2 w-16`}>
              <p className="text-[10px] font-bold">{b.date.month}</p>
              <p className="text-xl font-bold leading-none">{b.date.day}</p>
              <p className="text-[10px]">{b.date.year}</p>
            </div>

            <div className="flex-1">
              <p className="font-semibold text-sm">{b.event}</p>
              <p className="text-xs text-gray-500">{b.package}</p>
              <p className="text-xs text-gray-400">{b.statusNote}</p>
            </div>

            <span className={`text-xs px-2 py-1 rounded ${statusStyle[b.status].badge}`}>
              {b.status.toUpperCase()}
            </span>

            <div className="text-right">
              <button
                onClick={() => navigate(`/client/booking-history/${b.id}`)}
                className="bg-green-700 text-white text-xs px-4 py-2 rounded hover:bg-green-800"
              >
                View Details
              </button>
              <p className="text-[10px] text-gray-400 mt-1">Created {b.created}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4 flex justify-between items-center text-xs">
        <span className="text-green-800">Need Help? If you have any question regarding your booking please contact our support team.</span>
        <button className="border border-green-600 text-green-700 px-3 py-1 rounded">Contact Support</button>
      </div>
    </div>
  );
}
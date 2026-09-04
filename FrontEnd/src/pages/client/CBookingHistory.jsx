import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const bookings = [
  { id: 1, event: 'Corporate Mixer', package: 'Platinum Package', date: { month: 'OCT', day: 24, year: 2025 }, status: 'Pending', statusNote: 'Pending Confirmation', created: 'May 20, 2025' },
  { id: 2, event: 'Wedding Reception', package: 'Custom Cocktail Menu', date: { month: 'NOV', day: 12, year: 2025 }, status: 'Pending', statusNote: 'Pending Review', created: 'May 18, 2025' },
  { id: 3, event: 'Holiday Party', package: 'Gold Package', date: { month: 'DEC', day: 5, year: 2025 }, status: 'Pending', statusNote: 'Pending Deposit', created: 'May 15, 2025' },
  { id: 4, event: 'Corporate Mixer', package: 'Platinum Package', date: { month: 'OCT', day: 30, year: 2025 }, status: 'Approved', statusNote: 'Approved', created: 'May 20, 2025' },
  { id: 5, event: 'Birthday Celebration', package: 'Platinum Package', date: { month: 'OCT', day: 10, year: 2025 }, status: 'Rejected', statusNote: 'Rejected', created: 'May 10, 2025' },
  { id: 6, event: 'Product Launch', package: 'Platinum Package', date: { month: 'OCT', day: 24, year: 2025 }, status: 'Completed', statusNote: 'Completed', created: 'May 20, 2025' },
];

const statusStyle = {
  Pending: { badge: 'bg-yellow-100 text-yellow-700', dateBg: 'bg-yellow-600' },
  Approved: { badge: 'bg-green-100 text-green-700', dateBg: 'bg-green-700' },
  Rejected: { badge: 'bg-red-100 text-red-600', dateBg: 'bg-red-600' },
  Completed: { badge: 'bg-green-100 text-green-700', dateBg: 'bg-green-700' },
};

const tabs = ['Pending', 'Approved', 'Rejected', 'Completed'];

export default function CBookingHistory() {
  const [activeTab, setActiveTab] = useState('Pending');
  const navigate = useNavigate();

  const filtered = bookings.filter((b) => b.status === activeTab);

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
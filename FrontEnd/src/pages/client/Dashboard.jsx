import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings } from '../../utils/bookings';

const packages = [
  {
    id: 1,
    name: 'The Classic Pour (Package 1)',
    desc: 'Standard mobile bar setup perfect for small to medium gathering. Includes basic mixers and garnishes.',
  },
  {
    id: 2,
    name: 'Premium Mixology (Package 2)',
    desc: 'Elevate your event with signature cocktails crafted by our expert mixologists.',
  },
];

function getStepsForStatus(status) {
  if (status === 'Approved') {
    return [
      { label: 'Request Submitted', done: true },
      { label: 'Deposit Pending', done: true },
      { label: 'Menu Finalization', done: true, active: true },
      { label: 'Ready for Event', done: false },
    ];
  }
  if (status === 'Declined') {
    return [
      { label: 'Request Submitted', done: true },
      { label: 'Booking Declined', done: true, active: true },
    ];
  }
  return [
    { label: 'Request Submitted', done: true },
    { label: 'Deposit Pending', done: true, active: true },
    { label: 'Menu Finalization', done: false },
    { label: 'Ready for Event', done: false },
  ];
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const allBookings = getBookings();

    const myBookings = currentUser
      ? allBookings.filter((b) => b.client === currentUser.fullname)
      : allBookings;

    setLatestBooking(myBookings[myBookings.length - 1] || null);
  }, []);

  const bookingSteps = latestBooking ? getStepsForStatus(latestBooking.status) : [];

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-8 mt-1">
        {/* Available Packages */}
        <div className="col-span-2">
          <h2 className="font-display text-xl font-semibold text-bottle-900 mb-10 border-b border-brass-200 pb-3">
            Available Packages
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <div className="bg-gradient-to-br from-bottle-900 to-forest-700 h-40 flex items-center justify-center">
                  <span className="font-display text-ivory-50/40 text-sm">M Mobile Bar</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-base text-bottle-900">{pkg.name}</h3>
                  <p className="text-charcoal-500 text-sm mt-2 mb-4 flex-1">{pkg.desc}</p>
                  <button
                    onClick={() => navigate('/client/package')}
                    className="w-full bg-brass-500 text-bottle-900 font-medium text-sm py-2.5 rounded hover:bg-brass-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Booking + Status */}
        <div className="space-y-6 mt-20">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display text-lg font-semibold text-bottle-900 mb-3">Upcoming Booking</h2>
            {latestBooking ? (
              <>
                <p className="text-sm text-forest-700 font-medium">{latestBooking.date || '—'}</p>
                <p className="text-base font-semibold mt-1 text-charcoal-800">{latestBooking.event || 'Untitled Event'}</p>
                <p className="text-sm text-charcoal-500 mb-3">{latestBooking.package}</p>
                <div className="flex justify-between items-center text-sm text-charcoal-500">
                  <span>ID: #B-{latestBooking.id}</span>
                  <button
                    onClick={() => navigate('/client/booking-history')}
                    className="text-forest-700 hover:text-brass-600 underline"
                  >
                    Manage
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-charcoal-500">No bookings yet. Browse a package to get started.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display text-lg font-semibold text-bottle-900 mb-4">Booking Status</h2>
            {bookingSteps.length > 0 ? (
              <div className="space-y-4">
                {bookingSteps.map((step) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        step.done
                          ? 'bg-forest-700 border-forest-700'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                    <span
                      className={`text-base ${
                        step.active ? 'font-semibold text-bottle-900' : step.done ? 'text-charcoal-800' : 'text-charcoal-500/60'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-500">No active booking to track.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
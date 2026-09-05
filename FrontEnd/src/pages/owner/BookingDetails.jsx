import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const bookingData = {
  1: {
    bookingId: 'BK-8492',
    status: 'Pending Approval',
    submitted: 'Oct 24, 2023',
    client: { name: 'Sarah Jenkins', contact: '(555) 123-4567', email: 'sarah.j@example.com' },
    notes: 'We are expecting a lot of guests who prefer mocktails, so please ensure there are plenty of non-alcoholic options available. Looking forward to it!',
    event: {
      type: 'Corporate Mixer',
      date: 'November 15, 2023 | 6:00 PM - 10:00 PM',
      guestCount: 150,
      venue: 'The Grand Atrium, 123 Event Space Blvd, Suite 300, Cityville, ST 12345',
    },
    package: { name: 'Premium Open Bar Package', price: '₱1,500.00', desc: 'Includes 4 hours of service, 3 bartenders, standard mixers, and glassware.' },
    payment: { depositStatus: 'Paid' },
  },
};

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookingData[id];

  if (!booking) {
    return (
      <div>
        <p className="text-gray-500 text-sm">Booking not found.</p>
        <Link to="/owner/bookings" className="text-green-700 text-sm underline">Back to Bookings</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-green-700">Booking #{booking.bookingId}</h1>
          <p className="text-gray-500 text-sm">
            {booking.status} - Submitted {booking.submitted}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm border rounded px-3 py-2 hover:bg-gray-50"
        >
          <FaArrowLeft /> BACK
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Client Information</h2>
            <div className="grid grid-cols-2 text-sm gap-2">
              <div>
                <p className="text-gray-400 text-xs">Name</p>
                <p>{booking.client.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Contact</p>
                <p>{booking.client.contact}</p>
                <p className="text-gray-400 text-xs">{booking.client.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-400 text-xs mb-1">Notes from Client</p>
              <p className="text-sm bg-gray-50 rounded p-3 italic">"{booking.notes}"</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Event Information</h2>
            <div className="grid grid-cols-2 text-sm gap-2">
              <div>
                <p className="text-gray-400 text-xs">Event Type & Date</p>
                <p>{booking.event.type}</p>
                <p className="text-gray-500 text-xs">{booking.event.date}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Guest Count</p>
                <p>{booking.event.guestCount} Attendees</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-400 text-xs">Venue Location</p>
              <p className="text-sm">{booking.event.venue}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Selected Package & Add-ons</h2>
            <div className="flex justify-between items-start bg-gray-50 rounded p-3">
              <div>
                <p className="font-medium text-sm">{booking.package.name}</p>
                <p className="text-gray-500 text-xs mt-1">{booking.package.desc}</p>
              </div>
              <p className="font-semibold text-sm">{booking.package.price}</p>
            </div>
          </div>
        </div>

        {/* Right: payment + actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Payment Status</h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400 text-xs">Deposit Status</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                {booking.payment.depositStatus}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-2">Proof of Transfer</p>
            <div className="border rounded h-40 flex items-center justify-center text-gray-300 text-xs mb-3">
              Payment receipt image
            </div>
            <button className="w-full border rounded py-2 text-sm mb-2 hover:bg-gray-50">
              Request Re-upload
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Booking Status</h2>
            <div className="text-sm space-y-1 mb-4">
              <p><span className="text-gray-400 text-xs">Client:</span> @{booking.client.name.replace(' ', '')}</p>
              <p><span className="text-gray-400 text-xs">Package:</span> {booking.package.price} | {booking.package.name}</p>
              <p><span className="text-gray-400 text-xs">Status:</span> {booking.status}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 border border-red-400 text-red-500 rounded py-2 text-sm hover:bg-red-50">
                Decline
              </button>
              <button className="flex-1 bg-green-700 text-white rounded py-2 text-sm hover:bg-green-800">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
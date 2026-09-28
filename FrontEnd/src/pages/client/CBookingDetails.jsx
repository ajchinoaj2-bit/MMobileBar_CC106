import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getBookings } from '../../utils/bookings';

const statusStyle = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Declined: 'bg-red-100 text-red-700',
};

export default function CBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const booking = getBookings().find((b) => String(b.id) === id);

  if (!booking) {
    return (
      <div>
        <p className="text-gray-500 text-sm">Booking not found.</p>
        <Link to="/client/booking-history" className="text-green-700 text-sm underline">
          Back to Booking History
        </Link>
      </div>
    );
  }

  const form = booking.form || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-green-700">Booking #BK-{String(booking.id).padStart(4, '0')}</h2>
          <p className="text-gray-500 text-sm">Submitted {booking.submitted}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm border rounded px-3 py-2 hover:bg-gray-50"
        >
          <FaArrowLeft /> BACK
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Status</h2>
            <span className={`text-xs px-2 py-1 rounded ${statusStyle[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          {booking.status === 'Pending' && (
            <p className="text-xs text-gray-500">
              Your booking is awaiting review. We'll notify you once it's confirmed.
            </p>
          )}
          {booking.status === 'Approved' && (
            <p className="text-xs text-gray-500">
              Your booking has been approved. See you at the event!
            </p>
          )}
          {booking.status === 'Declined' && (
            <p className="text-xs text-gray-500">
              Unfortunately this booking was declined. Feel free to reach out for details.
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-3">Event Information</h2>
          <div className="grid grid-cols-2 text-sm gap-3">
            <div>
              <p className="text-gray-400 text-xs">Event Name</p>
              <p>{booking.event || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Event Type</p>
              <p>{form.eventType || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Date</p>
              <p>{form.eventDate || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Time</p>
              <p>{form.eventTime || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Guest Count</p>
              <p>{form.guests || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Location</p>
              <p>{form.location || '—'}</p>
            </div>
          </div>
          {form.requests && (
            <div className="mt-3">
              <p className="text-gray-400 text-xs mb-1">Additional Requests</p>
              <p className="text-sm bg-gray-50 rounded p-3 italic">"{form.requests}"</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-3">Selected Package & Add-ons</h2>
          <div className="flex justify-between items-start bg-gray-50 rounded p-3">
            <div>
              <p className="font-medium text-sm">{booking.package}</p>
              {booking.addOns?.length > 0 && (
                <p className="text-gray-500 text-xs mt-1">Add-ons: {booking.addOns.join(', ')}</p>
              )}
            </div>
            <p className="font-semibold text-sm">₱{booking.price?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
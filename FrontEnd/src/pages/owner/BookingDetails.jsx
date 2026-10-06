import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { getBookings, updateBookingStatus, notifyReupload } from '../../utils/bookings';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const found = getBookings().find((b) => String(b.id) === id);
    setBooking(found || null);
  }, [id]);

  if (!booking) {
    return (
      <div>
        <p className="text-charcoal-500 text-sm">Booking not found.</p>
        <Link to="/owner/bookings" className="text-forest-700 hover:text-brass-600 text-sm underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const modalContent = {
    approved: {
      title: 'Booking Approved',
      message: 'The client will be notified that their booking is confirmed.',
    },
    declined: {
      title: 'Booking Declined',
      message: 'The client will be notified that their booking was declined.',
    },
    reupload: {
      title: 'Re-upload Requested',
      message: 'The client will be asked to re-upload their proof of payment.',
    },
  };

  const setStatusAndModal = (newStatus, modalKey) => {
    updateBookingStatus(booking.id, newStatus);
    setBooking({ ...booking, status: newStatus });
    setModal(modalKey);
  };

  const handleReupload = () => {
    notifyReupload(booking.id);
    setModal('reupload');
  };

  const closeModal = () => {
    const wasTerminal = modal === 'approved' || modal === 'declined';
    setModal(null);
    if (wasTerminal) navigate('/owner/bookings');
  };

  const form = booking.form || {};

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-forest-700">
            Booking #BK-{String(booking.id).padStart(4, '0')}
          </h2>
          <p className="text-charcoal-500 text-sm">
            {booking.status} - Submitted {booking.submitted}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm border border-gray-300 rounded px-3 py-2 hover:bg-gray-50"
        >
          <FaArrowLeft /> BACK
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display font-semibold text-bottle-900 mb-3">Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-2">
              <div>
                <p className="text-charcoal-500 text-xs">Name</p>
                <p className="text-charcoal-800">{booking.client}</p>
              </div>
              <div>
                <p className="text-charcoal-500 text-xs">Event Type</p>
                <p className="text-charcoal-800">{form.eventType || '—'}</p>
              </div>
            </div>
            {form.requests && (
              <div className="mt-3">
                <p className="text-charcoal-500 text-xs mb-1">Notes from Client</p>
                <p className="text-sm bg-ivory-50 rounded p-3 italic text-charcoal-800">"{form.requests}"</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display font-semibold text-bottle-900 mb-3">Event Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-2">
              <div>
                <p className="text-charcoal-500 text-xs">Event Name & Date</p>
                <p className="text-charcoal-800">{booking.event}</p>
                <p className="text-charcoal-500 text-xs">{form.eventDate} {form.eventTime}</p>
              </div>
              <div>
                <p className="text-charcoal-500 text-xs">Guest Count</p>
                <p className="text-charcoal-800">{form.guests || '—'} Attendees</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-charcoal-500 text-xs">Venue Location</p>
              <p className="text-sm text-charcoal-800">{form.location || '—'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display font-semibold text-bottle-900 mb-3">Selected Package & Add-ons</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 bg-ivory-50 rounded p-3">
              <div>
                <p className="font-medium text-sm text-charcoal-800">{booking.package}</p>
                {booking.addOns?.length > 0 && (
                  <p className="text-charcoal-500 text-xs mt-1">Add-ons: {booking.addOns.join(', ')}</p>
                )}
              </div>
              <p className="font-semibold text-sm text-forest-700">₱{booking.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Right: payment + actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display font-semibold text-bottle-900 mb-3">Payment Status</h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-charcoal-500 text-xs">Deposit Status</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${booking.paymentProof ? 'bg-forest-700/10 text-forest-700' : 'bg-brass-100 text-brass-600'}`}>
                {booking.paymentProof ? 'Proof Submitted' : 'Not yet paid'}
              </span>
            </div>
            <p className="text-charcoal-500 text-xs mb-2">Proof of Transfer</p>
            {booking.paymentProof ? (
              <img
                src={booking.paymentProof}
                alt="Payment proof"
                className="border border-gray-200 rounded w-full h-40 object-contain mb-3"
              />
            ) : (
              <div className="border border-gray-200 rounded h-40 flex items-center justify-center text-charcoal-500/50 text-xs mb-3">
                No proof uploaded yet
              </div>
            )}
            <button
              onClick={handleReupload}
              className="w-full border border-gray-300 rounded py-2 text-sm mb-2 hover:bg-gray-50"
            >
              Request Re-upload
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-display font-semibold text-bottle-900 mb-3">Booking Status</h2>
            <div className="text-sm space-y-1 mb-4">
              <p><span className="text-charcoal-500 text-xs">Client:</span> <span className="text-charcoal-800">@{(booking.client || '').replace(' ', '')}</span></p>
              <p><span className="text-charcoal-500 text-xs">Package:</span> <span className="text-charcoal-800">₱{booking.price?.toLocaleString()} | {booking.package}</span></p>
              <p><span className="text-charcoal-500 text-xs">Status:</span> <span className="text-charcoal-800">{booking.status}</span></p>
            </div>

            {booking.status === 'Pending' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusAndModal('Declined', 'declined')}
                  className="flex-1 border border-red-300 text-red-500 rounded py-2 text-sm hover:bg-red-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => setStatusAndModal('Approved', 'approved')}
                  className="flex-1 bg-forest-700 text-ivory-50 rounded py-2 text-sm hover:bg-forest-600 transition-colors"
                >
                  Approve
                </button>
              </div>
            ) : (
              <div
                className={`text-center text-sm font-medium py-2 rounded ${
                  booking.status === 'Approved' ? 'bg-forest-700/10 text-forest-700' : 'bg-red-50 text-red-500'
                }`}
              >
                This booking has already been {booking.status.toLowerCase()}.
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center w-full max-w-sm">
            <FaCheckCircle className="text-forest-700 text-5xl mx-auto mb-3" />
            <h2 className="font-display text-xl font-bold text-bottle-900">{modalContent[modal].title}</h2>
            <p className="text-charcoal-500 text-sm mb-5">{modalContent[modal].message}</p>
            <button
              onClick={closeModal}
              className="w-full bg-brass-500 text-bottle-900 font-medium py-2.5 rounded text-sm hover:bg-brass-600 transition-colors"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
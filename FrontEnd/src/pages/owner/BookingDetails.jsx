import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { getBookings, updateBookingStatus, notifyReupload } from '../../utils/bookings';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [modal, setModal] = useState(null); // null | 'approved' | 'declined' | 'reupload'

  useEffect(() => {
    const found = getBookings().find((b) => String(b.id) === id);
    setBooking(found || null);
  }, [id]);

  if (!booking) {
    return (
      <div>
        <p className="text-gray-500 text-sm">Booking not found.</p>
        <Link to="/owner/bookings" className="text-green-700 text-sm underline">Back to Bookings</Link>
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-green-700">Booking #BK-{String(booking.id).padStart(4, '0')}</h2>
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
                <p>{booking.client}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Event Type</p>
                <p>{form.eventType || '—'}</p>
              </div>
            </div>
            {form.requests && (
              <div className="mt-3">
                <p className="text-gray-400 text-xs mb-1">Notes from Client</p>
                <p className="text-sm bg-gray-50 rounded p-3 italic">"{form.requests}"</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Event Information</h2>
            <div className="grid grid-cols-2 text-sm gap-2">
              <div>
                <p className="text-gray-400 text-xs">Event Name & Date</p>
                <p>{booking.event}</p>
                <p className="text-gray-500 text-xs">{form.eventDate} {form.eventTime}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Guest Count</p>
                <p>{form.guests || '—'} Attendees</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-400 text-xs">Venue Location</p>
              <p className="text-sm">{form.location || '—'}</p>
            </div>
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

        {/* Right: payment + actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Payment Status</h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400 text-xs">Deposit Status</span>
              <span className={`text-xs px-2 py-0.5 rounded ${booking.paymentProof ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {booking.paymentProof ? 'Proof Submitted' : 'Not yet paid'}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-2">Proof of Transfer</p>
            {booking.paymentProof ? (
              <img
                src={booking.paymentProof}
                alt="Payment proof"
                className="border rounded w-full h-40 object-contain mb-3"
              />
            ) : (
              <div className="border rounded h-40 flex items-center justify-center text-gray-300 text-xs mb-3">
                No proof uploaded yet
              </div>
            )}
            <button
              onClick={handleReupload}
              className="w-full border rounded py-2 text-sm mb-2 hover:bg-gray-50"
            >
              Request Re-upload
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-3">Booking Status</h2>
            <div className="text-sm space-y-1 mb-4">
              <p><span className="text-gray-400 text-xs">Client:</span> @{(booking.client || '').replace(' ', '')}</p>
              <p><span className="text-gray-400 text-xs">Package:</span> ₱{booking.price?.toLocaleString()} | {booking.package}</p>
              <p><span className="text-gray-400 text-xs">Status:</span> {booking.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusAndModal('Declined', 'declined')}
                className="flex-1 border border-red-400 text-red-500 rounded py-2 text-sm hover:bg-red-50"
              >
                Decline
              </button>
              <button
                onClick={() => setStatusAndModal('Approved', 'approved')}
                className="flex-1 bg-green-700 text-white rounded py-2 text-sm hover:bg-green-800"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow p-8 text-center w-full max-w-sm">
            <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-3" />
            <h2 className="text-xl font-bold">{modalContent[modal].title}</h2>
            <p className="text-gray-500 text-sm mb-5">{modalContent[modal].message}</p>
            <button
              onClick={closeModal}
              className="w-full bg-green-700 text-white py-2.5 rounded text-sm hover:bg-green-800"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
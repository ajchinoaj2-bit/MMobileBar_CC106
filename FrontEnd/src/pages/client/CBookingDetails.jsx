
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaCheckCircle } from 'react-icons/fa';
import { getBookings, attachPaymentProof } from '../../utils/bookings';

const statusStyle = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Declined: 'bg-red-100 text-red-700',
};

export default function CBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const refreshBooking = () => {
    const found = getBookings().find(
      (b) => String(b.id) === String(id)
    );

    setBooking(found || null);
  };

  useEffect(() => {
    refreshBooking();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setError('');
    setSuccess('');
    setSelectedFile(null);
    setPreview('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      e.target.value = '';
      return;
    }

    // Keep the image small enough for localStorage.
    if (file.size > 2 * 1024 * 1024) {
      setError('Image is too large. Please choose an image under 2 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedFile(file);
        setPreview(reader.result);
      } else {
        setError('Unable to preview this image. Please try another one.');
      }
    };

    reader.onerror = () => {
      setError('Unable to read this image. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile || !preview || !booking) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const saved = attachPaymentProof(booking.id, preview);

      if (!saved) {
        setError('Upload failed. Please select another image and try again.');
        return;
      }

      refreshBooking();
      setSelectedFile(null);
      setPreview('');
      setSuccess('Your replacement payment proof was submitted successfully.');
    } catch (err) {
      console.error('Payment proof upload failed:', err);

      setError(
        'Unable to save the image. Please try a smaller image or another file.'
      );
    } finally {
      setUploading(false);
    }
  };

  if (!booking) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-2">Booking not found.</p>
        <Link
          to="/client/booking-history"
          className="text-green-700 text-sm underline"
        >
          Back to Booking History
        </Link>
      </div>
    );
  }

  const form = booking.form || {};

  return (
    <div className="w-full min-w-0 max-w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
        sm:justify-between gap-3 mb-4">

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-green-700 break-words">
            Booking #BK-{String(booking.id).padStart(4, '0')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Submitted {booking.submitted || '—'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 text-sm
            border rounded px-3 py-2 hover:bg-gray-50
            w-full sm:w-auto shrink-0"
        >
          <FaArrowLeft /> BACK
        </button>
      </div>

      {/* Booking Status */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-5">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <h2 className="font-semibold">Status</h2>

          <span
            className={`text-xs px-2 py-1 rounded ${
              statusStyle[booking.status] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {booking.status || 'Unknown'}
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
            Unfortunately, this booking was declined. Feel free to reach out for details.
          </p>
        )}
      </div>

      {/* Event Information */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-5">
        <h2 className="font-semibold mb-4">Event Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="min-w-0">
            <p className="text-gray-400 text-xs mb-1">Event Name</p>
            <p className="break-words">{booking.event || '—'}</p>
          </div>

          <div className="min-w-0">
            <p className="text-gray-400 text-xs mb-1">Event Type</p>
            <p className="break-words">{form.eventType || '—'}</p>
          </div>

          <div className="min-w-0">
            <p className="text-gray-400 text-xs mb-1">Date</p>
            <p>{form.eventDate || booking.date || '—'}</p>
          </div>

          <div className="min-w-0">
            <p className="text-gray-400 text-xs mb-1">Time</p>
            <p>{form.eventTime || '—'}</p>
          </div>

          <div className="min-w-0">
            <p className="text-gray-400 text-xs mb-1">Guest Count</p>
            <p>{form.guests || '—'}</p>
          </div>

          <div className="min-w-0">
            <p className="text-gray-400 text-xs mb-1">Location</p>
            <p className="break-words">{form.location || '—'}</p>
          </div>
        </div>

        {form.requests && (
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-1">Additional Requests</p>
            <p className="text-sm bg-gray-50 rounded p-3 italic break-words">
              "{form.requests}"
            </p>
          </div>
        )}
      </div>

      {/* Selected Package */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-5">
        <h2 className="font-semibold mb-3">Selected Package & Add-ons</h2>

        <div className="flex flex-col sm:flex-row sm:justify-between
          sm:items-start gap-3 bg-gray-50 rounded p-3">

          <div className="min-w-0">
            <p className="font-medium text-sm break-words">
              {booking.package || '—'}
            </p>

            {booking.addOns?.length > 0 && (
              <p className="text-gray-500 text-xs mt-1 break-words">
                Add-ons: {booking.addOns.join(', ')}
              </p>
            )}
          </div>

          <p className="font-semibold text-sm shrink-0">
            ₱{Number(booking.price || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Proof */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-5">
        <h2 className="font-semibold mb-2">Payment Proof</h2>

        <p className="text-gray-500 text-xs mb-4">
          View your submitted payment proof and replace it if the owner requests a re-upload.
        </p>

        {booking.paymentProof ? (
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">
              Current payment proof
            </p>

            <a
              href={booking.paymentProof}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <img
                src={booking.paymentProof}
                alt="Current payment proof"
                className="w-full max-w-md max-h-80 object-contain
                  rounded-lg border border-gray-200 bg-gray-50"
              />
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center
            min-h-32 rounded-lg border border-dashed border-gray-300
            bg-gray-50 text-gray-500 text-sm p-5 mb-4">

            <FaUpload className="text-2xl mb-2" />
            <p>No payment proof uploaded yet.</p>
          </div>
        )}

        {booking.reuploadRequested ? (
          <div className="border border-amber-300 bg-amber-50
            rounded-lg p-4 space-y-4">

            <div>
              <h3 className="font-semibold text-amber-800 text-sm">
                Re-upload Requested
              </h3>
              <p className="text-amber-800 text-xs mt-1">
                The owner needs you to submit a replacement payment proof.
                Please choose a clear image of your payment receipt or transfer confirmation.
              </p>
            </div>

            <div>
              <label
                htmlFor="replacement-proof"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose Replacement Image
              </label>

              <input
                id="replacement-proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full min-w-0 text-sm text-gray-600
                  file:mr-3 file:mb-2 file:rounded file:border-0
                  file:bg-white file:border file:border-gray-300
                  file:px-3 file:py-2 file:text-sm file:font-medium
                  hover:file:bg-gray-100"
              />

              <p className="text-xs text-gray-500 mt-1">
                Image files only, maximum 2 MB.
              </p>
            </div>

            {preview && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Replacement preview
                </p>

                <img
                  src={preview}
                  alt="Replacement payment proof preview"
                  className="w-full max-w-md max-h-80 object-contain
                    rounded-lg border border-gray-200 bg-white"
                />

                <p className="text-xs text-gray-500 mt-2 break-words">
                  {selectedFile?.name}
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-green-700">
                <FaCheckCircle className="inline mr-1" />
                {success}
              </p>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full sm:w-auto flex items-center justify-center
                gap-2 rounded bg-green-700 text-white px-5 py-2.5
                text-sm font-medium hover:bg-green-800
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload />
              {uploading ? 'Uploading...' : 'Submit Replacement Proof'}
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            {booking.paymentProof
              ? 'Your payment proof has been submitted. You can replace it here if the owner requests a re-upload.'
              : 'Your payment proof has not been uploaded yet.'}
          </div>
        )}
      </div>
    </div>
  );
}

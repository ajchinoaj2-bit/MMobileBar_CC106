import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pkgId = searchParams.get('pkg') || '1';

  const [form, setForm] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    location: '',
    guests: '',
    requests: '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/client/booking-confirmation?pkg=${pkgId}`);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        <form onSubmit={handleSubmit} className="col-span-2 bg-white rounded-lg shadow p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Event Name</label>
              <input
                type="text"
                value={form.eventName}
                onChange={handleChange('eventName')}
                placeholder="e.g. Summer Gala"
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Event Type</label>
              <select
                value={form.eventType}
                onChange={handleChange('eventType')}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                required
              >
                <option value="">Select type...</option>
                <option>Corporate Event</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Private Party</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Event Date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={handleChange('eventDate')}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Event Time</label>
              <input
                type="time"
                value={form.eventTime}
                onChange={handleChange('eventTime')}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Event Location</label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              placeholder="Full address or venue name"
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Number of Guests</label>
            <input
              type="number"
              value={form.guests}
              onChange={handleChange('guests')}
              placeholder="Estimated number of guests"
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Additional Requests</label>
            <textarea
              value={form.requests}
              onChange={handleChange('requests')}
              placeholder="Any special requests or notes..."
              rows={3}
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white text-sm py-2.5 rounded hover:bg-green-800"
          >
            SUBMIT BOOKING
          </button>
        </form>

        {/* Selected Package Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-green-700 mb-3">Selected Package Summary</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Base Package</span>
                <span>Standard Bar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span>4 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bartenders</span>
                <span>2</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-yellow-600 text-xs font-semibold">PENDING</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
            <p className="font-semibold mb-1">Booking Process</p>
            <p>
              Submitting this form does not confirm your booking. Our team will review your request
              and confirm availability. You'll receive a confirmation and payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
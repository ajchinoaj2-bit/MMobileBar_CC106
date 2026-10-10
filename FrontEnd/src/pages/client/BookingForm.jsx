import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { getPackages } from '../../utils/packages';
import { addBooking, countBookingsOnDate, MAX_EVENTS_PER_DAY } from '../../utils/bookings';

const toDateString = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const prettyDate = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Next few dates after `fromDateStr` that still have a free slot.
function nextAvailableDates(fromDateStr, count = 3) {
  const [y, m, d] = fromDateStr.split('-').map(Number);
  const cursor = new Date(y, m - 1, d);
  const results = [];
  let guard = 0;

  while (results.length < count && guard < 120) {
    cursor.setDate(cursor.getDate() + 1);
    const candidate = toDateString(cursor);
    if (countBookingsOnDate(candidate) < MAX_EVENTS_PER_DAY) results.push(candidate);
    guard += 1;
  }
  return results;
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pkgId = Number(searchParams.get('pkg')) || 1;

  const [packages, setPackages] = useState([]);
  useEffect(() => {
    setPackages(getPackages());
  }, []);

  const selectedPackage = packages.find((p) => p.id === pkgId) || packages[0] || {
    title: '', price: '0', addOns: [],
  };

  const [form, setForm] = useState(
    location.state?.form || {
      eventName: '',
      eventType: '',
      eventDate: '',
      eventTime: '',
      location: '',
      guests: '',
      requests: '',
    }
  );

  const [selectedAddOns, setSelectedAddOns] = useState(location.state?.selectedAddOns || []);
  const [showFullModal, setShowFullModal] = useState(false);

  const slotsTaken = countBookingsOnDate(form.eventDate);
  const dateFull = Boolean(form.eventDate) && slotsTaken >= MAX_EVENTS_PER_DAY;
  const suggestions = showFullModal && form.eventDate ? nextAvailableDates(form.eventDate) : [];

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOn) ? prev.filter((a) => a !== addOn) : [...prev, addOn]
    );
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, eventDate: value });
    if (value && countBookingsOnDate(value) >= MAX_EVENTS_PER_DAY) {
      setShowFullModal(true);
    }
  };

  const pickDate = (dateStr) => {
    setForm({ ...form, eventDate: dateStr });
    setShowFullModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dateFull) {
      setShowFullModal(true);
      return;
    }

    const newBooking = addBooking({
      client: JSON.parse(localStorage.getItem('currentUser') || 'null')?.fullname || 'Guest Client',
      event: form.eventName,
      date: form.eventDate,
      package: selectedPackage.title,
      price: Number(String(selectedPackage.price).replace(/,/g, '')),
      addOns: selectedAddOns,
      form,
    });

    if (!newBooking) {
      setShowFullModal(true);
      return;
    }

    navigate(`/client/booking-confirmation?pkg=${pkgId}`, {
      state: { form, selectedAddOns, bookingId: newBooking.id },
    });
  };

  const inputClass =
    'w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brass-500 transition-colors';

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-lg shadow p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-charcoal-500">Event Name</label>
              <input
                type="text"
                value={form.eventName}
                onChange={handleChange('eventName')}
                placeholder="e.g. Summer Gala"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="text-xs text-charcoal-500">Event Type</label>
              <select
                value={form.eventType}
                onChange={handleChange('eventType')}
                className={inputClass}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-charcoal-500">Event Date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={handleDateChange}
                className={`${inputClass} ${dateFull ? 'border-red-400 focus:border-red-500' : ''}`}
                required
              />
              {dateFull && (
                <p className="text-red-500 text-xs mt-1">
                  This date is fully booked. Please choose another date.
                </p>
              )}
              {!dateFull && form.eventDate && slotsTaken > 0 && (
                <p className="text-charcoal-500 text-xs mt-1">
                  {slotsTaken} of {MAX_EVENTS_PER_DAY} slots taken on this date.
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-charcoal-500">Event Time</label>
              <input
                type="time"
                value={form.eventTime}
                onChange={handleChange('eventTime')}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-charcoal-500">Event Location</label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              placeholder="Full address or venue name"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-xs text-charcoal-500">Number of Guests</label>
            <input
              type="number"
              value={form.guests}
              onChange={handleChange('guests')}
              placeholder="Estimated number of guests"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-xs text-charcoal-500">Additional Requests</label>
            <textarea
              value={form.requests}
              onChange={handleChange('requests')}
              placeholder="Any special requests or notes..."
              rows={2}
              className={inputClass}
            />
          </div>

          {dateFull && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-red-700">
                  Fully booked on {prettyDate(form.eventDate)}
                </p>
                <p className="text-red-600 text-xs mt-0.5">
                  We can only take {MAX_EVENTS_PER_DAY} events per day. Pick another date to continue.
                </p>
                <button
                  type="button"
                  onClick={() => setShowFullModal(true)}
                  className="text-red-700 text-xs font-medium underline mt-1"
                >
                  See available dates
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full font-medium text-sm py-2.5 rounded transition-colors ${
              dateFull
                ? 'bg-brass-500/50 text-bottle-900/70 hover:bg-brass-500/60'
                : 'bg-brass-500 text-bottle-900 hover:bg-brass-600'
            }`}
          >
            Submit Booking
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-display font-semibold text-bottle-900 mb-3">Selected Package Summary</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Base Package</span>
                <span className="text-charcoal-800">{selectedPackage.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Price</span>
                <span className="text-charcoal-800">₱{selectedPackage.price}</span>
              </div>
              <hr className="border-brass-100" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-charcoal-800">Estimated Total</span>
                <span className="text-brass-600 text-xs font-semibold">PENDING</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-semibold text-forest-700 mb-2">Add Ons</p>
            <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {(selectedPackage.addOns || []).map((addOn) => (
                <label
                  key={addOn}
                  className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1.5 text-xs cursor-pointer hover:bg-ivory-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn)}
                    onChange={() => toggleAddOn(addOn)}
                    className="accent-brass-500"
                  />
                  <span className="text-charcoal-800">{addOn}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-forest-700 bg-ivory-50 border border-brass-100 rounded px-2 py-1.5">
              You can select one or more items.
            </p>
          </div>

          <div className="bg-brass-100/60 border border-brass-300/50 rounded-lg p-4 text-xs text-bottle-900">
            <p className="font-semibold mb-1">Booking Process</p>
            <p className="text-charcoal-800">
              Submitting this form does not confirm your booking. Our team will review your request
              and confirm availability. You'll receive a confirmation and payment details.
            </p>
          </div>
        </div>
      </div>

      {/* Fully booked pop-up */}
      {showFullModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex items-start justify-between p-6 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
                <h2 className="font-display text-lg font-bold text-bottle-900">This date is fully booked</h2>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="text-charcoal-500 hover:text-forest-700"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="px-6 pb-2">
              <p className="text-sm text-charcoal-500">
                {form.eventDate ? prettyDate(form.eventDate) : 'That date'} is fully booked.     
                 We sincerely apologize, if possible please choose another date.              
              </p>

              {suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-forest-700 mb-2">Next available dates</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => pickDate(s)}
                        className="border border-brass-400/60 text-forest-700 text-xs font-medium px-3 py-1.5 rounded hover:bg-brass-100 transition-colors"
                      >
                        {prettyDate(s)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 pt-5">
              <button
                onClick={() => setShowFullModal(false)}
                className="w-full bg-brass-500 text-bottle-900 font-medium py-2.5 rounded text-sm hover:bg-brass-600 transition-colors"
              >
                Choose another date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
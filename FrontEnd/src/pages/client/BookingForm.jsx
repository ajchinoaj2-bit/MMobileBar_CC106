import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { getPackages } from '../../utils/packages';
import { addBooking } from '../../utils/bookings';

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

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOn) ? prev.filter((a) => a !== addOn) : [...prev, addOn]
    );
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = addBooking({
      client: JSON.parse(localStorage.getItem('currentUser') || 'null')?.fullname || 'Guest Client',
      event: form.eventName,
      date: form.eventDate,
      package: selectedPackage.title,
      price: Number(String(selectedPackage.price).replace(/,/g, '')),
      addOns: selectedAddOns,
      form,
    });

    navigate(`/client/booking-confirmation?pkg=${pkgId}`, {
      state: { form, selectedAddOns, bookingId: newBooking.id },
    });
  };

  const inputClass =
    'w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brass-500 transition-colors';

  return (
    <div className="h-full">
      <div className="grid grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="col-span-2 bg-white rounded-lg shadow p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-charcoal-500">Event Date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={handleChange('eventDate')}
                className={inputClass}
                required
              />
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

          <button
            type="submit"
            className="w-full bg-brass-500 text-bottle-900 font-medium text-sm py-2.5 rounded hover:bg-brass-600 transition-colors"
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
    </div>
  );
}
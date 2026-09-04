import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const packageData = {
  1: { name: 'Premium Cocktail Package', basePrice: 8200, baseGuests: '40-60 guests', duration: '4 Hours' },
  2: { name: 'Premium Cocktail Package', basePrice: 9500, baseGuests: '60-80 guests', duration: '4 Hours' },
};

const addOnOptions = [
  { id: 'signature', label: 'Custom Signature Cocktail', price: 150 },
  { id: 'glassware', label: 'Glassware Rental', price: 100 },
  { id: 'toast', label: 'Champagne Toast Setup', price: 200 },
];

export default function PackageCustomize() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pkgId = searchParams.get('pkg') || '1';
  const pkg = packageData[pkgId] || packageData['1'];

  const [guestCount, setGuestCount] = useState(pkg.baseGuests);
  const [duration, setDuration] = useState(pkg.duration);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const toggleAddOn = (id) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addOn = addOnOptions.find((a) => a.id === id);
    return sum + (addOn ? addOn.price : 0);
  }, 0);

  const estimatedTotal = pkg.basePrice + addOnsTotal;

  return (
    <div>
      <button
        onClick={() => navigate('/client/package')}
        className="border rounded px-4 py-2 text-sm mb-8 hover:bg-gray-50"
      >
        Back to Package
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-10">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-green-700">{pkg.name}</h2>
                <p className="text-xs text-gray-500">
                  Base rate: ₱{pkg.basePrice.toLocaleString()} (up to {pkg.baseGuests})
                </p>
              </div>
              <button
                onClick={() => navigate('/client/package')}
                className="border rounded px-3 py-1 text-xs hover:bg-gray-50"
              >
                Change Package
              </button>
            </div>

            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-700">Included Services</p>
              <ul className="text-xs text-gray-600 list-disc list-inside mt-1 space-y-0.5">
                <li>4 hours of continuous service</li>
                <li>2 Professional Mixologists</li>
                <li>Full mobile bar setup & breakdown</li>
                <li>Premium garnishes, ice, and mixers</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-green-700 mb-3">Event Specifics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Estimated Guest Count</label>
                <input
                  type="text"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Service Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-green-700 mb-3">Available Add-Ons</h2>
            <div className="space-y-2">
              {addOnOptions.map((addOn) => (
                <label key={addOn.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                    />
                    {addOn.label}
                  </span>
                  <span className="text-gray-500">+₱{addOn.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Estimated Total sidebar */}
        <div className="bg-white rounded-lg shadow p-4 h-fit">
          <h2 className="font-semibold text-green-700 mb-3">Estimated Total</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Base Package</span>
              <span>₱{pkg.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guest Count Adjust</span>
              <span>₱0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Extra Hours</span>
              <span>₱0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Add-ons</span>
              <span>₱{addOnsTotal.toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total Est.</span>
              <span>₱{estimatedTotal.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Final price may based on additional customizations and applicable taxes.
            </p>
          </div>

          <button
            onClick={() => navigate(`/client/booking-form?pkg=${pkgId}`)}
            className="w-full mt-4 bg-green-700 text-white text-sm py-2 rounded hover:bg-green-800"
          >
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
}
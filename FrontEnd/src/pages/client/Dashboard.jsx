const packages = [
  {
    id: 1,
    name: 'The Classic Pour',
    desc: 'Standard mobile bar setup perfect for small gathering. Includes basic mixers and garnishes.',
  },
  {
    id: 2,
    name: 'Premium Mixology',
    desc: 'Elevate your event with signature cocktails crafted by our expert mixologists.',
  },
];

const bookingSteps = [
  { label: 'Request Submitted', done: true },
  { label: 'Deposit Pending', done: true, active: true },
  { label: 'Menu Finalization', done: false },
  { label: 'Ready for Event', done: false },
];

export default function ClientDashboard() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Available Packages */}
        <div className="col-span-2">
          <h2 className="font-semibold mb-3 border-b pb-2">Available Packages</h2>
          <div className="grid grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow p-4">
                <div className="bg-gray-200 h-28 rounded mb-3" />
                <h3 className="font-semibold text-sm">{pkg.name}</h3>
                <p className="text-gray-500 text-xs mt-1 mb-3">{pkg.desc}</p>
                <button className="w-full bg-green-700 text-white text-sm py-2 rounded hover:bg-green-800">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Booking + Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Upcoming Booking</h2>
            <p className="text-xs text-green-700 font-medium">Aug 24, 2024</p>
            <p className="text-sm font-semibold mt-1">Summer Gala Reception</p>
            <p className="text-xs text-gray-500 mb-2">The Classic Pour Package</p>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>ID: #B-7492</span>
              <button className="text-green-700 underline">Manage</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Booking Status</h2>
            <div className="space-y-3">
              {bookingSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full border-2 ${
                      step.done
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      step.active ? 'font-semibold text-black' : step.done ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
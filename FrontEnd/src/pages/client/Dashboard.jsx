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
    <div className="p-6">
      <div className="grid grid-cols-3 gap-8 mt-1">
        {/* Available Packages */}
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-10 border-b pb-3">Available Packages</h2>
          <div className="grid grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow p-5">
                <div className="bg-gray-200 h-40 rounded mb-4" />
                <h3 className="font-semibold text-base">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mt-2 mb-4">{pkg.desc}</p>
                <button className="w-full bg-green-700 text-white text-sm py-2.5 rounded hover:bg-green-800">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Booking + Status */}
        <div className="space-y-6 mt-20">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-3">Upcoming Booking</h2>
            <p className="text-sm text-green-700 font-medium">Aug 24, 2024</p>
            <p className="text-base font-semibold mt-1">Summer Gala Reception</p>
            <p className="text-sm text-gray-500 mb-3">The Classic Pour Package</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>ID: #B-7492</span>
              <button className="text-green-700 underline">Manage</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
            <div className="space-y-4">
              {bookingSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      step.done
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <span
                    className={`text-base ${
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
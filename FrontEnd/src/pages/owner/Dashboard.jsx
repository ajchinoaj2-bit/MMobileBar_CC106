const stats = [
  { label: 'Total Bookings', value: '1,248', note: '+8% from last month' },
  { label: 'Total Earnings', value: '₱596,643', note: '+12% from last month' },
  { label: 'Pending Approvals', value: '14', note: 'Requires action', alert: true },
  { label: 'Active Bookings', value: '3', note: 'Scheduled this month' },
];

const notifications = [
  { title: 'New Booking Request', desc: 'John Dela Cruz requested "Standard Bar Package"', time: '5 mins ago' },
  { title: 'Payment Received', desc: 'Invoice #4321 has been paid in full', time: '2 hours ago' },
  { title: 'New Messages', desc: 'Message from client @JuanDelaCruz', time: '3 hours ago' },
  { title: 'Booking/Payment Approval', desc: 'Awaiting Booking/Payment Approval', time: '1 day ago' },
];

export default function Dashboard() {
  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-18">
        {stats.map((s) => (
         <div key={s.label} className="bg-[#15803d] text-white rounded-lg p-4" >
            <p className="text-sm opacity-90">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className={`text-xs mt-1 ${s.alert ? 'text-[#FFFFFF]' : 'opacity-80'}`}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* Payment status + Notifications */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Payment Status Overview</h2>
            <button className="text-xs text-green-700">Export</button>
          </div>
          <div className="h-40 flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded">
            Chart visualization placeholder
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Notifications</h2>
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">New</span>
          </div>
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.title} className="text-sm border-b pb-2 last:border-0">
                <p className="font-medium">{n.title}</p>
                <p className="text-gray-500 text-xs">{n.desc}</p>
                <p className="text-gray-400 text-[10px]">{n.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/**** Bookings over time *******/}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3">Bookings Over Time</h2>
        <div className="h-32 flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded">
          Chart placeholder — swap for recharts later
        </div>
      </div>
    </div>
  );
}

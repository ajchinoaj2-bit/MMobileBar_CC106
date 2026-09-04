import { useNavigate } from 'react-router-dom';

export default function BookingConfirmation() {
  const navigate = useNavigate();

  const booking = {
    package: 'Premium Open Bar Package',
    date: 'October 15, 2024',
    time: '6:00 PM - 10:00 PM (4 Hours)',
    guests: 150,
    location: 'The Grand Hall, 123 Event St.',
    totalDue: 1250,
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-green-700">Summary</h2>
          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">PENDING</span>
        </div>

        <div className="text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Package</span>
            <span className="font-medium">{booking.package}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span>{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span>{booking.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guest Count</span>
            <span>{booking.guests} Guests</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span>{booking.location}</span>
          </div>
        </div>

        <div className="bg-green-100 rounded-lg p-4 mt-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-green-800">Total Due Today</p>
            <p className="text-xs text-green-700">Includes 50% deposit</p>
          </div>
          <p className="font-bold text-lg text-green-800">${booking.totalDue.toLocaleString()}.00</p>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => navigate('/client/payment')}
            className="flex-1 bg-green-700 text-white py-2.5 rounded text-sm hover:bg-green-800"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => navigate('/client/booking-form')}
            className="flex-1 border rounded py-2.5 text-sm hover:bg-gray-50"
          >
            Edit Booking
          </button>
        </div>

        <button
          onClick={() => navigate('/client/dashboard')}
          className="w-full text-center text-xs text-gray-400 underline mt-3"
        >
          Cancel and return home
        </button>
      </div>
    </div>
  );
}
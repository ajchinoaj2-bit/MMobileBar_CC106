import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getBookings } from '../../utils/bookings';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const bookings = getBookings();
    // map real bookings into the shape this page expects
    const mapped = bookings
      .filter((b) => b.form?.eventDate) // only ones with a real date
      .map((b) => ({
        date: b.form.eventDate, // already 'YYYY-MM-DD' from <input type="date">
        title: b.event || 'Untitled Event',
        time: b.form.eventTime || '',
        status: b.status === 'Approved' ? 'Approved' : 'Pending',
        location: b.form.location || '—',
      }));
    setEvents(mapped);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const eventsForDay = (day) => events.filter((e) => e.date === formatDate(day));
  const selectedEvents = eventsForDay(selectedDay);

  const blanks = Array.from({ length: firstWeekday }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  // Month Overview should reflect only events in the currently viewed month
  const eventsThisMonth = events.filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
  const totalBookings = eventsThisMonth.length;
  const approved = eventsThisMonth.filter((e) => e.status === 'Approved').length;
  const pending = eventsThisMonth.filter((e) => e.status === 'Pending').length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPrevMonth}><FaChevronLeft /></button>
            <h2 className="font-semibold">{monthName} {year}</h2>
            <button onClick={goToNextMonth}><FaChevronRight /></button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dayEvents = eventsForDay(day);
              const isSelected = day === selectedDay;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`h-16 rounded flex flex-col items-center justify-start pt-1 ${
                    isSelected ? 'bg-green-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{day}</span>
                  <div className="flex gap-0.5 mt-1">
                    {dayEvents.map((e, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          e.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'
                        } ${isSelected ? 'bg-white' : ''}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Events for {monthName} {selectedDay}</h3>
            {selectedEvents.length === 0 && (
              <p className="text-gray-400 text-sm">No events this day.</p>
            )}
            {selectedEvents.map((e, i) => (
              <div key={i} className="border-b last:border-0 pb-3 mb-3 text-sm">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    e.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {e.status}
                </span>
                <p className="font-medium mt-1">{e.title}</p>
                <p className="text-gray-400 text-xs">{e.time}</p>
                <p className="text-gray-400 text-xs">{e.location}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-sm">
            <h3 className="font-semibold mb-2">Month Overview</h3>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Total Bookings</span>
              <span>{totalBookings}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Approved</span>
              <span className="text-green-600">{approved}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Pending Action</span>
              <span className="text-yellow-600">{pending}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
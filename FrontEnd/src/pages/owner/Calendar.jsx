
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getBookings, MAX_EVENTS_PER_DAY } from '../../utils/bookings';

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const bookings = getBookings();

    const mapped = bookings
      .filter((b) => b.form?.eventDate && b.status !== 'Declined')
      .map((b) => ({
        id: b.id,
        date: b.form.eventDate,
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
  const firstWeekday = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
  });

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const formatDate = (day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const eventsForDay = (day) =>
    events.filter((event) => event.date === formatDate(day));

  const selectedEvents = eventsForDay(selectedDay);

  const blanks = Array.from({ length: firstWeekday }, (_, i) => `blank-${i}`);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const eventsThisMonth = events.filter((event) =>
    event.date.startsWith(monthPrefix)
  );

  const totalBookings = eventsThisMonth.length;
  const approved = eventsThisMonth.filter(
    (event) => event.status === 'Approved'
  ).length;
  const pending = eventsThisMonth.filter(
    (event) => event.status === 'Pending'
  ).length;

  return (
    <div className="min-h-[calc(100vh-9rem)]">
      <div className="grid min-h-[calc(100vh-10rem)] grid-cols-1 items-stretch gap-5 xl:grid-cols-3 xl:gap-6">

        {/* Calendar */}
        <section className="flex min-h-[650px] flex-col rounded-lg border border-brass-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
          {/* Month Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="Previous month"
              className="flex h-9 w-9 items-center justify-center rounded-md text-charcoal-500 transition-colors hover:bg-ivory-100 hover:text-forest-700"
            >
              <FaChevronLeft />
            </button>

            <h2 className="font-display text-base font-semibold text-bottle-900 sm:text-lg">
              {monthName} {year}
            </h2>

            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="flex h-9 w-9 items-center justify-center rounded-md text-charcoal-500 transition-colors hover:bg-ivory-100 hover:text-forest-700"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Weekday Headings */}
          <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-charcoal-500 sm:gap-2 sm:text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              )
            )}
          </div>

          {/* Calendar Days */}
          <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              if (typeof cell !== 'number') {
                return <div key={cell} />;
              }

              const day = cell;
              const dayEvents = eventsForDay(day);
              const isSelected = day === selectedDay;
              const isFull = dayEvents.length >= MAX_EVENTS_PER_DAY;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  aria-pressed={isSelected}
                  aria-label={`${monthName} ${day}, ${dayEvents.length} events`}
                  className={`flex min-h-[76px] flex-col items-center rounded-md border p-1.5 transition-colors sm:min-h-[100px] sm:p-2 ${
                    isSelected
                      ? 'border-forest-700 bg-forest-700 text-ivory-50 shadow-sm'
                      : isFull
                        ? 'border-red-100 bg-red-50 text-charcoal-800 hover:bg-red-100'
                        : 'border-transparent text-charcoal-800 hover:border-brass-200 hover:bg-ivory-50'
                  }`}
                >
                  <span className="text-sm font-medium sm:text-base">
                    {day}
                  </span>

                  {dayEvents.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {dayEvents.slice(0, 4).map((event, i) => (
                        <span
                          key={`${event.id}-${i}`}
                          className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                            isSelected
                              ? 'bg-ivory-50'
                              : event.status === 'Approved'
                                ? 'bg-forest-700'
                                : 'bg-brass-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {dayEvents.length > 0 && (
                    <span
                      className={`mt-1 text-[9px] sm:text-[10px] ${
                        isSelected
                          ? 'text-ivory-100/80'
                          : 'text-charcoal-500'
                      }`}
                    >
                      {dayEvents.length}{' '}
                      {dayEvents.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-brass-100 pt-4 text-xs text-charcoal-500 sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-brass-500" />
              Pending
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-forest-700" />
              Booked / Approved
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm border border-red-200 bg-red-100" />
              Fully booked ({MAX_EVENTS_PER_DAY}/{MAX_EVENTS_PER_DAY})
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-5 xl:col-span-1">
          {/* Events for Selected Day */}
          <section className="flex-1 rounded-lg border border-brass-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-semibold text-bottle-900">
                  Events for {monthName} {selectedDay}
                </h3>

                <p className="mt-1 text-xs text-charcoal-500">
                  Bookings scheduled for this day
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-ivory-100 px-2.5 py-1 text-xs font-medium text-charcoal-600">
                {selectedEvents.length} of {MAX_EVENTS_PER_DAY}
              </span>
            </div>

            {selectedEvents.length === 0 && (
              <div className="flex min-h-[140px] items-center justify-center rounded-md border border-dashed border-brass-200 bg-ivory-50 px-4 text-center">
                <p className="text-sm text-charcoal-500">
                  No events scheduled for this day.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-md border border-brass-100 p-3"
                >
                  <span
                    className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                      event.status === 'Approved'
                        ? 'bg-forest-700/10 text-forest-700'
                        : 'bg-brass-100 text-brass-600'
                    }`}
                  >
                    {event.status}
                  </span>

                  <p className="mt-2 break-words text-sm font-semibold text-bottle-900">
                    {event.title}
                  </p>

                  <p className="mt-1 text-xs text-charcoal-500">
                    {event.time || 'Time not specified'}
                  </p>

                  <p className="mt-1 break-words text-xs text-charcoal-500">
                    {event.location}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate(`/owner/bookings/${event.id}`)}
                    className="mt-3 text-xs font-medium text-forest-700 underline transition-colors hover:text-brass-600"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Monthly Overview */}
          <section className="rounded-lg border border-brass-100 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-bottle-900">
              Month Overview
            </h3>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm text-charcoal-500">
                Total Bookings
              </span>
              <span className="font-semibold text-bottle-900">
                {totalBookings}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm text-charcoal-500">Approved</span>
              <span className="font-semibold text-forest-700">
                {approved}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-charcoal-500">
                Pending Action
              </span>
              <span className="font-semibold text-brass-600">
                {pending}
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

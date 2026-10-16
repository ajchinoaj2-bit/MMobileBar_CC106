
import { useEffect, useState } from 'react';
import {
  FaSearch,
  FaUserCircle,
  FaCalendarAlt,
  FaEllipsisV,
  FaPaperclip,
  FaSlidersH,
  FaArrowLeft,
} from 'react-icons/fa';
import { getBookings } from '../../utils/bookings';
import { getThread, sendMessage } from '../../utils/messages';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  useEffect(() => {
    const bookings = getBookings();
    const uniqueClients = [
      ...new Set(bookings.map((b) => b.client).filter(Boolean)),
    ];

    const list = uniqueClients.map((name) => {
      const clientBookings = bookings.filter((b) => b.client === name);
      const latestBooking = clientBookings[clientBookings.length - 1];
      const clientThread = getThread(name);
      const lastMsg = clientThread[clientThread.length - 1];

      return {
        name,
        event: latestBooking
          ? `${latestBooking.event || 'Booking'} - ${
              latestBooking.form?.eventDate || latestBooking.date || ''
            }`
          : '',
        lastMsg: lastMsg ? lastMsg.text : 'No messages yet.',
        time: lastMsg ? lastMsg.time : latestBooking?.submitted || '',
      };
    });

    setClients(list);

    if (list.length > 0 && !selectedName) {
      setSelectedName(list[0].name);
    }
  }, []);

  useEffect(() => {
    if (selectedName) {
      setThread(getThread(selectedName));
    }
  }, [selectedName]);

  const selected = clients.find((c) => c.name === selectedName);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectClient = (name) => {
    setSelectedName(name);
    setMobileChatOpen(true);
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedName) return;

    sendMessage(selectedName, 'owner', draft);
    setThread(getThread(selectedName));
    setDraft('');
  };

  if (clients.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white p-6 text-center">
        <p className="text-charcoal-500 text-sm max-w-sm">
          No client conversations yet. They'll appear here once a client
          submits a booking.
        </p>
      </div>
    );
  }

  return (
    <div className="-m-3 sm:-m-6 flex h-[calc(100dvh-8rem)] sm:h-[calc(100vh-6rem)] min-h-[400px] w-auto min-w-0 max-w-[calc(100%+1.5rem)] sm:max-w-[calc(100%+3rem)] overflow-hidden bg-white">
      {/* Client List */}
      <div
        className={`${
          mobileChatOpen ? 'hidden' : 'flex'
        } w-full sm:flex sm:w-64 md:w-72 lg:w-80 shrink-0 border-r border-brass-100 flex-col min-w-0`}
      >
        <div className="p-3 border-b border-brass-100 shrink-0">
          <h2 className="font-display font-semibold text-bottle-900 mb-3 sm:hidden">
            Client Conversations
          </h2>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500 text-sm" />

            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-w-0 pl-9 pr-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-brass-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-charcoal-500 text-center">
              No clients found.
            </p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectClient(c.name)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-l-4 transition-colors ${
                  c.name === selectedName
                    ? 'bg-brass-100/60 border-brass-500'
                    : 'border-transparent hover:bg-ivory-50'
                }`}
              >
                <FaUserCircle className="text-gray-300 text-2xl mt-1 shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-sm truncate text-charcoal-800">
                      {c.name}
                    </span>

                    <span className="text-[10px] text-charcoal-500 shrink-0">
                      {c.time}
                    </span>
                  </div>

                  <p
                    className={`text-xs truncate ${
                      c.name === selectedName
                        ? 'text-charcoal-800'
                        : 'text-charcoal-500'
                    }`}
                  >
                    {c.lastMsg}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-brass-100 shrink-0">
          <span className="font-semibold text-sm text-charcoal-800">
            Conversations ({clients.length})
          </span>

          <FaSlidersH className="text-charcoal-500" />
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          mobileChatOpen ? 'flex' : 'hidden'
        } sm:flex flex-1 min-w-0 flex-col`}
      >
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-bottle-900 to-forest-700 text-ivory-50 px-3 sm:px-6 py-3 sm:py-4 min-h-16 sm:h-20 flex justify-between items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  className="sm:hidden shrink-0 p-2 rounded hover:bg-white/10"
                  aria-label="Back to clients"
                >
                  <FaArrowLeft />
                </button>

                <FaUserCircle className="text-2xl sm:text-3xl text-ivory-100/70 shrink-0" />

                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {selected.name}
                  </p>

                  {selected.event && (
                    <p className="text-[10px] sm:text-xs text-ivory-100/70 truncate">
                      {selected.event}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-ivory-100/70 shrink-0">
                <FaCalendarAlt className="hidden sm:block" />
                <FaEllipsisV />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-4 bg-ivory-50">
              <div className="text-center">
                <span className="bg-white text-charcoal-500 text-xs px-3 py-1 rounded-full border border-brass-100">
                  Today
                </span>
              </div>

              {thread.length === 0 && (
                <p className="text-center text-charcoal-500 text-sm">
                  No messages yet. Say hello!
                </p>
              )}

              {thread.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    m.from === 'owner' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md px-4 py-2 rounded-lg text-sm break-words whitespace-pre-wrap ${
                      m.from === 'owner'
                        ? 'bg-forest-700 text-ivory-50'
                        : 'bg-white border border-gray-200 text-charcoal-800'
                    }`}
                  >
                    {m.text}
                  </div>

                  <span className="text-xs text-charcoal-500 mt-1">
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2 sm:p-4 border-t border-brass-100 flex items-center gap-2 sm:gap-3 shrink-0 bg-white"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 text-sm outline-none focus:border-brass-500"
              />

              <FaPaperclip className="hidden sm:block text-charcoal-500 shrink-0" />

              <button
                type="submit"
                disabled={!draft.trim()}
                className="bg-brass-500 text-bottle-900 font-medium text-xs sm:text-sm px-3 sm:px-5 py-2 rounded hover:bg-brass-600 transition-colors disabled:opacity-50 shrink-0"
              >
                SEND
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-charcoal-500">
            Select a client to view the conversation.
          </div>
        )}
      </div>
    </div>
  );
}

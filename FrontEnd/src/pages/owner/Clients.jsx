import { useEffect, useState } from 'react';
import { FaSearch, FaUserCircle, FaCalendarAlt, FaEllipsisV, FaPaperclip, FaSlidersH } from 'react-icons/fa';
import { getBookings } from '../../utils/bookings';
import { getThread, sendMessage } from '../../utils/messages';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState([]);

  useEffect(() => {
    const bookings = getBookings();
    const uniqueClients = [...new Set(bookings.map((b) => b.client))];

    const list = uniqueClients.map((name) => {
      const clientBookings = bookings.filter((b) => b.client === name);
      const latestBooking = clientBookings[clientBookings.length - 1];
      const clientThread = getThread(name);
      const lastMsg = clientThread[clientThread.length - 1];

      return {
        name,
        event: latestBooking ? `${latestBooking.event} - ${latestBooking.form?.eventDate || ''}` : '',
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

  const handleSend = () => {
    if (!draft.trim() || !selectedName) return;
    sendMessage(selectedName, 'owner', draft);
    setThread(getThread(selectedName));
    setDraft('');
  };

  if (!selected) {
    return (
      <div className="flex h-[calc(100vh-6rem)] -m-6 bg-white items-center justify-center">
        <p className="text-charcoal-500 text-sm">No client conversations yet. They'll appear here once a client submits a booking.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-6 bg-white">
      {/* Conversation list */}
      <div className="w-80 border-r border-brass-100 flex flex-col">
        <div className="p-3 border-b border-brass-100 shrink-0">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500 text-sm" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-brass-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedName(c.name)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left border-l-4 transition-colors ${
                c.name === selectedName ? 'bg-brass-100/60 border-brass-500' : 'border-transparent hover:bg-ivory-50'
              }`}
            >
              <FaUserCircle className="text-gray-300 text-2xl mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm truncate text-charcoal-800">{c.name}</span>
                  <span className="text-xs text-charcoal-500">{c.time}</span>
                </div>
                <p className={`text-xs truncate ${c.name === selectedName ? 'text-charcoal-800' : 'text-charcoal-500'}`}>
                  {c.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-brass-100 shrink-0">
          <span className="font-semibold text-sm text-charcoal-800">Conversations</span>
          <FaSlidersH className="text-charcoal-500" />
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-bottle-900 to-forest-700 text-ivory-50 px-6 py-4 h-20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-ivory-100/70" />
            <div>
              <p className="font-semibold">{selected.name}</p>
              {selected.event && <p className="text-xs text-ivory-100/70">{selected.event}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 text-ivory-100/70">
            <FaCalendarAlt />
            <FaEllipsisV />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ivory-50">
          <div className="text-center">
            <span className="bg-white text-charcoal-500 text-xs px-3 py-1 rounded-full border border-brass-100">Today</span>
          </div>

          {thread.length === 0 && (
            <p className="text-center text-charcoal-500 text-sm">No messages yet. Say hello!</p>
          )}

          {thread.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.from === 'owner' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md px-4 py-2 rounded-lg text-sm ${
                  m.from === 'owner' ? 'bg-forest-700 text-ivory-50' : 'bg-white border border-gray-200 text-charcoal-800'
                }`}
              >
                {m.text}
              </div>
              <span className="text-xs text-charcoal-500 mt-1">{m.time}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-brass-100 flex items-center gap-3 shrink-0">
          <input
            type="text"
            placeholder="Type your message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-brass-500"
          />
          <FaPaperclip className="text-charcoal-500" />
          <button
            onClick={handleSend}
            className="bg-brass-500 text-bottle-900 font-medium text-sm px-5 py-2 rounded hover:bg-brass-600 transition-colors"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
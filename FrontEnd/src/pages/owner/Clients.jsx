import { useState } from 'react';
import { FaSearch, FaUserCircle, FaCalendarAlt, FaEllipsisV, FaPaperclip, FaSlidersH } from 'react-icons/fa';

const conversations = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    event: 'Summer Gala - Oct 12',
    lastMsg: 'Can we update the drink menu for the reception?',
    time: '10:42 AM',
    messages: [
      { from: 'them', text: 'Hi there! We were looking over the proposed cocktail list for the reception.', time: '10:30 AM' },
      { from: 'me', text: 'Hello Sarah. Yes, I have the list in front of me. Did you have any changes in mind?', time: '10:35 AM' },
      { from: 'them', text: "Can we update the drink menu for the reception? We'd like to swap the Margarita for a Mojito if possible.", time: '10:42 AM' },
    ],
  },
  {
    id: 2,
    name: 'David Miller (Corporate)',
    event: '',
    lastMsg: 'Invoice received, thank you.',
    time: 'Yesterday',
    messages: [
      { from: 'them', text: 'Invoice received, thank you.', time: 'Yesterday' },
    ],
  },
  {
    id: 3,
    name: 'Emma & Liam Wedding',
    event: '',
    lastMsg: 'We need to discuss the timeline.',
    time: 'Mon',
    messages: [
      { from: 'them', text: 'We need to discuss the timeline.', time: 'Mon' },
    ],
  },
];

export default function Clients() {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!draft.trim()) return;
    setDraft('');
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-6 bg-white">
      {/* Conversation list */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-3 border-b shrink-0">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left border-l-4 ${
                c.id === selectedId ? 'bg-green-50 border-green-600' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <FaUserCircle className="text-gray-300 text-2xl mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm truncate">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </div>
                <p className={`text-xs truncate ${c.id === selectedId ? 'text-gray-700' : 'text-gray-500'}`}>
                  {c.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t shrink-0">
          <span className="font-semibold text-sm">Conversations</span>
          <FaSlidersH className="text-gray-400" />
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="bg-green-700 text-white px-6 py-4 h-20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl" />
            <div>
              <p className="font-semibold">{selected.name}</p>
              {selected.event && <p className="text-xs text-green-100">{selected.event}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaCalendarAlt />
            <FaEllipsisV />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div className="text-center">
            <span className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">Today</span>
          </div>

          {selected.messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md px-4 py-2 rounded-lg text-sm ${
                  m.from === 'me' ? 'bg-gray-700 text-white' : 'bg-white border'
                }`}
              >
                {m.text}
              </div>
              <span className="text-xs text-gray-400 mt-1">{m.time}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex items-center gap-3 shrink-0">
          <input
            type="text"
            placeholder="Type your message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border rounded px-4 py-2 text-sm"
          />
          <FaPaperclip className="text-gray-400" />
          <button onClick={handleSend} className="bg-black text-white text-sm px-5 py-2 rounded">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
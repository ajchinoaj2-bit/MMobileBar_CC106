import { useState } from 'react';
import { FaUserCircle, FaPaperclip, FaSlidersH } from 'react-icons/fa';

const conversations = [
  {
    id: 1,
    name: 'Admin',
    preview: 'Hello, I ordered this package for my event...',
    time: 'Today',
    isSystem: false,
  },
  {
    id: 2,
    name: 'System',
    preview: 'Your booking confirmation has been sent.',
    time: 'Yesterday',
    isSystem: true,
  },
];

export default function ClientMessages() {
  const [activeId, setActiveId] = useState(1);
  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="flex h-[calc(100vh-5.75rem)] -m-6 rounded-lg overflow-hidden border">
      {/* Conversation list */}
      <div className="w-72 border-r bg-white flex flex-col">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left border-l-4 ${
                c.id === activeId ? 'bg-green-50 border-green-600' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <FaUserCircle className="text-2xl text-gray-400" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{c.preview}</p>
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
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-green-700 text-white px-6 py-3 flex items-center gap-3 shrink-0">
          <FaUserCircle className="text-2xl" />
          <div>
            <h2 className="font-semibold">{active.name}</h2>
            <p className="text-xs text-green-100">
              {active.isSystem ? 'Automated system notifications' : 'You are now directly talking to the Owner'}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-center mb-4">
            <span className="bg-gray-200 text-xs px-3 py-1 rounded-full text-gray-500">Today</span>
          </div>

          {active.isSystem ? (
            // System message — same look as a normal received message
            <div className="flex justify-start">
              <div className="max-w-md bg-white shadow rounded-lg px-4 py-3">
                <p className="text-sm">{active.preview}</p>
                <p className="text-xs text-gray-400 mt-2">10:35 AM</p>
              </div>
            </div>
          ) : (
            // Sent by client, so aligned right + green bubble
            <div className="flex justify-end">
              <div className="max-w-md bg-green-700 text-white rounded-lg px-4 py-3">
                <p className="text-sm">{active.preview}</p>
                <p className="text-xs text-green-100 mt-2 text-right">10:35 AM</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t flex items-center gap-3 shrink-0">
          <button className="text-gray-400 hover:text-gray-600">
            <FaPaperclip />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded px-4 py-2 text-sm"
          />
          <button className="bg-green-700 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-green-800">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
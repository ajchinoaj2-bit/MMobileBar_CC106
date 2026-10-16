
import { useEffect, useState } from 'react';
import {
  FaUserCircle,
  FaPaperclip,
  FaSlidersH,
  FaArrowLeft,
  FaSearch,
} from 'react-icons/fa';

import { getThread, sendMessage } from '../../utils/messages';
import { getNotifications, timeAgo } from '../../utils/notifications';

export default function ClientMessages() {
  const [activeId, setActiveId] = useState(1);
  const [thread, setThread] = useState([]);
  const [draft, setDraft] = useState('');
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [showChat, setShowChat] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem('currentUser') || 'null'
  );

  const clientName = currentUser?.fullname || 'Guest Client';

  const conversations = [
    { id: 1, name: 'Admin', isSystem: false },
    { id: 2, name: 'System', isSystem: true },
  ];

  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    const refresh = () => {
      if (activeId === 1) {
        setThread(getThread(clientName));
      } else {
        setSystemNotifications(getNotifications(clientName));
      }
    };

    refresh();

    window.addEventListener('mmb_notif_change', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('mmb_notif_change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [activeId, clientName]);

  const handleSend = () => {
    if (!draft.trim() || activeId !== 1) return;

    sendMessage(clientName, 'client', draft.trim());
    setThread(getThread(clientName));
    setDraft('');
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    setShowChat(true);
  };

  const latestSystemPreview =
    systemNotifications[0]?.body || 'No system notifications yet.';

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100dvh-5.75rem)] min-h-0 w-full min-w-0 -m-0 overflow-hidden rounded-lg border border-brass-100 sm:h-[calc(100vh-5.75rem)] sm:-m-6 sm:w-auto">
      {/* Conversation list */}
      <div
        className={`${
          showChat ? 'hidden sm:flex' : 'flex'
        } w-full min-w-0 flex-col border-r border-brass-100 bg-white sm:w-72 sm:shrink-0`}
      >
        <div className="shrink-0 p-3 sm:p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-w-0 rounded border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brass-500"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-charcoal-500">
              No conversations found.
            </p>
          ) : (
            filteredConversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectConversation(c.id)}
                className={`flex w-full min-w-0 items-center gap-3 border-l-4 px-4 py-3 text-left transition-colors ${
                  c.id === activeId
                    ? 'border-brass-500 bg-brass-100/60'
                    : 'border-transparent hover:bg-ivory-50'
                }`}
              >
                <FaUserCircle className="shrink-0 text-2xl text-gray-400" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-charcoal-800">
                      {c.name}
                    </span>
                  </div>

                  <p className="truncate text-xs text-charcoal-500">
                    {c.isSystem
                      ? latestSystemPreview
                      : 'Chat with the M Mobile Bar team'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-brass-100 px-4 py-3">
          <span className="text-sm font-semibold text-charcoal-800">
            Conversations
          </span>
          <FaSlidersH className="text-charcoal-500" />
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`${
          showChat ? 'flex' : 'hidden sm:flex'
        } min-h-0 min-w-0 flex-1 flex-col bg-ivory-50`}
      >
        {/* Chat header */}
        <div className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-bottle-900 to-forest-700 px-3 py-3 text-ivory-50 sm:gap-3 sm:px-6">
          <button
            type="button"
            onClick={() => setShowChat(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10 sm:hidden"
            aria-label="Back to conversations"
          >
            <FaArrowLeft />
          </button>

          <FaUserCircle className="shrink-0 text-2xl text-ivory-100/70" />

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold sm:text-base">
              {active.name}
            </h2>

            <p className="truncate text-[11px] text-ivory-100/70 sm:text-xs">
              {active.isSystem
                ? 'Automated system notifications'
                : 'You are now directly talking to the Owner'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6">
          <div className="mb-4 flex justify-center">
            <span className="rounded-full border border-brass-100 bg-white px-3 py-1 text-xs text-charcoal-500">
              Today
            </span>
          </div>

          {active.isSystem ? (
            <div className="space-y-3 sm:space-y-4">
              {systemNotifications.length === 0 && (
                <p className="text-center text-sm text-charcoal-500">
                  No system notifications yet.
                </p>
              )}

              {systemNotifications.map((n) => (
                <div key={n.id} className="flex justify-start">
                  <div className="w-fit max-w-[90%] rounded-lg bg-white px-3 py-3 shadow sm:max-w-md sm:px-4">
                    <p className="break-words text-sm font-medium text-charcoal-800">
                      {n.title}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-charcoal-800">
                      {n.body}
                    </p>

                    <p className="mt-2 text-xs text-charcoal-500">
                      {timeAgo(n.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {thread.length === 0 && (
                <p className="text-center text-sm text-charcoal-500">
                  No messages yet. Say hello!
                </p>
              )}

              {thread.map((m, i) => (
                <div
                  key={m.id ?? `${m.time}-${i}`}
                  className={`flex min-w-0 ${
                    m.from === 'client'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`w-fit max-w-[88%] break-words rounded-lg px-3 py-2.5 sm:max-w-md sm:px-4 sm:py-3 ${
                      m.from === 'client'
                        ? 'bg-brass-500 text-bottle-900'
                        : 'bg-white text-charcoal-800 shadow'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere]">
                      {m.text}
                    </p>

                    <p
                      className={`mt-2 text-[10px] sm:text-xs ${
                        m.from === 'client'
                          ? 'text-right text-bottle-900/60'
                          : 'text-charcoal-500'
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex shrink-0 items-center gap-2 border-t border-brass-100 bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:gap-3 sm:p-4"
        >
          <button
            type="button"
            disabled
            title="Attachments are not available yet"
            aria-label="Attachments unavailable"
            className="flex h-9 w-8 shrink-0 items-center justify-center text-charcoal-500 opacity-60 sm:w-9"
          >
            <FaPaperclip />
          </button>

          <input
            type="text"
            placeholder={
              active.isSystem
                ? 'System notifications cannot be replied to'
                : 'Type your message...'
            }
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={active.isSystem}
            className="h-10 min-w-0 flex-1 rounded border border-gray-300 px-3 text-sm outline-none focus:border-brass-500 disabled:bg-gray-100 sm:px-4"
          />

          <button
            type="submit"
            disabled={active.isSystem || !draft.trim()}
            className="h-10 shrink-0 rounded bg-brass-500 px-3 text-xs font-semibold text-bottle-900 transition-colors hover:bg-brass-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-sm"
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

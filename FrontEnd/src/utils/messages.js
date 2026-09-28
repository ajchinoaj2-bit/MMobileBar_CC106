import { addNotification } from './notifications';

const STORAGE_KEY = 'mmb_messages';

export function getAllThreads() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function saveAllThreads(threads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export function getThread(clientName) {
  const threads = getAllThreads();
  return threads[clientName] || [];
}

export function sendMessage(clientName, from, text, { silent = false } = {}) {
  const threads = getAllThreads();
  const thread = threads[clientName] || [];
  const newMsg = {
    from, // 'owner' | 'client'
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  threads[clientName] = [...thread, newMsg];
  saveAllThreads(threads);

  if (!silent) {
    addNotification({
      to: from === 'client' ? 'owner' : clientName,
      title: 'New Message',
      body: from === 'client' ? `Message from ${clientName}` : 'You have a new message from M Mobile Bar',
      link: from === 'client' ? '/owner/clients' : '/client/messages',
    });
  }
  return newMsg;
}
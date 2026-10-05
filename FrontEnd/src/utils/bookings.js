import { addNotification } from './notifications';
import { sendMessage } from './messages';

const STORAGE_KEY = 'mmb_bookings';

export function getBookings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(booking) {
  const bookings = getBookings();
  const newBooking = {
    id: bookings.length ? Math.max(...bookings.map((b) => b.id)) + 1 : 1,
    status: 'Pending',
    submitted: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    ...booking,
  };
  bookings.push(newBooking);
  saveBookings(bookings);

  addNotification({
    to: 'owner',
    title: 'New Booking Request',
    body: `${newBooking.client} requested "${newBooking.package}"`,
    link: `/owner/bookings/${newBooking.id}`,
  });

  addNotification({
    to: newBooking.client,
    title: 'Booking Confirmation Sent',
    body: `Your request for "${newBooking.package}" has been submitted and is awaiting approval.`,
    link: `/client/booking-history/${newBooking.id}`,
  });

  sendMessage(newBooking.client, 'client',
    `Hi! I just submitted a booking request for ${newBooking.package} on ${newBooking.date}.`,
    { silent: true });

  return newBooking;
}

export function updateBookingStatus(id, status) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);
  saveBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  if (!booking || booking.status === status) return;

  const approved = status === 'Approved';
  const declined = status === 'Declined';
  if (!approved && !declined) return;

  addNotification({
    to: booking.client,
    title: approved ? 'Booking Approved' : 'Booking Declined',
    body: `Your booking for ${booking.package} on ${booking.date} was ${status.toLowerCase()}.`,
    link: `/client/booking-history/${booking.id}`,
  });
  sendMessage(booking.client, 'owner', approved
    ? `Good news! Your booking for ${booking.package} on ${booking.date} has been approved.`
    : `Sorry, we couldn't accept your booking for ${booking.date}. Please message us for details.`,
    { silent: true });
}

export function attachPaymentProof(id, dataUrl) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);
  saveBookings(bookings.map((b) => (b.id === id ? { ...b, paymentProof: dataUrl } : b)));
  if (!booking) return;

  addNotification({
    to: 'owner',
    title: 'Payment Proof Uploaded',
    body: `${booking.client} uploaded payment proof for ${booking.package}`,
    link: `/owner/bookings/${booking.id}`,
  });
  sendMessage(booking.client, 'client',
    `I've uploaded my payment proof for booking #B-${booking.id}.`, { silent: true });
}

export function notifyReupload(id) {
  const booking = getBookings().find((b) => b.id === id);
  if (!booking) return;

  addNotification({
    to: booking.client,
    title: 'Payment Proof Needs Re-upload',
    body: `Please re-upload your payment proof for ${booking.package}.`,
    link: `/client/booking-history/${booking.id}`,
  });
  sendMessage(booking.client, 'owner',
    `Please re-upload your payment proof for booking #B-${booking.id}, the previous one was unclear.`,
    { silent: true });
}

import { addNotification } from './notifications';
import { sendMessage } from './messages';

const STORAGE_KEY = 'mmb_bookings';

export const MAX_EVENTS_PER_DAY = 3;

export function getBookings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function findBooking(bookings, id) {
  return bookings.find((b) => String(b.id) === String(id));
}

// Declined bookings don't take up a slot.
export function countBookingsOnDate(dateStr) {
  if (!dateStr) return 0;

  return getBookings().filter(
    (b) =>
      (b.form?.eventDate || b.date) === dateStr &&
      b.status !== 'Declined'
  ).length;
}

export function isDateFull(dateStr) {
  return countBookingsOnDate(dateStr) >= MAX_EVENTS_PER_DAY;
}

export function addBooking(booking) {
  if (isDateFull(booking.form?.eventDate || booking.date)) {
    return null;
  }

  const bookings = getBookings();

  const newBooking = {
    id: bookings.length
      ? Math.max(...bookings.map((b) => Number(b.id) || 0)) + 1
      : 1,
    status: 'Pending',
    submitted: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    reuploadRequested: false,
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

  sendMessage(
    newBooking.client,
    'client',
    `Hi! I just submitted a booking request for ${newBooking.package} on ${newBooking.date}.`,
    { silent: true }
  );

  return newBooking;
}

export function updateBookingStatus(id, status) {
  const bookings = getBookings();
  const booking = findBooking(bookings, id);

  if (!booking) return;

  saveBookings(
    bookings.map((b) =>
      String(b.id) === String(id) ? { ...b, status } : b
    )
  );

  if (booking.status === status) return;

  const approved = status === 'Approved';
  const declined = status === 'Declined';

  if (!approved && !declined) return;

  addNotification({
    to: booking.client,
    title: approved ? 'Booking Approved' : 'Booking Declined',
    body: `Your booking for ${booking.package} on ${booking.date} was ${status.toLowerCase()}.`,
    link: `/client/booking-history/${booking.id}`,
  });

  sendMessage(
    booking.client,
    'owner',
    approved
      ? `Good news! Your booking for ${booking.package} on ${booking.date} has been approved.`
      : `Sorry, we couldn't accept your booking for ${booking.date}. Please message us for details.`,
    { silent: true }
  );
}

// Save a new payment proof and clear the re-upload request.
export function attachPaymentProof(id, dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return false;
  }

  const bookings = getBookings();
  const booking = findBooking(bookings, id);

  if (!booking) return false;

  saveBookings(
    bookings.map((b) =>
      String(b.id) === String(id)
        ? {
            ...b,
            paymentProof: dataUrl,
            reuploadRequested: false,
            paymentProofUpdatedAt: new Date().toISOString(),
          }
        : b
    )
  );

  addNotification({
    to: 'owner',
    title: 'Payment Proof Uploaded',
    body: `${booking.client} uploaded payment proof for ${booking.package}`,
    link: `/owner/bookings/${booking.id}`,
  });

  sendMessage(
    booking.client,
    'client',
    `I've uploaded my payment proof for booking #B-${booking.id}.`,
    { silent: true }
  );

  return true;
}

// Save the request so the client page can display the upload form.
export function notifyReupload(id) {
  const bookings = getBookings();
  const booking = findBooking(bookings, id);

  if (!booking) return false;

  if (!booking.reuploadRequested) {
    saveBookings(
      bookings.map((b) =>
        String(b.id) === String(id)
          ? { ...b, reuploadRequested: true }
          : b
      )
    );

    addNotification({
      to: booking.client,
      title: 'Payment Proof Needs Re-upload',
      body: `Please re-upload your payment proof for ${booking.package}.`,
      link: `/client/booking-history/${booking.id}`,
    });

    sendMessage(
      booking.client,
      'owner',
      `Please re-upload your payment proof for booking #B-${booking.id}, the previous one was unclear.`,
      { silent: true }
    );
  }

  return true;
}

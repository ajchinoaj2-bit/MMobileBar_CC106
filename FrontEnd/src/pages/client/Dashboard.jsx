import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaCalendarAlt,
  FaArrowRight,
  FaTimes,
} from 'react-icons/fa';

import { getBookings } from '../../utils/bookings';
import { getPackages } from '../../utils/packages';
import PackageQuickView from '../../components/shared/PackageQuickView';

import MMOBILEBAR1 from '../../assets/images/MMOBILEBAR1.PNG';
import MMOBILEBAR1SIDE1 from '../../assets/images/MMOBILEBAR1SIDE1.PNG';
import MMOBILEBAR1SIDE2 from '../../assets/images/MMOBILEBAR1SIDE2.PNG';
import MMOBILEBAR2 from '../../assets/images/MMOBILEBAR2.PNG';
import MMOBILEBAR2SIDE1 from '../../assets/images/MMOBILEBAR2SIDE1.PNG';
import MMOBILEBAR2SIDE2 from '../../assets/images/MMOBILEBAR2SIDE2.PNG';

import MSETUP1 from '../../assets/images/msetup1.jpg';
import MSETUP2 from '../../assets/images/msetup2.jpg';
import MSETUP3 from '../../assets/images/msetup3.jpg';
import MSETUP4 from '../../assets/images/msetup4.jpg';
import MSETUP5 from '../../assets/images/msetup5.jpg';
import MSETUP6 from '../../assets/images/msetup6.jpg';

const packages = [
  {
    id: 1,
    name: 'The Classic Pour (Package 1)',
    desc: 'Standard mobile bar setup perfect for small to medium gatherings. Includes basic mixers and garnishes.',
    image: MMOBILEBAR1,
    leftImage: MMOBILEBAR1SIDE1,
    rightImage: MMOBILEBAR1SIDE2,
  },
  {
    id: 2,
    name: 'Premium Mixology (Package 2)',
    desc: 'Elevate your event with signature cocktails crafted by our expert mixologists.',
    image: MMOBILEBAR2,
    leftImage: MMOBILEBAR2SIDE1,
    rightImage: MMOBILEBAR2SIDE2,
  },
];

const eventHighlights = [
  { image: MSETUP1,  },
  { image: MSETUP2,  },
  { image: MSETUP3,  },
  { image: MSETUP4,  },
  { image: MSETUP5,  },
  { image: MSETUP6,  },
];

function getStepsForStatus(status) {
  if (status === 'Approved') {
    return [
      { label: 'Request Submitted', done: true },
      { label: 'Deposit Pending', done: true },
      { label: 'Menu Finalization', done: true, active: true },
      { label: 'Ready for Event', done: false },
    ];
  }

  if (status === 'Declined') {
    return [
      { label: 'Request Submitted', done: true },
      { label: 'Booking Declined', done: true, active: true },
    ];
  }

  return [
    { label: 'Request Submitted', done: true },
    { label: 'Deposit Pending', done: true, active: true },
    { label: 'Menu Finalization', done: false },
    { label: 'Ready for Event', done: false },
  ];
}

export default function ClientDashboard() {
  const navigate = useNavigate();

  const [latestBooking, setLatestBooking] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  useEffect(() => {
    const loadLatestBooking = () => {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
      );

      const allBookings = getBookings();

      const myBookings = currentUser
        ? allBookings.filter(
            (booking) => booking.client === currentUser.fullname
          )
        : allBookings;

      setLatestBooking(myBookings[myBookings.length - 1] || null);
    };

    loadLatestBooking();

    window.addEventListener('focus', loadLatestBooking);
    window.addEventListener('storage', loadLatestBooking);

    return () => {
      window.removeEventListener('focus', loadLatestBooking);
      window.removeEventListener('storage', loadLatestBooking);
    };
  }, []);

  const openQuickView = (pkg) => {
    const stored = getPackages().find(
      (item) => String(item.id) === String(pkg.id)
    );

    setQuickView({
      id: stored?.id ?? pkg.id,
      title: stored?.title || pkg.name,
      short: stored?.description || [],
      inclusions: stored?.inclusions || [],
      perks: stored?.perks || [],
      photos: [pkg.image, pkg.leftImage, pkg.rightImage],
    });
  };

  const bookingSteps = latestBooking
    ? getStepsForStatus(latestBooking.status)
    : [];

  const previousHighlight = () => {
    setHighlightIndex((current) =>
      current === 0 ? eventHighlights.length - 1 : current - 1
    );
  };

  const nextHighlight = () => {
    setHighlightIndex((current) =>
      (current + 1) % eventHighlights.length
    );
  };

  const visibleHighlights = Array.from(
    { length: 3 },
    (_, offset) =>
      eventHighlights[(highlightIndex + offset) % eventHighlights.length]
  );

  return (
    <div className="min-h-full bg-[#f5f1e7] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-4">
      
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3 xl:gap-6">
        {/* Left Column */}
        <div className="min-w-0 space-y-5 xl:col-span-2">
          {/* Available Packages */}
          <section>
            <div className="mb-3 flex items-end justify-between gap-3 border-b border-forest-700/50 pb-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-bottle-900">
                  Available Packages
                </h2>
                <p className="mt-1 text-xs text-charcoal-500">
                  Find the perfect bar setup for your event.
                </p>
              </div>


            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition duration-200 hover:shadow-md"
                >
                  <div className="grid h-36 grid-cols-3 gap-0.5 overflow-hidden bg-bottle-900 sm:h-40">
                    {[pkg.leftImage, pkg.image, pkg.rightImage].map(
                      (photo, index) => (
                        <div key={photo} className="overflow-hidden">
                          <img
                            src={photo}
                            alt={`${pkg.name} view ${index + 1}`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <h3 className="font-display text-sm font-semibold leading-5 text-bottle-900">
                      {pkg.name}
                    </h3>

                    <p className="mt-1.5 flex-1 text-xs leading-5 text-charcoal-500">
                      {pkg.desc}
                    </p>

                    <button
                      type="button"
                      onClick={() => openQuickView(pkg)}
                      className="mt-3 w-full rounded-md bg-brass-500 px-3 py-2.5 text-xs font-semibold text-bottle-900 transition hover:bg-brass-600 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Event Highlights */}
          <section className="overflow-hidden rounded-xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brass-500/15 text-forest-700">
                  <FaImages />
                </span>

                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold text-bottle-900">
                    Event Highlights
                  </h2>
                  <p className="mt-0.5 text-xs text-charcoal-500">
                    Explore our setups and get inspired for your event.
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-xs text-charcoal-500">
                {highlightIndex + 1} / {eventHighlights.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {visibleHighlights.map((highlight, index) => (
                <button
                  key={`${highlight.title}-${highlightIndex}-${index}`}
                  type="button"
                  onClick={() => setSelectedHighlight(highlight)}
                  className="group min-w-0 overflow-hidden rounded-lg bg-[#f6f2e8] text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brass-500"
                >
                  <div className="h-36 overflow-hidden sm:h-28 lg:h-32">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-bottle-900">
                      {highlight.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-charcoal-500">
                      Click to view photo
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousHighlight}
                  aria-label="Previous photos"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-forest-700 transition hover:bg-forest-700 hover:text-white"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={nextHighlight}
                  aria-label="Next photos"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-forest-700 transition hover:bg-forest-700 hover:text-white"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAllHighlights(true)}
                className="rounded-md bg-brass-500 px-5 py-2 text-xs font-semibold text-bottle-900 transition hover:bg-brass-600"
              >
                View All
              </button>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="space-y-4 xl:sticky xl:top-5">
          {/* Upcoming Booking */}
          <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass-500/15 text-forest-700">
                <FaCalendarAlt />
              </span>

              <div>
                <h2 className="font-display text-lg font-semibold text-bottle-900">
                  Upcoming Booking
                </h2>
                <p className="text-xs text-charcoal-500">
                  Your latest booking details
                </p>
              </div>
            </div>

            {latestBooking ? (
              <>
                <p className="text-sm font-semibold text-forest-700">
                  {latestBooking.date ||
                    latestBooking.form?.eventDate ||
                    'Date not set'}
                </p>

                <p className="mt-1 text-base font-semibold text-charcoal-800">
                  {latestBooking.event || 'Untitled Event'}
                </p>

                <p className="mt-1 text-sm text-charcoal-500">
                  {latestBooking.package || 'Package not specified'}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                  <span className="text-charcoal-500">
                    ID: #B-{latestBooking.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate('/client/booking-history')}
                    className="font-semibold text-forest-700 underline-offset-4 transition hover:text-brass-600 hover:underline"
                  >
                    Manage
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-lg bg-[#f6f2e8] p-4">
                <p className="text-sm text-charcoal-500">
                  No bookings yet. Browse a package to get started.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/client/booking-form')}
                  className="mt-3 text-xs font-semibold text-forest-700 hover:text-brass-600"
                >
                  Start a booking →
                </button>
              </div>
            )}
          </section>

          {/* Booking Status */}
          <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-bottle-900">
              Booking Status
            </h2>

            <p className="mb-5 mt-1 text-xs text-charcoal-500">
              Track your booking progress.
            </p>

            {bookingSteps.length > 0 ? (
              <div className="relative space-y-5">
                {bookingSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className="relative flex items-start gap-3"
                  >
                    {index < bookingSteps.length - 1 && (
                      <span
                        className={`absolute left-[6px] top-4 h-[calc(100%+0.25rem)] w-px ${
                          step.done ? 'bg-forest-700/40' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    <span
                      className={`relative z-10 mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                        step.done
                          ? 'border-forest-700 bg-forest-700'
                          : 'border-gray-300 bg-white'
                      }`}
                    />

                    <span
                      className={`text-sm leading-5 ${
                        step.active
                          ? 'font-semibold text-bottle-900'
                          : step.done
                            ? 'text-charcoal-800'
                            : 'text-charcoal-500/60'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-[#f6f2e8] p-4 text-sm text-charcoal-500">
                No active booking to track.
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate('/client/booking-history')}
              className="mt-5 w-full rounded-md border border-forest-700/20 px-3 py-2.5 text-xs font-semibold text-forest-700 transition hover:bg-forest-700 hover:text-white"
            >
              View Booking History
            </button>
          </section>
        </aside>
      </div>

      {/* Package Quick View */}
      {quickView && (
        <PackageQuickView
          data={quickView}
          onClose={() => setQuickView(null)}
          onBook={(id) => navigate(`/client/booking-form?pkg=${id}`)}
        />
      )}

{/* View All - Single Image Slideshow */}
{showAllHighlights && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    onClick={() => setShowAllHighlights(false)}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Event highlights slideshow"
      className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-7">
        <div>
          <h2 className="font-display text-xl font-semibold text-bottle-900">
            Event Highlights
          </h2>
          <p className="mt-1 text-sm text-charcoal-500">
            Browse our mobile bar setups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllHighlights(false)}
          aria-label="Close slideshow"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-charcoal-800 transition hover:bg-gray-200"
        >
          <FaTimes />
        </button>
      </div>

      {/* Single Image Viewer */}
      <div className="relative flex h-[45vh] min-h-[250px] max-h-[520px] items-center justify-center bg-[#f3f0e9] sm:h-[55vh]">
        <img
          src={eventHighlights[highlightIndex].image}
          alt={eventHighlights[highlightIndex].title}
          className="h-full w-full object-contain"
        />

        {/* Previous */}
        <button
          type="button"
          onClick={() =>
            setHighlightIndex((current) =>
              current === 0
                ? eventHighlights.length - 1
                : current - 1
            )
          }
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-bottle-900 shadow-lg transition hover:bg-brass-500 sm:left-5 sm:h-12 sm:w-12"
        >
          <FaChevronLeft />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={() =>
            setHighlightIndex((current) =>
              (current + 1) % eventHighlights.length
            )
          }
          aria-label="Next photo"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-bottle-900 shadow-lg transition hover:bg-brass-500 sm:right-5 sm:h-12 sm:w-12"
        >
          <FaChevronRight />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-1.5 text-xs font-medium text-white">
          {highlightIndex + 1} / {eventHighlights.length}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-7">
        <div>
          <h3 className="text-sm font-semibold text-bottle-900">
            {eventHighlights[highlightIndex].title}
          </h3>
          <p className="mt-1 text-xs text-charcoal-500">
            Photo {highlightIndex + 1} of {eventHighlights.length}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllHighlights(false)}
          className="rounded-md bg-brass-500 px-5 py-2.5 text-xs font-semibold text-bottle-900 transition hover:bg-brass-600"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}

      {/* Enlarged Photo */}
      {selectedHighlight && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedHighlight(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedHighlight.title}
            className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative bg-bottle-900">
              <img
                src={selectedHighlight.image}
                alt={selectedHighlight.title}
                className="max-h-[75vh] w-full object-contain"
              />

              <button
                type="button"
                onClick={() => setSelectedHighlight(null)}
                aria-label="Close enlarged image"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-bottle-900">
                {selectedHighlight.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

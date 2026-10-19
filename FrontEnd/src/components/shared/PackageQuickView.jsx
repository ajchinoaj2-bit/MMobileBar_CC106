
import { useState } from 'react';
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaImages,
  FaArrowRight,
  FaStar,
} from 'react-icons/fa';

import Mdrinks from '../../assets/images/Mdrinks.png';

function Section({ title, items, type = 'default' }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-6">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-forest-700">
        {title}
      </h3>

      <div className="rounded-xl border border-gray-100 bg-ivory-50/70 p-4 sm:p-5">
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-6 text-charcoal-800"
            >
              {type === 'check' ? (
                <FaCheckCircle className="mt-1 shrink-0 text-forest-700" />
              ) : (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" />
              )}

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function PackageQuickView({ data, onClose, onBook }) {
  const [i, setI] = useState(0);

  if (!data) return null;

  const {
    title,
    short,
    inclusions,
    photos = [],
  } = data;

  // Add Mdrinks.png to the existing package gallery.
  const galleryPhotos = [Mdrinks, ...photos];

  const hasPhotos = galleryPhotos.length > 0;
  const currentPhoto = hasPhotos
    ? galleryPhotos[i % galleryPhotos.length]
    : null;

  const prev = () => {
    if (!hasPhotos) return;

    setI(
      (current) =>
        (current - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  };

  const next = () => {
    if (!hasPhotos) return;

    setI((current) => (current + 1) % galleryPhotos.length);
  };

  const handleBook = () => {
    onBook?.(data.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-title"
        className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-r from-bottle-900 via-forest-800 to-forest-700 px-5 py-5 sm:px-8 sm:py-6">
          <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-12 h-32 w-32 rounded-full border border-white/10" />

          <div className="relative flex items-center justify-between gap-4 pr-10">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brass-400 sm:text-xs">
                <FaStar />
                M Mobile Bar
                <span className="text-white/40">/</span>
                Package Collection
              </div>

              <h2
                id="package-title"
                className="font-display text-xl font-bold leading-tight text-ivory-50 sm:text-2xl lg:text-3xl"
              >
                {title}
              </h2>

              <p className="mt-2 text-xs text-white/70 sm:text-sm">
                Explore the details and inclusions of this package.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close package details"
              className="absolute right-0 top-0 rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brass-400"
            >
              <FaTimes />
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 p-5 sm:gap-8 sm:p-7 lg:grid-cols-2 lg:gap-10 lg:p-9">

            {/* Left: Package information */}
            <div className="min-w-0">
              <div className="mb-6 border-b border-gray-100 pb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brass-600">
                  Package Overview
                </p>

                <h3 className="text-lg font-bold text-bottle-900 sm:text-xl">
                  Everything you need for your event
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Review the package description and included services
                  before making your booking.
                </p>
              </div>

              <Section
                title="About This Package"
                items={short}
              />

              <Section
                title="Package Inclusions"
                items={inclusions}
                type="check"
              />
            </div>

            {/* Right: Photo gallery */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-700">
                    Gallery
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-bottle-900">
                    Package Preview
                  </h3>
                </div>

                {hasPhotos && (
                  <span className="rounded-full bg-ivory-50 px-3 py-1.5 text-xs font-semibold text-forest-700">
                    {i + 1} / {galleryPhotos.length}
                  </span>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-ivory-50 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {currentPhoto ? (
                    <img
                      key={currentPhoto}
                      src={currentPhoto}
                      alt={`${title} package preview ${i + 1}`}
                      className="h-full w-full object-cover transition duration-500"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                      <FaImages className="text-4xl" />
                      <p className="text-sm">
                        No preview images available
                      </p>
                    </div>
                  )}

                  {galleryPhotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 p-3 text-bottle-900 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brass-500"
                      >
                        <FaChevronLeft />
                      </button>

                      <button
                        type="button"
                        onClick={next}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 p-3 text-bottle-900 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brass-500"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}

                  {hasPhotos && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-10">
                      <span className="text-xs font-medium text-white">
                        {title}
                      </span>

                      <span className="text-xs text-white/80">
                        Photo {i + 1}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail navigation */}
                {galleryPhotos.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
                    {galleryPhotos.map((photo, index) => (
                      <button
                        key={`${photo}-${index}`}
                        type="button"
                        onClick={() => setI(index)}
                        aria-label={`View photo ${index + 1}`}
                        aria-pressed={i === index}
                        className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-24 ${
                          i === index
                            ? 'border-brass-500 ring-2 ring-brass-500/20'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Information panel */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-forest-700/10 bg-forest-700/[0.04] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                  <FaCheckCircle />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-bottle-900">
                    Ready to plan your event?
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Continue to the booking form to provide your event
                    information and preferred schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <footer className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-bottle-900">
              Interested in this package?
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Continue to reserve your event.
            </p>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:flex-none"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleBook}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-brass-500 px-6 py-3 text-sm font-bold text-bottle-900 shadow-sm transition hover:bg-brass-600 focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2 sm:flex-none sm:min-w-48"
            >
              Book This Package
              <FaArrowRight />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

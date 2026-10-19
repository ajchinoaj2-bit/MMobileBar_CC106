import { useEffect, useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCloudUploadAlt,
  FaBoxOpen,
  FaCheckCircle,
} from 'react-icons/fa';

import logo from '../../assets/images/Mdrinks.png';
import {
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
} from '../../utils/packages';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  note: '',
  inclusions: '',
  addOns: '',
};

const linesToArray = (text = '') =>
  text.split('\n').map((line) => line.trim()).filter(Boolean);

const arrayToLines = (arr) =>
  Array.isArray(arr) ? arr.join('\n') : arr || '';

export default function Package() {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');

  const refreshPackages = () => {
    setPackages(getPackages());
  };

  useEffect(() => {
    refreshPackages();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title || '',
      description: arrayToLines(pkg.description),
      price: String(pkg.price ?? ''),
      note: pkg.notes || pkg.note || '',
      inclusions: arrayToLines(pkg.inclusions),
      addOns: arrayToLines(pkg.addOns),
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Please enter a package name.');
      return;
    }

    const packageData = {
      title: form.title.trim(),
      description: linesToArray(form.description),
      price: form.price.replace(/[₱,\s]/g, ''),
      inclusions: linesToArray(form.inclusions),
      addOns: linesToArray(form.addOns),
      notes: form.note.trim(),
    };

    try {
      if (editingId !== null) {
        updatePackage(editingId, packageData);
      } else {
        addPackage(packageData);
      }

      refreshPackages();
      closeModal();
    } catch {
      setError('Unable to save the package. Please try again.');
    }
  };

  const handleDelete = () => {
    if (confirmDelete === null) return;

    deletePackage(confirmDelete);
    refreshPackages();
    setConfirmDelete(null);
  };

  const formatPrice = (price) => {
    if (price === '' || price === null || price === undefined) {
      return 'Contact for price';
    }

    const amount = Number(String(price).replace(/[₱,\s]/g, ''));

    return Number.isFinite(amount)
      ? `₱${amount.toLocaleString('en-PH')}`
      : `₱${price}`;
  };

  return (
    <div className="min-h-full space-y-5">
   
      {/* Centered Available Packages and Add Button */}
      <div className="flex flex-col items-center gap-3 pb-1">
        <div className="flex items-center gap-3 rounded-lg border border-black/5 bg-white px-6 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brass-500/15 text-forest-700">
            <FaBoxOpen className="text-lg" />
          </div>

          <div className="text-center">
            <h2 className="font-display text-base font-semibold text-bottle-900">
              Available Packages
            </h2>
            <p className="text-xs text-charcoal-500">
              {packages.length}{' '}
              {packages.length === 1 ? 'package' : 'packages'} available
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brass-500 px-6 py-2.5 text-sm font-semibold text-bottle-900 shadow-sm transition hover:bg-brass-600"
        >
          <FaPlus />
          Add Package
        </button>
      </div>

      {/* Package Cards */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Package Image */}
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[#f3f0e9]">
                <img
                  src={pkg.image || logo}
                  alt={pkg.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-forest-700 shadow-sm">
                  Package
                </span>

                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(pkg)}
                    aria-label={`Edit ${pkg.title}`}
                    title="Edit package"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-forest-700 shadow-sm transition hover:bg-brass-500 hover:text-bottle-900"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDelete(pkg.id)}
                    aria-label={`Delete ${pkg.title}`}
                    title="Delete package"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Package Information */}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-display text-base font-semibold text-bottle-900">
                  {pkg.title}
                </h2>

                <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-charcoal-500">
                  {Array.isArray(pkg.description)
                    ? pkg.description.join(' ')
                    : pkg.description || 'No description added yet.'}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-[11px] text-charcoal-500">
                      Package Price
                    </p>
                    <p className="mt-0.5 font-display text-lg font-semibold text-forest-700">
                      {formatPrice(pkg.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditModal(pkg)}
                    className="rounded-md border border-forest-700/20 px-3 py-2 text-xs font-semibold text-forest-700 transition hover:bg-forest-700 hover:text-white"
                  >
                    Edit Details
                  </button>
                </div>

                {/* Compact Inclusions */}
                {(pkg.inclusions || []).length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-[#f6f2e8] p-3">
                    <FaCheckCircle className="mt-0.5 shrink-0 text-sm text-forest-700" />
                    <p className="line-clamp-2 text-xs leading-5 text-charcoal-700">
                      {Array.isArray(pkg.inclusions)
                        ? pkg.inclusions.join(' • ')
                        : pkg.inclusions}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brass-500/15 text-forest-700">
            <FaBoxOpen className="text-2xl" />
          </div>

          <h2 className="mt-4 font-display text-lg font-semibold text-bottle-900">
            No packages yet
          </h2>

          <p className="mt-1 max-w-sm text-sm text-charcoal-500">
            Add your first package to make it available on the client dashboard.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-brass-500 px-4 py-2.5 text-sm font-semibold text-bottle-900 transition hover:bg-brass-600"
          >
            <FaPlus />
            Add First Package
          </button>
        </div>
      )}

      {/* Add / Edit Package Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingId !== null ? 'Edit package' : 'Add package'}
            className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-bottle-900 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  {editingId !== null ? 'Edit Package' : 'Add New Package'}
                </h2>
                <p className="mt-1 text-xs text-white/65">
                  Keep package details clear and easy for clients to understand.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-brass-400"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5 sm:p-6">
                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div>
                  <label className="text-xs font-semibold text-charcoal-800">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={handleChange('title')}
                    placeholder="e.g. The Classic Pour"
                    className="mt-1.5 w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brass-500 focus:ring-2 focus:ring-brass-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-800">
                      Price (₱)
                    </label>
                    <input
                      type="text"
                      value={form.price}
                      onChange={handleChange('price')}
                      placeholder="e.g. 10,000"
                      className="mt-1.5 w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brass-500 focus:ring-2 focus:ring-brass-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800">
                      Note <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.note}
                      onChange={handleChange('note')}
                      placeholder="Additional information"
                      className="mt-1.5 w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brass-500 focus:ring-2 focus:ring-brass-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800">
                    Short Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder="Describe the package..."
                    rows={2}
                    className="mt-1.5 w-full resize-y rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brass-500 focus:ring-2 focus:ring-brass-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800">
                    Package Inclusions
                  </label>
                  <textarea
                    value={form.inclusions}
                    onChange={handleChange('inclusions')}
                    placeholder="Enter one inclusion per line"
                    rows={3}
                    className="mt-1.5 w-full resize-y rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brass-500 focus:ring-2 focus:ring-brass-500/20"
                  />
                  <p className="mt-1 text-[11px] text-charcoal-500">
                    Enter each item on a separate line.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800">
                    Add-ons
                  </label>
                  <textarea
                    value={form.addOns}
                    onChange={handleChange('addOns')}
                    placeholder="Enter one add-on per line"
                    rows={2}
                    className="mt-1.5 w-full resize-y rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-brass-500 focus:ring-2 focus:ring-brass-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800">
                    Package Image
                  </label>
                  <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-dashed border-brass-400/70 bg-[#f6f2e8] p-4">
                    <FaCloudUploadAlt className="shrink-0 text-2xl text-forest-700" />
                    <div>
                      <p className="text-sm font-medium text-bottle-900">
                        Image upload
                      </p>
                      <p className="mt-1 text-xs leading-5 text-charcoal-500">
                        This is a placeholder. File upload needs to be connected to storage before new images can be saved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-brass-500 px-5 py-2.5 text-sm font-semibold text-bottle-900 transition hover:bg-brass-600"
                >
                  {editingId !== null ? 'Save Changes' : 'Add Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FaTrash />
            </div>

            <h2 className="mt-4 text-center font-display text-lg font-semibold text-bottle-900">
              Delete this package?
            </h2>

            <p className="mt-2 text-center text-sm leading-5 text-charcoal-500">
              This will remove the package from the available package list. This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-charcoal-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
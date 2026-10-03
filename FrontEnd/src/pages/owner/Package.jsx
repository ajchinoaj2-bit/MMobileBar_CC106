import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import logo from '../../assets/images/Mdrinks.png';
import { getPackages, addPackage, updatePackage, deletePackage } from '../../utils/packages';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  note: '',
  inclusions: '',
  addOns: '',
};

const linesToArray = (text) =>
  text.split('\n').map((line) => line.trim()).filter(Boolean);

const arrayToLines = (arr) => (arr || []).join('\n');

export default function Package() {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setPackages(getPackages());
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      description: arrayToLines(pkg.description),
      price: pkg.price,
      note: pkg.notes || '',
      inclusions: arrayToLines(pkg.inclusions),
      addOns: arrayToLines(pkg.addOns),
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    const packageData = {
      title: form.title,
      description: linesToArray(form.description),
      price: form.price.replace(/[₱,]/g, ''),
      inclusions: linesToArray(form.inclusions),
      addOns: linesToArray(form.addOns),
      notes: form.note,
    };

    if (editingId) {
      updatePackage(editingId, packageData);
    } else {
      addPackage(packageData);
    }

    setPackages(getPackages());
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    deletePackage(id);
    setPackages(getPackages());
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brass-500 text-bottle-900 font-medium text-sm px-4 py-2 rounded-md hover:bg-brass-600 transition-colors"
        >
          <FaPlus />
          Add New Package
        </button>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <div className="bg-gradient-to-br from-bottle-900 to-forest-700 px-5 py-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ivory-50">{pkg.title}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="text-ivory-100/70 hover:text-brass-400 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-ivory-100/70 hover:text-red-400 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="mb-3">
                <h3 className="text-xs font-bold text-forest-700 mb-1 tracking-wide">Short Description</h3>
                <div className="bg-ivory-50 rounded-md p-2.5 text-xs text-charcoal-800 space-y-0.5">
                  {(pkg.description || []).map((item, i) => <p key={i}>• {item}</p>)}
                </div>
              </div>

              <div className="mb-3">
                <h3 className="text-xs font-bold text-forest-700 mb-1 tracking-wide">Price</h3>
                <div className="bg-brass-100 border border-brass-400/50 rounded-md px-3 py-1.5 text-sm font-semibold text-bottle-900">
                  ₱{pkg.price}
                </div>
              </div>

              <div className="mb-3">
                <h3 className="text-xs font-bold text-forest-700 mb-1 tracking-wide">All Package Inclusion</h3>
                <div className="bg-ivory-50 rounded-md p-2.5 text-xs text-charcoal-800 space-y-0.5">
                  {(pkg.inclusions || []).map((item, i) => <p key={i}>• {item}</p>)}
                </div>
              </div>

              <div className="mb-3">
                <h3 className="text-xs font-bold text-forest-700 mb-1 tracking-wide">Add Ons</h3>
                <div className="bg-ivory-50 rounded-md p-2.5 text-xs text-charcoal-800 space-y-0.5">
                  {(pkg.addOns || []).map((item, i) => <p key={i}>• {item}</p>)}
                </div>
              </div>

              <div className="bg-ivory-50 rounded-md flex items-center justify-center overflow-hidden py-2">
                <img src={pkg.image || logo} alt={pkg.title} className="h-14 object-contain" />
              </div>

              {pkg.notes && (
                <div className="mt-2">
                  <h3 className="text-xs font-bold text-forest-700">NOTE:</h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">{pkg.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[480px] max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="bg-gradient-to-br from-bottle-900 to-forest-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="font-display text-lg font-semibold text-ivory-50">
                {editingId ? 'Edit Package' : 'Add New Package'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); }}
                className="text-ivory-100/70 hover:text-brass-400"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-800">Package Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  placeholder="e.g. Package 1"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">Short Description</label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Describe the package... (one line per bullet)"
                  rows={3}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal-800">Price</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={handleChange('price')}
                    placeholder="e.g. 10,000"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-800">Note</label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={handleChange('note')}
                    placeholder="Optional..."
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">Package Inclusions</label>
                <textarea
                  value={form.inclusions}
                  onChange={handleChange('inclusions')}
                  placeholder="List the inclusions of this package... (one line per bullet)"
                  rows={3}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">Add Ons</label>
                <textarea
                  value={form.addOns}
                  onChange={handleChange('addOns')}
                  placeholder="List available add-ons... (one line per bullet)"
                  rows={3}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">Package Image</label>
                <div className="mt-1 border-2 border-dashed border-brass-400/50 bg-ivory-50 rounded-md p-6 flex flex-col items-center justify-center text-charcoal-500 text-xs">
                  <FaCloudUploadAlt className="text-xl mb-1 text-brass-500" />
                  Click to upload an image
                  <span className="text-[10px]">JPG, PNG up to 30mb</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); }}
                className="rounded border border-gray-300 px-5 py-2 text-sm text-charcoal-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded bg-brass-500 px-5 py-2 text-sm font-medium text-bottle-900 hover:bg-brass-600 transition-colors"
              >
                {editingId ? 'Update Package' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
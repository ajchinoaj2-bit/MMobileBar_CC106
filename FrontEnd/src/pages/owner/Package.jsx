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
      price: form.price.replace(/[₱,]/g, ''), // store as plain number string, e.g. "12500"
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
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div></div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <FaPlus />
          Add New Package
        </button>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-gray-200 rounded-lg p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800">{pkg.title}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="text-gray-700 hover:text-green-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 mb-2">Short Description</h3>
              <div className="bg-white rounded-md p-3 text-xs text-gray-600 space-y-1">
                {(pkg.description || []).map((item, i) => <p key={i}>• {item}</p>)}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 mb-2">Price</h3>
              <div className="bg-white rounded-md px-3 py-2 text-sm text-gray-700">₱{pkg.price}</div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 mb-2">All Package Inclusion</h3>
              <div className="bg-white rounded-md p-3 text-xs text-gray-600 space-y-1">
                {(pkg.inclusions || []).map((item, i) => <p key={i}>• {item}</p>)}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 mb-2">Add Ons</h3>
              <div className="bg-white rounded-md p-3 text-xs text-gray-600 space-y-1">
                {(pkg.addOns || []).map((item, i) => <p key={i}>• {item}</p>)}
              </div>
            </div>

            <div className="bg-white rounded-md flex-1 flex items-center justify-center overflow-hidden">
              <img src={pkg.image || logo} alt={pkg.title} className="h-20 object-contain" />
            </div>

            {pkg.notes && (
              <div className="mt-4 shrink-0">
                <h3 className="text-xs font-bold text-gray-700">NOTE:</h3>
                <p className="text-xs text-gray-600 mt-1">{pkg.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[480px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Package' : 'Add New Package'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); }}
                className="text-gray-500 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700">Package Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  placeholder="e.g. Package 1"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Short Description</label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Describe the package... (one line per bullet)"
                  rows={3}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Price</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={handleChange('price')}
                    placeholder="e.g. 10,000"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Note</label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={handleChange('note')}
                    placeholder="Optional..."
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Package Inclusions</label>
                <textarea
                  value={form.inclusions}
                  onChange={handleChange('inclusions')}
                  placeholder="List the inclusions of this package... (one line per bullet)"
                  rows={3}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Add Ons</label>
                <textarea
                  value={form.addOns}
                  onChange={handleChange('addOns')}
                  placeholder="List available add-ons... (one line per bullet)"
                  rows={3}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Package Image</label>
                <div className="mt-1 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-gray-400 text-xs">
                  <FaCloudUploadAlt className="text-xl mb-1" />
                  Click to upload an image
                  <span className="text-[10px]">JPG, PNG up to 30mb</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); }}
                className="rounded border border-gray-400 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded bg-[#063d27] px-5 py-2 text-sm font-medium text-white hover:bg-[#075536]"
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
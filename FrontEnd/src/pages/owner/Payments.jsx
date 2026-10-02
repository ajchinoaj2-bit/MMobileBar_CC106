import { useEffect, useState } from 'react';
import {
  FaWallet,
  FaCheckCircle,
  FaClock,
  FaUndo,
  FaPlus,
  FaTimes,
  FaUniversity,
  FaPaypal,
} from 'react-icons/fa';
import { getBookings } from '../../utils/bookings';

export default function Payments() {
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const sumBy = (status) =>
    bookings.filter((b) => b.status === status).reduce((sum, b) => sum + (b.price || 0), 0);

  const completed = sumBy('Approved');
  const pending = sumBy('Pending');
  const refunded = sumBy('Declined');
  const total = completed + pending;

  const paymentMethods = [
    { name: 'GCash', icon: 'G', accountLabel: 'Connected Account', account: '09********45', transactions: '156' },
    { name: 'PayPal', icon: <FaPaypal />, accountLabel: 'Connected Account', account: 'm.mobilebar@gmail.com', transactions: '67' },
    { name: 'Bank Transfer', icon: <FaUniversity />, accountLabel: 'Account Name', account: 'M Mobile Bar Events', transactions: '98' },
    { name: 'MariBank', icon: 'M', accountLabel: 'Connected Account', account: 'm.mobilebar@gmail.com', transactions: '67' },
  ];

  return (
    <div className="h-full w-full overflow-hidden bg-ivory-50 px-8 py-7">
      <div className="mb-8"></div>

      {/* PAYMENT SUMMARY */}
      <div className="grid grid-cols-4 gap-6">
        <div className="h-[120px] rounded-md border border-brass-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-charcoal-800">
            <FaWallet className="text-forest-700" />
            <span>Total Payments</span>
          </div>
          <p className="mt-2 text-[24px] font-display font-bold text-bottle-900">₱{total.toLocaleString()}.00</p>
          <p className="text-sm text-charcoal-500">All times payment received</p>
        </div>

        <div className="h-[120px] rounded-md border border-brass-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-charcoal-800">
            <FaCheckCircle className="text-forest-700" />
            <span>Completed Payments</span>
          </div>
          <p className="mt-2 text-[24px] font-display font-bold text-bottle-900">₱{completed.toLocaleString()}.00</p>
          <p className="text-sm text-charcoal-500">Successfully processed</p>
        </div>

        <div className="h-[120px] rounded-md border border-brass-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-charcoal-800">
            <FaClock className="text-brass-600" />
            <span>Pending Payments</span>
          </div>
          <p className="mt-2 text-[24px] font-display font-bold text-bottle-900">₱{pending.toLocaleString()}.00</p>
          <p className="text-sm text-charcoal-500">Awaiting verification</p>
        </div>

        <div className="h-[120px] rounded-md border border-brass-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-charcoal-800">
            <FaUndo className="text-red-500" />
            <span>Refunded Payments</span>
          </div>
          <p className="mt-2 text-[24px] font-display font-bold text-bottle-900">₱{refunded.toLocaleString()}.00</p>
          <p className="text-sm text-charcoal-500">Total refunded</p>
        </div>
      </div>

      {/* PAYMENT METHODS HEADER */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-[22px] font-bold text-bottle-900">Payment Methods</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-bottle-900 hover:bg-brass-600 transition-colors"
        >
          <FaPlus />
          Add Payment Methods
        </button>
      </div>

      {/* PAYMENT METHOD CARDS */}
      <div className="mt-5 grid grid-cols-2 gap-8">
        {paymentMethods.map((method) => (
          <div key={method.name} className="h-[110px] w-full border border-brass-200 bg-white px-4 py-3 shadow-sm rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ivory-100 text-lg font-bold text-bottle-900">
                  {method.icon}
                </div>
                <span className="text-[16px] font-semibold text-charcoal-800">{method.name}</span>
              </div>
              <span className="rounded-md bg-forest-700/10 px-3 py-1 text-xs font-medium text-forest-700">Active</span>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-xs text-charcoal-500">{method.accountLabel}</p>
                <p className="mt-1 text-sm text-charcoal-800">{method.account}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-charcoal-500">Transactions</p>
                <p className="mt-1 text-sm text-charcoal-800">{method.transactions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PAYMENT METHOD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[420px] rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-brass-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-bottle-900">Add Payment Method</h2>
                <p className="text-xs text-charcoal-500">Add a new payment method to accept from customers.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-charcoal-500 hover:text-forest-700">
                <FaTimes />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-800">
                  Payment Method Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCash, PayPal, Bank Transfer"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">
                  Payment Type<span className="text-red-500">*</span>
                </label>
                <select className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500">
                  <option>Select payment type</option>
                  <option>Mobile Wallet</option>
                  <option>Bank Transfer</option>
                  <option>Online Payment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">
                  Account / Recipient Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Juan Dela Cruz / My Business"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">
                  Account Number / Email / Mobile No.<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 09171234567 / example@gmail.com"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">Transaction Fee (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800">
                  Status<span className="text-red-500">*</span>
                </label>
                <select className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="rounded-md bg-forest-700/10 px-3 py-2 text-xs text-forest-700">
                Active payment methods will be available during checkout.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded border border-gray-300 px-5 py-2 text-sm text-charcoal-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded bg-brass-500 px-5 py-2 text-sm font-medium text-bottle-900 hover:bg-brass-600 transition-colors"
              >
                Save Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
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

export default function Payments() {
  const [showModal, setShowModal] = useState(false);

  const paymentMethods = [
    {
      name: 'GCash',
      icon: 'G',
      accountLabel: 'Connected Account',
      account: '09********45',
      transactions: '156',
    },
    {
      name: 'PayPal',
      icon: <FaPaypal />,
      accountLabel: 'Connected Account',
      account: 'm.mobilebar@gmail.com',
      transactions: '67',
    },
    {
      name: 'Bank Transfer',
      icon: <FaUniversity />,
      accountLabel: 'Account Name',
      account: 'M Mobile Bar Events',
      transactions: '98',
    },
    {
      name: 'MariBank',
      icon: 'M',
      accountLabel: 'Connected Account',
      account: 'm.mobilebar@gmail.com',
      transactions: '67',
    },
  ];

  return (
    <div className="h-full w-full overflow-hidden bg-gray-50 px-8 py-7">

      {/* PAGE HEADER */}
      <div className="mb-8">
      </div>

      {/* PAYMENT SUMMARY */}
      <div className="grid grid-cols-4 gap-6">

        {/* TOTAL PAYMENTS */}
        <div className="h-[120px] rounded-md border border-gray-400 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaWallet className="text-green-600" />
            <span>Total Payments</span>
          </div>

          <p className="mt-2 text-[24px] font-bold text-black">
            $125,800.00
          </p>

          <p className="text-sm text-gray-500">
            All times payment received
          </p>
        </div>

        {/* COMPLETED PAYMENTS */}
        <div className="h-[120px] rounded-md border border-gray-400 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaCheckCircle className="text-green-600" />
            <span>Completed Payments</span>
          </div>

          <p className="mt-2 text-[24px] font-bold text-black">
            $100,800.00
          </p>

          <p className="text-sm text-gray-500">
            Successfully processed
          </p>
        </div>

        {/* PENDING PAYMENTS */}
        <div className="h-[120px] rounded-md border border-gray-400 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaClock className="text-yellow-500" />
            <span>Pending Payments</span>
          </div>

          <p className="mt-2 text-[24px] font-bold text-black">
            $18,800.00
          </p>

          <p className="text-sm text-gray-500">
            Awaiting verification
          </p>
        </div>

        {/* REFUNDED PAYMENTS */}
        <div className="h-[120px] rounded-md border border-gray-400 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaUndo className="text-red-500" />
            <span>Refunded Payments</span>
          </div>

          <p className="mt-2 text-[24px] font-bold text-black">
            $5,800.00
          </p>

          <p className="text-sm text-gray-500">
            Total refunded
          </p>
        </div>
      </div>

      {/* PAYMENT METHODS HEADER */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-black">
          Payment Methods
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md bg-[#063d27] px-4 py-2 text-sm font-medium text-white hover:bg-[#075536]"
        >
          <FaPlus />
          Add Payment Methods
        </button>
      </div>

      {/* PAYMENT METHOD CARDS */}
      <div className="mt-5 grid grid-cols-2 gap-8">

        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="h-[110px] w-full border border-gray-400 bg-white px-4 py-3 shadow-sm"
          >
            {/* CARD TOP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-lg font-bold text-black">
                  {method.icon}
                </div>

                <span className="text-[16px] font-semibold text-gray-800">
                  {method.name}
                </span>
              </div>

              <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>

            {/* CARD BOTTOM */}
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  {method.accountLabel}
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {method.account}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">
                  Transactions
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {method.transactions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PAYMENT METHOD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-[420px] rounded-lg bg-white p-6 shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Add Payment Method
                </h2>

                <p className="text-xs text-gray-500">
                  Add a new payment method to accept from customers.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}
            <div className="mt-5 space-y-4">

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Payment Method Name<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. GCash, PayPal, Bank Transfer"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Payment Type<span className="text-red-500">*</span>
                </label>

                <select className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600">
                  <option>Select payment type</option>
                  <option>Mobile Wallet</option>
                  <option>Bank Transfer</option>
                  <option>Online Payment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Account / Recipient Name<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Juan Dela Cruz / My Business"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Account Number / Email / Mobile No.<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. 09171234567 / example@gmail.com"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Transaction Fee (%)
                </label>

                <input
                  type="number"
                  placeholder="0"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Status<span className="text-red-500">*</span>
                </label>

                <select className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="rounded-md bg-green-100 px-3 py-2 text-xs text-green-700">
                Active payment methods will be available during checkout.
              </div>
            </div>

            {/* MODAL BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded border border-gray-400 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="rounded bg-[#063d27] px-5 py-2 text-sm font-medium text-white hover:bg-[#075536]"
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
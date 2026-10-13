
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

const initialPaymentMethods = [
  {
    id: 1,
    name: 'GCash',
    icon: 'G',
    type: 'Mobile Wallet',
    accountLabel: 'Mobile Number',
    account: '09********45',
    recipient: 'M Mobile Bar Events',
    transactions: 156,
    fee: 0,
    status: 'Active',
  },
  {
    id: 2,
    name: 'PayPal',
    icon: 'paypal',
    type: 'Online Payment',
    accountLabel: 'Account Email',
    account: 'm.mobilebar@gmail.com',
    recipient: 'M Mobile Bar Events',
    transactions: 67,
    fee: 0,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Bank Transfer',
    icon: 'bank',
    type: 'Bank Transfer',
    accountLabel: 'Account Name',
    account: 'M Mobile Bar Events',
    recipient: 'M Mobile Bar Events',
    transactions: 98,
    fee: 0,
    status: 'Active',
  },
  {
    id: 4,
    name: 'MariBank',
    icon: 'M',
    type: 'Mobile Wallet',
    accountLabel: 'Account Details',
    account: 'm.mobilebar@gmail.com',
    recipient: 'M Mobile Bar Events',
    transactions: 67,
    fee: 0,
    status: 'Active',
  },
];

const availablePaymentMethods = [
  { name: 'GCash', type: 'Mobile Wallet', icon: 'G' },
  { name: 'MariBank', type: 'Mobile Wallet', icon: 'M' },
  { name: 'Bank Transfer', type: 'Bank Transfer', icon: 'bank' },
  { name: 'PayPal', type: 'Online Payment', icon: 'paypal' },
];

const emptyForm = {
  name: '',
  type: '',
  recipient: '',
  account: '',
  fee: '0',
  status: 'Active',
};

export default function Payments() {
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const availableMethods = availablePaymentMethods.filter(
    (option) =>
      !paymentMethods.some((method) => method.name === option.name)
  );

  const sumBy = (status) =>
    bookings
      .filter((booking) => booking.status === status)
      .reduce((sum, booking) => sum + (Number(booking.price) || 0), 0);

  const completed = sumBy('Approved');
  const pending = sumBy('Pending');
  const refunded = sumBy('Declined');
  const total = completed + pending;

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods((prev) =>
      prev.filter((method) => method.id !== id)
    );
  };

  const savePaymentMethod = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.type ||
      !form.recipient.trim() ||
      !form.account.trim() ||
      paymentMethods.some((method) => method.name === form.name)
    ) {
      return;
    }

    const selectedMethod = availablePaymentMethods.find(
      (method) => method.name === form.name
    );

    if (!selectedMethod) return;

    const newMethod = {
      id: Date.now(),
      name: selectedMethod.name,
      icon: selectedMethod.icon,
      type: selectedMethod.type,
      accountLabel:
        selectedMethod.name === 'GCash'
          ? 'Mobile Number'
          : selectedMethod.name === 'PayPal'
            ? 'Account Email'
            : selectedMethod.name === 'MariBank'
              ? 'Account Details'
              : 'Account Name',
      account: form.account.trim(),
      recipient: form.recipient.trim(),
      transactions: 0,
      fee: Number(form.fee) || 0,
      status: form.status,
    };

    setPaymentMethods((prev) => [...prev, newMethod]);
    closeModal();
  };

  const summaryCardClass =
    'min-h-[110px] rounded-lg border border-forest-700 bg-gradient-to-br from-bottle-900 to-forest-700 px-5 py-4 text-ivory-50 shadow';

  return (
    <div className="min-h-[calc(100vh-9rem)]">
      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {/* Total Payments */}
        <div className={summaryCardClass}>
          <div className="flex items-center gap-2 text-sm text-ivory-100/80">
            <FaWallet className="text-brass-400" />
            <span>Total Payments</span>
          </div>

          <p className="mt-2 text-[22px] font-display font-bold text-brass-400 md:text-[24px]">
            ₱{total.toLocaleString()}.00
          </p>

          <p className="text-sm text-ivory-100/60">
            All times payment received
          </p>
        </div>

        {/* Completed Payments */}
        <div className={summaryCardClass}>
          <div className="flex items-center gap-2 text-sm text-ivory-100/80">
            <FaCheckCircle className="text-brass-400" />
            <span>Completed Payments</span>
          </div>

          <p className="mt-2 text-[22px] font-display font-bold text-brass-400 md:text-[24px]">
            ₱{completed.toLocaleString()}.00
          </p>

          <p className="text-sm text-ivory-100/60">
            Successfully processed
          </p>
        </div>

        {/* Pending Payments */}
        <div className={summaryCardClass}>
          <div className="flex items-center gap-2 text-sm text-ivory-100/80">
            <FaClock className="text-brass-400" />
            <span>Pending Payments</span>
          </div>

          <p className="mt-2 text-[22px] font-display font-bold text-brass-400 md:text-[24px]">
            ₱{pending.toLocaleString()}.00
          </p>

          <p className="text-sm text-ivory-100/60">
            Awaiting verification
          </p>
        </div>

        {/* Refunded Payments */}
        <div className={summaryCardClass}>
          <div className="flex items-center gap-2 text-sm text-ivory-100/80">
            <FaUndo className="text-brass-400" />
            <span>Refunded Payments</span>
          </div>

          <p className="mt-2 text-[22px] font-display font-bold text-brass-400 md:text-[24px]">
            ₱{refunded.toLocaleString()}.00
          </p>

          <p className="text-sm text-ivory-100/60">
            Total refunded
          </p>
        </div>
      </div>

      {/* Payment Methods Heading */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-[20px] font-bold text-bottle-900 md:text-[22px]">
          Payment Methods
        </h2>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          disabled={availableMethods.length === 0}
          className="flex items-center justify-center gap-2 rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-bottle-900 transition-colors hover:bg-brass-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaPlus />
          Add Payment Method
        </button>
      </div>

      {availableMethods.length === 0 && (
        <p className="mt-2 text-sm text-charcoal-500">
          All four payment methods have been added.
        </p>
      )}

      {/* Payment Method Cards */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="min-h-[110px] w-full rounded-md border border-brass-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ivory-100 text-lg font-bold text-bottle-900">
                  {method.icon === 'paypal' ? (
                    <FaPaypal />
                  ) : method.icon === 'bank' ? (
                    <FaUniversity />
                  ) : (
                    method.icon
                  )}
                </div>

                <span className="break-words text-[16px] font-semibold text-charcoal-800">
                  {method.name}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    method.status === 'Active'
                      ? 'bg-forest-700/10 text-forest-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {method.status}
                </span>

                <button
                  type="button"
                  onClick={() => removePaymentMethod(method.id)}
                  aria-label={`Remove ${method.name}`}
                  title={`Remove ${method.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-charcoal-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-charcoal-500">
                  {method.accountLabel}
                </p>

                <p className="mt-1 break-all text-sm text-charcoal-800">
                  {method.account}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-charcoal-500">
                  Transactions
                </p>

                <p className="mt-1 text-sm text-charcoal-800">
                  {method.transactions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Payment Method Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={savePaymentMethod}
            className="max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-brass-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-bottle-900">
                  Add Payment Method
                </h2>

                <p className="text-xs text-charcoal-500">
                  Configure how customers can pay M Mobile Bar.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="text-charcoal-500 hover:text-forest-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Payment Method */}
              <div>
                <label
                  htmlFor="payment-name"
                  className="text-xs font-semibold text-charcoal-800"
                >
                  Payment Method *
                </label>

                <select
                  id="payment-name"
                  required
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    const selected = availablePaymentMethods.find(
                      (method) => method.name === e.target.value
                    );

                    setForm((prev) => ({
                      ...prev,
                      name: selected?.name || '',
                      type: selected?.type || '',
                    }));
                  }}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                >
                  <option value="">Select payment method</option>

                  {availableMethods.map((method) => (
                    <option key={method.name} value={method.name}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Name */}
              <div>
                <label
                  htmlFor="payment-recipient"
                  className="text-xs font-semibold text-charcoal-800"
                >
                  Account / Recipient Name *
                </label>

                <input
                  id="payment-recipient"
                  required
                  name="recipient"
                  value={form.recipient}
                  onChange={updateForm}
                  placeholder="e.g. M Mobile Bar Events"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              {/* Account Details */}
              <div>
                <label
                  htmlFor="payment-account"
                  className="text-xs font-semibold text-charcoal-800"
                >
                  {form.name === 'GCash'
                    ? 'GCash Mobile Number *'
                    : form.name === 'MariBank'
                      ? 'MariBank Account Details *'
                      : form.name === 'PayPal'
                        ? 'PayPal Email Address *'
                        : form.name === 'Bank Transfer'
                          ? 'Bank Account Number *'
                          : 'Account Number / Email / Mobile Number *'}
                </label>

                <input
                  id="payment-account"
                  required
                  name="account"
                  value={form.account}
                  onChange={updateForm}
                  placeholder={
                    form.name === 'GCash'
                      ? 'e.g. 09171234567'
                      : form.name === 'PayPal'
                        ? 'e.g. example@gmail.com'
                        : form.name === 'MariBank'
                          ? 'Enter MariBank account details'
                          : form.name === 'Bank Transfer'
                            ? 'Enter bank account number'
                            : 'Enter account details'
                  }
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              {/* Transaction Fee */}
              <div>
                <label
                  htmlFor="payment-fee"
                  className="text-xs font-semibold text-charcoal-800"
                >
                  Transaction Fee (%)
                </label>

                <input
                  id="payment-fee"
                  type="number"
                  name="fee"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.fee}
                  onChange={updateForm}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="payment-status"
                  className="text-xs font-semibold text-charcoal-800"
                >
                  Status *
                </label>

                <select
                  id="payment-status"
                  required
                  name="status"
                  value={form.status}
                  onChange={updateForm}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brass-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="rounded-md bg-forest-700/10 px-3 py-2 text-xs text-forest-700">
                Each payment method can only be added once. Removing a
                method allows you to add it again later.
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded border border-gray-300 px-5 py-2 text-sm text-charcoal-800 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  availableMethods.length === 0 ||
                  !availableMethods.some(
                    (method) => method.name === form.name
                  )
                }
                className="rounded bg-brass-500 px-5 py-2 text-sm font-medium text-bottle-900 transition-colors hover:bg-brass-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Payment Method
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

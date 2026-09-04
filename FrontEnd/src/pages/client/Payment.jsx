import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUniversity, FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const methods = [
  { id: 'gcash', name: 'GCash', desc: 'Pay easily using your GCash account.', tag: 'Fast & Secure', color: 'bg-blue-500', icon: 'G' },
  { id: 'paypal', name: 'PayPal', desc: 'Pay securely using your PayPal account.', tag: 'Secure', color: 'bg-blue-700', icon: 'P' },
  { id: 'bank', name: 'Bank to Bank', desc: 'Transfer directly from your bank account.', tag: 'Secure', icon: <FaUniversity /> },
  { id: 'maribank', name: 'Maribank', desc: 'Pay securely using your Maribank account.', tag: 'Secure', color: 'bg-orange-500', icon: 'M' },
];

export default function Payment() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // 'select' | 'pay' | 'success'
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [proofFile, setProofFile] = useState(null);

  const amountDue = 15000;

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleSubmitPayment = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white rounded-lg shadow p-8 text-center w-full max-w-sm">
          <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-3" />
          <h2 className="text-xl font-bold">Success</h2>
          <p className="text-gray-500 text-sm mb-5">Booked Successfully!</p>
          <button
            onClick={() => navigate('/client/dashboard')}
            className="w-full bg-green-700 text-white py-2.5 rounded text-sm hover:bg-green-800"
          >
            DONE
          </button>
        </div>
      </div>
    );
  }

  if (step === 'pay') {
    return (
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-center">Complete Payment</h2>
          <p className="text-gray-500 text-sm text-center mb-4">Complete your transaction to secure your booking.</p>

          <div className="bg-green-100 rounded-lg text-center py-4 mb-4">
            <p className="text-xs text-green-700 uppercase">Amount to Pay</p>
            <p className="text-2xl font-bold text-green-800">${amountDue.toLocaleString()}.00</p>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-green-600 rounded-sm" />
            <span className="font-semibold text-sm">GCash Payment</span>
          </div>
          <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1 mb-4">
            <li>Open your GCash app and select "Send Money" or "Express Send".</li>
            <li>Enter the M Mobile Bar official GCash number: 0917 123 4567</li>
            <li>Input the exact amount shown above.</li>
            <li>Take a screenshot of the successful transaction receipt.</li>
          </ol>

          <p className="text-xs font-semibold text-green-700 mb-2">UPLOAD PROOF OF PAYMENT</p>
          <label className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center text-green-700 text-xs cursor-pointer mb-4">
            <FaCloudUploadAlt className="text-xl mb-1" />
            {proofFile ? proofFile.name : 'Click to upload or drag and drop'}
            <span className="text-[10px] text-green-500">PNG, JPG, or PDF (Max 30MB)</span>
            <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('select')}
              className="flex-1 border rounded py-2.5 text-sm hover:bg-gray-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmitPayment}
              disabled={!proofFile}
              className="flex-1 bg-green-700 text-white py-2.5 rounded text-sm hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SUBMIT PAYMENT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // step === 'select'
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center">Select Payment Method</h2>
        <p className="text-gray-500 text-sm text-center mb-5">Choose your preferred payment method to continue.</p>

        <div className="space-y-3 mb-5">
          {methods.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                selectedMethod === m.id ? 'border-green-600 bg-green-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="method"
                checked={selectedMethod === m.id}
                onChange={() => setSelectedMethod(m.id)}
              />
              <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${m.color || 'bg-gray-700'}`}>
                {m.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </div>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">{m.tag}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/client/booking-confirmation')}
            className="flex-1 border rounded py-2.5 text-sm hover:bg-gray-50"
          >
            CANCEL
          </button>
          <button
            onClick={() => setStep('pay')}
            className="flex-1 bg-green-700 text-white py-2.5 rounded text-sm hover:bg-green-800"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
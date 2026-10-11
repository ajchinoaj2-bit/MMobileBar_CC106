import { useState } from 'react';
import { FaUniversity, FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';
import { attachPaymentProof } from '../../utils/bookings';

const methods = [
  { id: 'gcash', name: 'GCash', desc: 'Pay easily using your GCash account.', tag: 'Fast & Secure', color: 'bg-blue-500', icon: 'G' },
  { id: 'paypal', name: 'PayPal', desc: 'Pay securely using your PayPal account.', tag: 'Secure', color: 'bg-blue-700', icon: 'P' },
  { id: 'bank', name: 'Bank to Bank', desc: 'Transfer directly from your bank account.', tag: 'Secure', icon: <FaUniversity /> },
  { id: 'maribank', name: 'Maribank', desc: 'Pay securely using your Maribank account.', tag: 'Secure', color: 'bg-orange-500', icon: 'M' },
];

// Shrinks the photo so it fits in localStorage (phone photos are often several MB).
function compressImage(file, maxSize = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Payment({ amountDue, bookingId, onCancel, onDone }) {
  const [step, setStep] = useState('select'); // 'select' | 'pay' | 'success'
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [proofName, setProofName] = useState('');
  const [proofPreview, setProofPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const method = methods.find((m) => m.id === selectedMethod);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a photo (PNG or JPG) of your receipt.');
      return;
    }

    try {
      const dataUrl = await compressImage(file);
      setProofPreview(dataUrl);
      setProofName(file.name);
      setUploadError('');
    } catch (err) {
      setUploadError(err.message);
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = ''; // lets the same file be picked again
  };

  const handleSubmitPayment = () => {
    if (!proofPreview) return;

    try {
      if (bookingId) attachPaymentProof(bookingId, proofPreview);
    } catch {
      setUploadError('Not enough storage to save this photo. Please choose a smaller photo.');
      return;
    }
    setUploadError('');
    setStep('success');
  };

  const stepNote = (n) => (
    <p className="text-xs text-charcoal-500 text-center mb-1">Step {n} of 2</p>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* SUCCESS */}
      {step === 'success' && (
        <div className="bg-white rounded-lg shadow-xl p-8 text-center w-full max-w-sm">
          <FaCheckCircle className="text-forest-700 text-5xl mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold text-bottle-900">Success</h2>
          <p className="text-charcoal-500 text-sm mb-4">
            Your booking request and payment photo have been sent. We will message you once the
            owner has checked it.
          </p>

          {proofPreview && (
            <div className="mb-5">
              <img
                src={proofPreview}
                alt="The payment photo you sent"
                className="h-28 w-auto mx-auto rounded border border-gray-200 object-contain"
              />
              <p className="text-xs text-charcoal-500 mt-1">The photo you sent</p>
            </div>
          )}

          <button
            onClick={onDone}
            className="w-full bg-brass-500 text-bottle-900 font-medium py-2.5 rounded text-sm hover:bg-brass-600 transition-colors"
          >
            DONE
          </button>
        </div>
      )}

      {/* STEP 2: UPLOAD */}
      {step === 'pay' && (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {stepNote(2)}
          <h2 className="font-display text-xl font-bold text-center text-bottle-900">Complete Payment</h2>
          <p className="text-charcoal-500 text-sm text-center mb-4">
            Pay using {method?.name}, then add a photo of your receipt.
          </p>

          <div className="bg-brass-100 border border-brass-400/50 rounded-lg text-center py-4 mb-4">
            <p className="text-xs text-forest-700">Amount to pay</p>
            <p className="font-display text-2xl font-bold text-bottle-900">₱{amountDue.toLocaleString()}.00</p>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-forest-700 rounded-sm" />
            <span className="font-semibold text-sm text-charcoal-800">{method?.name} Payment</span>
          </div>
          <ol className="text-xs text-charcoal-500 list-decimal list-inside space-y-1 mb-4">
            <li>Open your {method?.name} app and select "Send Money" or "Express Send".</li>
            <li>Enter the M Mobile Bar official number: 0917 123 4567</li>
            <li>Type in the exact amount shown above.</li>
            <li>Take a screenshot of the receipt after you pay.</li>
          </ol>

          <p className="text-xs font-semibold text-forest-700 mb-2">Add a photo of your receipt</p>

          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-brass-400/60 bg-ivory-50 rounded-lg p-4 flex flex-col items-center justify-center text-forest-700 text-xs cursor-pointer hover:bg-brass-100/40 transition-colors"
          >
            {proofPreview ? (
              <>
                <img
                  src={proofPreview}
                  alt="Your receipt photo"
                  className="max-h-48 w-auto rounded border border-gray-200 object-contain"
                />
                <span className="mt-2 text-charcoal-500 truncate max-w-full">{proofName}</span>
                <span className="text-brass-600 font-medium mt-0.5">Tap here to choose a different photo</span>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <FaCloudUploadAlt className="text-2xl mb-1 text-brass-500" />
                <span className="text-sm font-medium">Tap or click here to choose your receipt photo</span>
                <span className="text-[11px] text-charcoal-500 mt-1">PNG or JPG</span>
              </div>
            )}
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFileChange} />
          </label>

          {proofPreview && (
            <div className="flex items-center gap-2 text-forest-700 text-xs bg-forest-700/10 rounded px-3 py-2 mt-3">
              <FaCheckCircle className="shrink-0" />
              <span>Photo added. Please review your photo before sending.</span>
            </div>
          )}

          {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep('select')}
              className="flex-1 border border-gray-300 rounded py-2.5 text-sm text-charcoal-800 hover:bg-gray-50"
            >
              BACK
            </button>
            <button
              onClick={handleSubmitPayment}
              disabled={!proofPreview}
              className="flex-1 bg-brass-500 text-bottle-900 font-medium py-2.5 rounded text-sm hover:bg-brass-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: SELECT METHOD */}
      {step === 'select' && (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {stepNote(1)}
          <h2 className="font-display text-xl font-bold text-center text-bottle-900">Select Payment Method</h2>
          <p className="text-charcoal-500 text-sm text-center mb-5">
            Choose your preferred payment method to continue.
          </p>

          <div className="space-y-3 mb-5">
            {methods.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedMethod === m.id ? 'border-brass-500 bg-brass-100/40' : 'border-gray-200 hover:bg-ivory-50'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={selectedMethod === m.id}
                  onChange={() => setSelectedMethod(m.id)}
                  className="accent-brass-500"
                />
                <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${m.color || 'bg-gray-700'}`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal-800">{m.name}</p>
                  <p className="text-xs text-charcoal-500">{m.desc}</p>
                </div>
                <span className="text-[10px] bg-forest-700/10 text-forest-700 px-2 py-1 rounded">{m.tag}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 rounded py-2.5 text-sm text-charcoal-800 hover:bg-gray-50"
            >
              CANCEL
            </button>
            <button
              onClick={() => setStep('pay')}
              className="flex-1 bg-brass-500 text-bottle-900 font-medium py-2.5 rounded text-sm hover:bg-brass-600 transition-colors"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
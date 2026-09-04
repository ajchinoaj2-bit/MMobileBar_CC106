export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  const base = 'px-4 py-2 rounded font-medium text-sm transition-colors';
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
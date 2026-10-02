export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  const base = 'px-4 py-2.5 rounded font-medium text-sm transition-all duration-150 active:scale-[0.98]';
  const variants = {
    primary: 'bg-brass-500 hover:bg-brass-600 text-bottle-900 shadow-sm hover:shadow',
    outline: 'border border-brass-500 text-forest-700 hover:bg-brass-100',
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
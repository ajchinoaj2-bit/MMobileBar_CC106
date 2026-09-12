import { useNavigate } from 'react-router-dom';
import Mdrinks from '../../assets/images/Mdrinks.png';
import { Packages } from '../../constants/Packages';

export default function ClientPackage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-start mb-3"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Packages.map((pkg) => (
          <div key={pkg.id} className="bg-gray-200 rounded-lg p-5 flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-3">{pkg.title}</h2>

            <div className="text-xs text-gray-700 space-y-1 mb-.1">
              {pkg.description.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-xs font-bold text-gray-800 mt-2">All Package Inclusion</p>
            <div className="text-xs text-gray-700 space-y-1 mb-.1">
              {pkg.inclusions.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-xs font-bold text-gray-800 mt-2">Perks</p>
            <div className="text-xs text-gray-700 space-y-1 mb-2">
              {pkg.perks.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-xs font-bold text-gray-800 mt-2">Add ons</p>
            <div className="text-xs text-gray-700 space-y-1 mb-2">
              {pkg.addOns.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-red-600 text-xs font-bold mb-1">ALL THIS FOR ONLY {pkg.price}</p>

            <p className="text-[10px] text-gray-500 mb-4">NOTE: {pkg.notes}</p>

            <img src={Mdrinks} alt="Drinks" className="w-full h-30 object-contain mb-9" />

            <button
              onClick={() => navigate(`/client/booking-form?pkg=${pkg.id}`)}
              className="mt-auto w-50 mx-auto block bg-green-700 text-white text-sm py-2 rounded hover:bg-green-800"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
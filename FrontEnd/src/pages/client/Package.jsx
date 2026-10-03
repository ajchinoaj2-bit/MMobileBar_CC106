import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mdrinks from '../../assets/images/Mdrinks.png';
import { getPackages } from '../../utils/packages';

export default function ClientPackage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    setPackages(getPackages());
  }, []);

  return (
    <div className="h-[calc(100vh-9rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow flex flex-col overflow-hidden h-full">
            <div className="bg-gradient-to-br from-bottle-900 to-forest-700 px-5 py-4 shrink-0">
              <h2 className="font-display text-xl font-semibold text-ivory-50">{pkg.title}</h2>
            </div>

            <div className="p-5 flex flex-col flex-1 min-h-0 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-forest-700 mb-2 tracking-wide">Short Description</h3>
                <div className="bg-ivory-50 rounded-md p-3 text-sm text-charcoal-800 space-y-1">
                  {(pkg.description || []).map((d, i) => <p key={i}>• {d}</p>)}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-forest-700 mb-2 tracking-wide">All Package Inclusion</h3>
                <div className="bg-ivory-50 rounded-md p-3 text-sm text-charcoal-800 space-y-1">
                  {(pkg.inclusions || []).map((d, i) => <p key={i}>• {d}</p>)}
                </div>
              </div>

              {(pkg.perks || []).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-forest-700 mb-2 tracking-wide">Perks</h3>
                  <div className="bg-ivory-50 rounded-md p-3 text-sm text-charcoal-800 space-y-1">
                    {pkg.perks.map((d, i) => <p key={i}>• {d}</p>)}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-sm font-bold text-forest-700 mb-2 tracking-wide">Add Ons</h3>
                <div className="bg-ivory-50 rounded-md p-3 text-sm text-charcoal-800 space-y-1">
                  {(pkg.addOns || []).map((d, i) => <p key={i}>• {d}</p>)}
                </div>
              </div>

              <div className="bg-brass-100 border border-brass-400/50 rounded-md px-4 py-2.5 mb-4">
                <p className="text-bottle-900 text-base font-semibold">
                  All this for only ₱{pkg.price}
                </p>
              </div>

              <div className="bg-ivory-50 rounded-md flex-1 min-h-[80px] flex items-center justify-center overflow-hidden mb-4">
                <img src={Mdrinks} alt="Drinks" className="h-20 object-contain" />
              </div>

              {pkg.notes && (
                <p className="text-xs text-charcoal-500 mb-4">
                  <span className="font-bold text-forest-700">NOTE: </span>{pkg.notes}
                </p>
              )}

              <button
                onClick={() => navigate(`/client/booking-form?pkg=${pkg.id}`)}
                className="shrink-0 w-full sm:w-64 mx-auto block bg-brass-500 text-bottle-900 font-medium text-sm py-2.5 rounded hover:bg-brass-600 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
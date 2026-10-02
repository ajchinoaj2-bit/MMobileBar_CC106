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
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <div className="bg-gradient-to-br from-bottle-900 to-forest-700 px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ivory-50">{pkg.title}</h2>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="text-xs text-charcoal-800 space-y-1">
                {(pkg.description || []).map((d, i) => <p key={i}>• {d}</p>)}
              </div>

              <p className="text-xs font-bold text-forest-700 mt-3 tracking-wide">All Package Inclusion</p>
              <div className="text-xs text-charcoal-800 space-y-1 mt-1">
                {(pkg.inclusions || []).map((d, i) => <p key={i}>• {d}</p>)}
              </div>

              {(pkg.perks || []).length > 0 && (
                <>
                  <p className="text-xs font-bold text-forest-700 mt-3 tracking-wide">Perks</p>
                  <div className="text-xs text-charcoal-800 space-y-1 mt-1 mb-2">
                    {pkg.perks.map((d, i) => <p key={i}>• {d}</p>)}
                  </div>
                </>
              )}

              <p className="text-xs font-bold text-forest-700 mt-3 tracking-wide">Add ons</p>
              <div className="text-xs text-charcoal-800 space-y-1 mt-1 mb-4">
                {(pkg.addOns || []).map((d, i) => <p key={i}>• {d}</p>)}
              </div>

              <div className="bg-brass-100 border border-brass-400/50 rounded-md px-3 py-2 mb-2">
                <p className="text-bottle-900 text-sm font-semibold">
                  All this for only ₱{pkg.price}
                </p>
              </div>

              {pkg.notes && <p className="text-[10px] text-charcoal-500 mb-4">Note: {pkg.notes}</p>}

              <img src={Mdrinks} alt="Drinks" className="w-full h-30 object-contain my-4" />

              <button
                onClick={() => navigate(`/client/booking-form?pkg=${pkg.id}`)}
                className="mt-auto w-full sm:w-50 mx-auto block bg-brass-500 text-bottle-900 font-medium text-sm py-2.5 rounded hover:bg-brass-600 transition-colors"
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
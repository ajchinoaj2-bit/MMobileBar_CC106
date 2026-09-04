import { useNavigate } from 'react-router-dom';
import Mdrinks from '../../assets/images/Mdrinks.png';

const packages = [
  {
    id: 1,
    title: 'Package 1',
    description: [
      '100–150 shots of the M Mobile Bar selection of shooters, shakers and flavors',
      '100–150 glasses of M Mobile Bar cocktails',
      'Tequila & syringe shots',
    ],
    inclusions: [
      'A set of lighted bar counters',
      'Presented by professional bartender',
      'On the spot cocktail mixing every drink serve',
      'Customized drink list',
      'Complete set of lighted bar counter, equipment and bar glasses',
    ],
    perks: [
      'A chance to have freebies if you survive our challenges',
      '3 to 4 good looking bouncers',
      'Free use of Laser Lights',
      'Free use of Tower',
      'Unlimited Time of service',
      'Free use of client\'s liquors',
    ],
    addOns: [
      'Welcome drink (non alcoholic) upon guest arrived',
      'Coffee and Tea',
      'Case of SMB lights',
      'Case of SMB pale pilsen',
      'Case of GSM pale pilsen',
      'Additional Bartender',
    ],
    price: '13,000',
    notes: 'Transportation may be charged in different areas price may change without prior notice',
  },
  {
    id: 2,
    title: 'Package 2',
    description: [
      '200–250 shots of the M Mobile Bar selection of shooters, shakers and flavors',
      '200–250 glasses of M Mobile Bar cocktails',
      'Tequila & syringe shots',
    ],
    inclusions: [
      'A set of lighted bar counters',
      'Presented by professional bartender',
      'On the spot cocktail mixing every drink serve',
      'Customized drink list',
      'Complete set of lighted bar counter, equipment and bar glasses',
    ],
    perks: [
      'A chance to have freebies if you survive our challenges',
      '3 to 4 good looking bouncers',
      'Free use of Laser Lights',
      'Free use of Tower',
      'Unlimited Time of service',
      'Free service of client\'s liquors',
    ],
    addOns: [
      'Welcome drink (non alcoholic) upon guest arrived',
      'Hot Coffee and Tea',
      'Case of SMB lights',
      'Case of SMB pale pilsen',
      'Case of GSM pale pilsen',
      'Additional Bartender',
    ],
    price: '15,500',
    notes: 'Transportation may be charged in different areas price may change without prior notice',
  },
];

export default function ClientPackage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-start mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-gray-200 rounded-lg p-5 flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-3">{pkg.title}</h2>

            <div className="text-xs text-gray-700 space-y-1 mb-3">
              {pkg.description.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-xs font-bold text-gray-800 mt-2">All Package Inclusion</p>
            <div className="text-xs text-gray-700 space-y-1 mb-2">
              {pkg.inclusions.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-xs font-bold text-gray-800 mt-2">Perks</p>
            <div className="text-xs text-gray-700 space-y-1 mb-2">
              {pkg.perks.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-xs font-bold text-gray-800 mt-2">Add ons</p>
            <div className="text-xs text-gray-700 space-y-1 mb-3">
              {pkg.addOns.map((d, i) => <p key={i}>• {d}</p>)}
            </div>

            <p className="text-red-600 text-xs font-bold mb-1">ALL THIS FOR ONLY {pkg.price}</p>

            <p className="text-[10px] text-gray-500 mb-4">NOTE: {pkg.notes}</p>
            
            <img src={Mdrinks} alt="Drinks" className="w-full h-48 object-contain mb-9" />

            <button
              onClick={() => navigate(`/client/package-customize?pkg=${pkg.id}`)}
              className="mt-auto w-full bg-green-700 text-white text-sm py-2 rounded hover:bg-green-800"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
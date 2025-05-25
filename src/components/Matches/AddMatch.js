import { useState, useEffect } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

// Liste complète des équipes (copiée de TeamPage.js)
const teamsData = [
  // Ligue 1 Mobilis
  { value: 'USM Alger', label: 'USM Alger' },
  { value: 'JS Kabylie', label: 'JS Kabylie' },
  { value: 'CR Belouizdad', label: 'CR Belouizdad' },
  { value: 'Paradou AC', label: 'Paradou AC' },
  { value: 'ES Sétif', label: 'ES Sétif' },
  { value: 'MC Alger', label: 'MC Alger' },
  { value: 'MC El Bayadh', label: 'MC El Bayadh' },
  { value: 'CS Constantine', label: 'CS Constantine' },
  { value: 'ASO Chlef', label: 'ASO Chlef' },
  { value: 'JS Saoura', label: 'JS Saoura' },
  { value: 'MC Oran', label: 'MC Oran' },
  { value: 'Olympique Akbou', label: 'Olympique Akbou' },
  { value: 'USM Khenchela', label: 'USM Khenchela' },
  { value: 'US Biskra', label: 'US Biskra' },
  { value: 'NC Magra', label: 'NC Magra' },
  { value: 'ES Mostaganem', label: 'ES Mostaganem' },
  // Ligue 2 Mobilis Est
  { value: 'AS Khroub', label: 'AS Khroub' },
  { value: 'CA Batna', label: 'CA Batna' },
  { value: 'HB Chelghoum Laïd', label: 'HB Chelghoum Laïd' },
  { value: 'IB Khémis El Khechna', label: 'IB Khémis El Khechna' },
  { value: 'IRB Ouargla', label: 'IRB Ouargla' },
  { value: 'JS Bordj Ménaïel', label: 'JS Bordj Ménaïel' },
  { value: 'JS Djijel', label: 'JS Djijel' },
  { value: 'MO Constantine', label: 'MO Constantine' },
  { value: 'MSP Batna', label: 'MSP Batna' },
  { value: 'NRB Teleghma', label: 'NRB Teleghma' },
  { value: 'US Chaouia', label: 'US Chaouia' },
  { value: 'US Souf', label: 'US Souf' },
  { value: 'USM Annaba', label: 'USM Annaba' },
  { value: 'USM El Harrach', label: 'USM El Harrach' },
  { value: 'MB Rouissat', label: 'MB Rouissat' },
  { value: 'Olympique Magrane', label: 'Olympique Magrane' },
  // Ligue 2 Mobilis Ouest
  { value: 'ASM Oran', label: 'ASM Oran' },
  { value: 'CR Témouchent', label: 'CR Témouchent' },
  { value: 'ES Ben Aknoun', label: 'ES Ben Aknoun' },
  { value: 'ESM Koléa', label: 'ESM Koléa' },
  { value: 'GC Mascara', label: 'GC Mascara' },
  { value: 'JS El Biar', label: 'JS El Biar' },
  { value: 'JSM Tiaret', label: 'JSM Tiaret' },
  { value: 'MC Saïda', label: 'MC Saïda' },
  { value: 'MCB Oued Sly', label: 'MCB Oued Sly' },
  { value: 'NA Hussein Dey', label: 'NA Hussein Dey' },
  { value: 'RC Arbaâ', label: 'RC Arbaâ' },
  { value: 'RC Kouba', label: 'RC Kouba' },
  { value: 'SC Mécheria', label: 'SC Mécheria' },
  { value: 'SKAF Khemis Miliana', label: 'SKAF Khemis Miliana' },
  { value: 'US Béchar Djedid', label: 'US Béchar Djedid' },
  { value: 'WA Mostaganem', label: 'WA Mostaganem' },
];

const LEAGUES = [
  { value: 'Ligue 1 Mobilis', label: 'Ligue 1 Mobilis' },
  { value: 'Ligue 2 Mobilis Est', label: 'Ligue 2 Mobilis Est' },
  { value: 'Ligue 2 Mobilis Ouest', label: 'Ligue 2 Mobilis Ouest' },
  { value: 'Champions League', label: 'Champions League' },
  { value: 'Coupe Algérie', label: 'Coupe Algérie' },
];

const AddMatch = ({ onMatchAdded }) => {
  const teams = [
    { value: 'team1', label: 'MC Alger' },
    { value: 'team2', label: 'USM Alger' },
    { value: 'team3', label: 'JS Kabylie' },
  ];

  const [stadiums, setStadiums] = useState([]);
  const [isNewStadium, setIsNewStadium] = useState(false);

  const initialZones = {};
  'ABCDEFGH'.split('').forEach(zone => {
    initialZones[`zone${zone}Price`] = '';
    initialZones[`zone${zone}Places`] = '';
  });

  const [formData, setFormData] = useState({
    team1: null,
    team2: null,
    stadium: null,
    league: null,
    dateTime: '',
    parkingPlaces: '', // Ajouté ici
    ...initialZones,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch stadiums from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/stades')
      .then(res => res.json())
      .then(data => {
        const stades = (Array.isArray(data) ? data : data.data || []).map(s => ({
          value: s.id,
          label: s.nom,
          location: s.lieu,
        }));
        setStadiums([
          ...stades,
          { value: 'new', label: 'Ajouter un nouveau stade...' }
        ]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let payload = {
        equipe1: formData.team1?.value || '',
        equipe2: formData.team2?.value || '',
        league: formData.league?.value || '',
        date: formData.dateTime ? formData.dateTime.split('T')[0] : '',
        heure: formData.dateTime ? formData.dateTime.split('T')[1] : '',
        zones: 'ABCDEFGH'.split('').map(zone => ({
          name: zone === 'H' ? 'VIP' : `Zone ${zone}`,
          price: Number(formData[`zone${zone}Price`]) || 0,
          places: Number(formData[`zone${zone}Places`]) || 0,
        })),
        // Correction ici : toujours envoyer la clé parking_places (même si 0)
        parking_places:
          formData.parkingPlaces !== "" && formData.parkingPlaces !== null && !isNaN(Number(formData.parkingPlaces))
            ? Number(formData.parkingPlaces)
            : 0,
      };

      // Ajoute ce log pour debug côté frontend
      console.log("Payload envoyé à l'API /api/matches :", payload);

      if (isNewStadium) {
        payload.stade = {
          nom: formData.stadeNom || '',
          lieu: formData.stadeLieu || '',
          capacite: formData.stadeCapacite || '',
        };
      } else {
        payload.stade_id = formData.stadium?.value || '';
      }

      const res = await fetch('http://localhost:8000/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Erreur lors de l\'ajout du match.');
        setLoading(false);
        return;
      }

      setFormData({
        team1: null,
        team2: null,
        stadium: null,
        league: null,
        dateTime: '',
        parkingPlaces: '',
        ...initialZones,
      });
      if (onMatchAdded) onMatchAdded();
      alert('Match ajouté avec succès !');
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      background: 'rgba(55, 65, 81, 0.5)',
      borderColor: '#374151',
      borderRadius: '0.5rem',
      padding: '2px',
      color: '#fff',
      '&:hover': {
        borderColor: '#4B5563'
      }
    }),
    menu: (base) => ({
      ...base,
      background: 'rgba(31, 41, 55, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0.5rem',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgba(55, 65, 81, 0.5)' : 'transparent',
      color: '#fff',
      '&:hover': {
        backgroundColor: 'rgba(55, 65, 81, 0.5)'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fff'
    }),
    input: (base) => ({
      ...base,
      color: '#fff'
    }),
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Add New Match</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Team 1</label>
            <Select
              options={teamsData}
              value={formData.team1}
              onChange={(selected) => setFormData({ ...formData, team1: selected })}
              placeholder="Select first team..."
              isSearchable
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Team 2</label>
            <Select
              options={teamsData}
              value={formData.team2}
              onChange={(selected) => setFormData({ ...formData, team2: selected })}
              placeholder="Select second team..."
              isSearchable
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">League</label>
            <Select
              options={LEAGUES}
              value={formData.league}
              onChange={(selected) => setFormData({ ...formData, league: selected })}
              placeholder="Select league..."
              isSearchable
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nombre de places de parking</label>
            <input
              type="number"
              min="0"
              value={formData.parkingPlaces}
              onChange={e => setFormData({ ...formData, parkingPlaces: e.target.value })}
              placeholder="Nombre de places de parking"
              className="w-full bg-gray-700 text-white rounded-lg border-gray-600 p-2.5"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Stadium</label>
            <Select
              options={stadiums}
              value={formData.stadium}
              onChange={(selected) => {
                setFormData({ ...formData, stadium: selected });
                setIsNewStadium(selected?.value === 'new');
              }}
              placeholder="Select stadium..."
              isSearchable
              styles={customSelectStyles}
            />
          </div>
          {isNewStadium && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nom du stade"
                value={formData.stadeNom || ''}
                onChange={e => setFormData({ ...formData, stadeNom: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg border-gray-600 p-2.5"
                required
              />
              <input
                type="text"
                placeholder="Lieu"
                value={formData.stadeLieu || ''}
                onChange={e => setFormData({ ...formData, stadeLieu: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg border-gray-600 p-2.5"
                required
              />
              <input
                type="number"
                placeholder="Capacité"
                value={formData.stadeCapacite || ''}
                onChange={e => setFormData({ ...formData, stadeCapacite: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg border-gray-600 p-2.5"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date and Time</label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg border-gray-600 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Ticket Pricing Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {'ABCDEFGH'.split('').map((zone, idx, arr) => {
              const isVIP = idx === arr.length - 1;
              return (
                <div key={zone} className="space-y-2 bg-gray-700 rounded-lg p-3">
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isVIP ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                  >
                    {isVIP ? 'VIP' : `Zone ${zone}`}
                  </label>
                  <div className="relative mb-2">
                    <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isVIP ? 'text-yellow-400' : 'text-gray-400'}`}>
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData[`zone${zone}Price`]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`zone${zone}Price`]: e.target.value
                        })
                      }
                      placeholder="Price"
                      className="w-full bg-gray-800 text-white rounded-lg border-gray-600 pl-8 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isVIP ? 'text-yellow-400' : 'text-gray-400'}`}>
                      #
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData[`zone${zone}Places`]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`zone${zone}Places`]: e.target.value
                        })
                      }
                      placeholder="Number of places"
                      className="w-full bg-gray-800 text-white rounded-lg border-gray-600 pl-8 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          {error && <div className="text-red-400 mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Ajout en cours..." : "Add Match"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddMatch;

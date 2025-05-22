import { useState, useEffect } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

const LEAGUES = [
    { value: 'Ligue 1', label: 'Ligue 1' },
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
                equipe1: formData.team1?.label || '',
                equipe2: formData.team2?.label || '',
                league: formData.league?.value || '',
                date: formData.dateTime ? formData.dateTime.split('T')[0] : '',
                heure: formData.dateTime ? formData.dateTime.split('T')[1] : '',
                zones: 'ABCDEFGH'.split('').map(zone => ({
                    name: zone === 'H' ? 'VIP' : `Zone ${zone}`,
                    price: Number(formData[`zone${zone}Price`]) || 0, // Always send a number
                    places: Number(formData[`zone${zone}Places`]) || 0,
                })),
            };

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
                            options={teams}
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
                            options={teams}
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

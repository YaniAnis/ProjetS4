import { useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

const AddMatch = () => {
    // Example data - replace with your actual data from API
    const teams = [
        { value: 'team1', label: 'Manchester United' },
        { value: 'team2', label: 'Liverpool' },
        { value: 'team3', label: 'Chelsea' },
        // Add more teams
    ];

    const stadiums = [
        { value: 'std1', label: 'Old Trafford', location: 'Manchester' },
        { value: 'std2', label: 'Anfield', location: 'Liverpool' },
        { value: 'std3', label: 'Stamford Bridge', location: 'London' },
        // Add more stadiums
    ];

    const [formData, setFormData] = useState({
        team1: null,
        team2: null,
        stadium: null,
        dateTime: '',
        zoneA: '',
        zoneB: '',
        zoneC: '',
        zoneD: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Match Data:', formData);
        // Add your submission logic here
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
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Stadium</label>
                        <Select
                            options={stadiums}
                            value={formData.stadium}
                            onChange={(selected) => setFormData({ ...formData, stadium: selected })}
                            placeholder="Select stadium..."
                            isSearchable
                            styles={customSelectStyles}
                        />
                    </div>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['A', 'B', 'C', 'D'].map((zone) => (
                            <div key={zone} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Zone {zone}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        value={formData[`zone${zone}`]}
                                        onChange={(e) => 
                                            setFormData({ 
                                                ...formData, 
                                                [`zone${zone}`]: e.target.value 
                                            })
                                        }
                                        placeholder="0.00"
                                        className="w-full bg-gray-700 text-white rounded-lg border-gray-600 pl-8 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        Add Match
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AddMatch;

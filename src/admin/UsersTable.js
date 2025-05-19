import { useState } from "react";
import { Search } from "lucide-react";
import "./UsersTable.css";

const UsersTable = ({ users, onSearch }) => {
    console.log("UsersTable received users:", users); // Debugging log

    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term);
    };

    return (
        <div className='users-table'>
            <div className='users-table-header'>
                <h2 className='users-table-title'>Liste des Utilisateurs</h2>
                <div className='users-table-search'>
                    <input
                        type='text'
                        placeholder='Rechercher un utilisateur...'
                        className='users-table-search-input'
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <Search className='users-table-search-icon' size={18} />
                </div>
            </div>

            <div className='users-table-container'>
                <table className='users-table-content'>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Date de Création</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;

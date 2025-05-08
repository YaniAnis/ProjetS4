<<<<<<< HEAD
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
=======
import { useState } from "react";
>>>>>>> ca26c2be4aeee4b1b5d624080ae96e93304c8975
import { Search } from "lucide-react";
import "./UsersTable.css";

<<<<<<< HEAD
const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users");
				const data = await response.json();
				console.log("Fetched users:", data); // Debug: see what the API returns

				const usersArray = Array.isArray(data) ? data : data.data || [];
				setUsers(usersArray);
				setFilteredUsers(usersArray);
			} catch (error) {
				console.error("Failed to fetch users:", error);
				setError("Failed to load users.");
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);
=======
const UsersTable = ({ users, onSearch }) => {
	console.log("UsersTable received users:", users); // Debugging log

	const [searchTerm, setSearchTerm] = useState("");
>>>>>>> ca26c2be4aeee4b1b5d624080ae96e93304c8975

	const handleInputChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
<<<<<<< HEAD
		const filtered = users.filter(
			(user) =>
				(user.name || "").toLowerCase().includes(term) ||
				(user.email || "").toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
=======
		onSearch(term); // Call the search handler passed from UtilisateurPage
>>>>>>> ca26c2be4aeee4b1b5d624080ae96e93304c8975
	};

	const handleDelete = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;
		try {
			const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			if (response.ok) {
				setUsers((prev) => prev.filter((u) => u.id !== userId));
				setFilteredUsers((prev) => prev.filter((u) => u.id !== userId));
			} else {
				const data = await response.json();
				alert(data.message || "Failed to delete user.");
			}
		} catch (err) {
			alert("Failed to delete user.");
		}
	};

	if (loading) return <div>Loading users...</div>;
	if (error) return <div style={{ color: "red" }}>{error}</div>;

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
<<<<<<< HEAD

					<tbody className='users-table-body'>
						{filteredUsers.length === 0 ? (
							<tr>
								<td colSpan={5} style={{ textAlign: "center" }}>No users found.</td>
							</tr>
						) : (
							filteredUsers.map((user) => (
								<motion.tr
									key={user.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='users-table-cell'>
										<div className='users-table-cell-content'>
											<div className='users-table-avatar'>
												<div className='users-table-avatar-placeholder'>
													{user.name?.charAt(0)}
												</div>
											</div>
											<div className='users-table-name'>{user.name}</div>
										</div>
									</td>
									<td className='users-table-cell'>{user.email}</td>
									<td className='users-table-cell'>
										<span className='users-table-role'>{user.role}</span>
									</td>
									<td className='users-table-cell'>
										<span className={`users-table-status users-table-status-active`}>
											Active
										</span>
									</td>
									<td className='users-table-cell'>
										<button
											className='users-table-action-delete'
											onClick={() => handleDelete(user.id)}
										>
											Delete
										</button>
									</td>
								</motion.tr>
							))
						)}
=======
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{new Date(user.created_at).toLocaleDateString()}</td>
							</tr>
						))}
>>>>>>> ca26c2be4aeee4b1b5d624080ae96e93304c8975
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UsersTable;

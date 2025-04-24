import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import "./user.css";

const userData = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
];

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	return (
		<motion.div
			className='users-table'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='users-table-header'>
				<h2 className='users-table-title'>Users</h2>
				<div className='users-table-search'>
					<input
						type='text'
						placeholder='Search users...'
						className='users-table-search-input'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='users-table-search-icon' size={18} />
				</div>
			</div>

			<div className='users-table-container'>
				<table className='users-table-content'>
					<thead>
						<tr>
							<th className='users-table-header-cell'>Name</th>
							<th className='users-table-header-cell'>Email</th>
							<th className='users-table-header-cell'>Role</th>
							<th className='users-table-header-cell'>Status</th>
							<th className='users-table-header-cell'>Actions</th>
						</tr>
					</thead>

					<tbody className='users-table-body'>
						{filteredUsers.map((user) => (
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
												{user.name.charAt(0)}
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
									<span
										className={`users-table-status ${
											user.status === "Active"
												? "users-table-status-active"
												: "users-table-status-inactive"
										}`}
									>
										{user.status}
									</span>
								</td>

								<td className='users-table-cell'>
									<button className='users-table-action-edit'>Edit</button>
									<button className='users-table-action-delete'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default UsersTable;

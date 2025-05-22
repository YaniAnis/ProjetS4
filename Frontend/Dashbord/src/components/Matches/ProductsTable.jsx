import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import "./Product.css";

const ProductsTable = ({ matches = [], loading, onMatchDeleted, onMatchEdit }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMatches, setFilteredMatches] = useState(matches);

	useEffect(() => {
		setFilteredMatches(matches);
	}, [matches]);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = matches.filter(
			(match) =>
				(match.equipe1?.toLowerCase() || "").includes(term) ||
				(match.equipe2?.toLowerCase() || "").includes(term) ||
				(match.stade_id?.toString().toLowerCase() || "").includes(term) ||
				(match.league?.toLowerCase() || "").includes(term)
		);
		setFilteredMatches(filtered);
	};

	// Handler for deleting a match
	const handleDelete = async (id) => {
		if (!window.confirm("Voulez-vous vraiment supprimer ce match ?")) return;
		try {
			const res = await fetch(`http://localhost:8000/api/matches/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				if (onMatchDeleted) onMatchDeleted(id);
			} else {
				const data = await res.json();
				alert(data.message || "Erreur lors de la suppression.");
			}
		} catch {
			alert("Erreur lors de la suppression.");
		}
	};

	// Handler for editing a match (redirect or open modal)
	const handleEdit = (id) => {
		if (onMatchEdit) {
			onMatchEdit(id);
		} else {
			alert("Fonction d'édition non implémentée.");
		}
	};

	return (
		<motion.div
			className='products-table'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='products-table-header'>
				<h2 className='products-table-title'>Liste des Matchs</h2>
				<div className='products-table-search'>
					<input
						type='text'
						placeholder='Search matches...'
						className='products-table-search-input'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='products-table-search-icon' size={18} />
				</div>
			</div>

			<div className='products-table-container'>
				<table className='products-table-content'>
					<thead>
						<tr>
							<th className='products-table-header-cell'>Domicile</th>
							<th className='products-table-header-cell'>Extérieur</th>
							<th className='products-table-header-cell'>Stade ID</th>
							<th className='products-table-header-cell'>Ligue</th>
							<th className='products-table-header-cell'>Date & Heure</th>
							<th className='products-table-header-cell'>Actions</th>
						</tr>
					</thead>
					<tbody className='products-table-body'>
						{loading ? (
							<tr>
								<td colSpan={6} className="products-table-cell">Chargement...</td>
							</tr>
						) : filteredMatches.length === 0 ? (
							<tr>
								<td colSpan={6} className="products-table-cell">Aucun match trouvé.</td>
							</tr>
						) : (
							filteredMatches.map((match) => (
								<motion.tr
									key={match.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='products-table-cell products-table-cell-name'>
										{match.equipe1}
									</td>
									<td className='products-table-cell'>{match.equipe2}</td>
									<td className='products-table-cell'>{match.stade_id}</td>
									<td className='products-table-cell'>{match.league}</td>
									<td className='products-table-cell'>
										{match.date} {match.heure}
									</td>
									<td className='products-table-cell'>
										<button
											className='products-table-action-edit'
											onClick={() => handleEdit(match.id)}
											title="Modifier"
										>
											<Edit size={18} />
										</button>
										<button
											className='products-table-action-delete'
											onClick={() => handleDelete(match.id)}
											title="Supprimer"
										>
											<Trash2 size={18} />
										</button>
									</td>
								</motion.tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default ProductsTable;

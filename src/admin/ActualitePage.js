import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Newspaper, CalendarClock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Pages.css";

const ActualitePage = () => {
	const [actualities, setActualities] = useState([]);
	const [form, setForm] = useState({ title: "", content: "", description: "", readTime: "", image: null });
	const [loading, setLoading] = useState(false);
	const [stats, setStats] = useState({
		total: 0,
		today: 0,
		playerCount: 0,
	});
	const [playerForm, setPlayerForm] = useState({
		name: "",
		poste: "",
		matches: "",
		passes: "",
		buts: "",
		note: "",
		maillot: "",
		image: null,
	});
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		const fetchActualities = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/actualities");
				const data = await res.json();
				const actualitiesArr = Array.isArray(data) ? data : data.data || [];
				setActualities(actualitiesArr);

				// Calculer les stats
				const total = actualitiesArr.length;
				const todayStr = new Date().toISOString().slice(0, 10);
				const today = actualitiesArr.filter(a => {
					const date = a.created_at ? a.created_at.slice(0, 10) : "";
					return date === todayStr;
				}).length;
				setStats({ total, today });
			} catch {
				setActualities([]);
				setStats({ total: 0, today: 0 });
			}
		};
		fetchActualities();
	}, [loading]);

	useEffect(() => {
		const fetchPlayers = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/players");
				const data = await res.json();
				setPlayers(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Failed to fetch players:", error);
				setPlayers([]);
			}
		};
		fetchPlayers();
	}, [loading]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [actualitiesRes, playersRes] = await Promise.all([
					fetch("http://localhost:8000/api/actualities"),
					fetch("http://localhost:8000/api/players")
				]);
				
				const actualitiesData = await actualitiesRes.json();
				const playersData = await playersRes.json();
				
				const actualitiesArr = Array.isArray(actualitiesData) ? actualitiesData : actualitiesData.data || [];
				const playersArr = Array.isArray(playersData) ? playersData : [];
				
				const total = actualitiesArr.length;
				const todayStr = new Date().toISOString().slice(0, 10);
				const today = actualitiesArr.filter(a => {
					const date = a.created_at ? a.created_at.slice(0, 10) : "";
					return date === todayStr;
				}).length;
				
				setStats({
					total,
					today,
					playerCount: playersArr.length
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
				setStats({ total: 0, today: 0, playerCount: 0 });
			}
		};
		fetchStats();
	}, [loading]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append("title", form.title);
		formData.append("content", form.content);
		formData.append("description", form.description);
		formData.append("readTime", form.readTime);
		if (form.image) {
			formData.append("image", form.image);
		}

		try {
			const res = await fetch("http://localhost:8000/api/actualities", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				alert(data.message || "Erreur lors de l'ajout de l'actualité.");
			}
		} catch (err) {
			alert("Erreur réseau lors de l'ajout de l'actualité.");
		}
		setForm({ title: "", content: "", description: "", readTime: "", image: null });
		setLoading(false);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;
		setLoading(true);
		try {
			await fetch(`http://localhost:8000/api/actualities/${id}`, {
				method: "DELETE",
			});
		} catch (error) {
			console.error("Failed to fetch actualities:", error);
		}
		setLoading(false);
	};

	const handlePlayerSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("name", playerForm.name);
			formData.append("poste", playerForm.poste);
			formData.append("matches", parseInt(playerForm.matches));
			formData.append("passes", parseInt(playerForm.passes));
			formData.append("buts", parseInt(playerForm.buts));
			formData.append("note", parseFloat(playerForm.note));
			formData.append("maillot", parseInt(playerForm.maillot));
			
			if (playerForm.image) {
				formData.append("image", playerForm.image);
			}

			const res = await fetch("http://localhost:8000/api/players", {
				method: "POST",
				body: formData,
				// Remove headers when using FormData
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Erreur lors de l'ajout du joueur");
			}

			alert("Joueur ajouté avec succès!");
			setPlayerForm({
				name: "",
				poste: "",
				matches: "",
				passes: "",
				buts: "",
				note: "",
				maillot: "",
				image: null,
			});
		} catch (err) {
			console.error("Error details:", err);
			alert(err.message || "Erreur lors de l'ajout du joueur");
		} finally {
			setLoading(false);
		}
	};

	const handlePlayerDelete = async (id) => {
		if (!window.confirm("Voulez-vous vraiment supprimer ce joueur ?")) return;
		setLoading(true);
		try {
			const res = await fetch(`http://localhost:8000/api/players/${id}`, {
				method: "DELETE",
				headers: {
					"Accept": "application/json"
				}
			});
			if (res.ok) {
				// Recharge la liste après suppression
				setPlayers(players.filter(p => p.id !== id));
				alert("Joueur supprimé avec succès!");
			} else {
				const data = await res.json().catch(() => ({}));
				alert(data.message || "Erreur lors de la suppression du joueur.");
			}
		} catch (error) {
			console.error("Failed to delete player:", error);
			alert("Erreur lors de la suppression du joueur.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='products-page'>
			<Header title={"Actualité"} />
			<main className='products-main'>
				{/* STATS */}
				<motion.div
					className='products-stats-grid px-4 py-5 sm:p-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard 
    name='Total Actualite' 
    icon={Newspaper} 
    value={(stats.total || 0).toLocaleString("fr-FR")} 
    color='#6366F1' 
/>
<StatCard 
    name='New Actualite Today' 
    icon={CalendarClock} 
    value={(stats.today || 0).toLocaleString("fr-FR")} 
    color='#F59E0B' 
/>
<StatCard 
    name='Total Players' 
    icon={Users} 
    value={(stats.playerCount || 0).toLocaleString("fr-FR")} 
    color='#10B981' 
/>
				</motion.div>

				{/* Add Actuality Form */}
				<motion.div
					style={{
						background: "rgba(31,41,55,0.5)", // bg-gray-800 bg-opacity-50
						backdropFilter: "blur(10px)",     // backdrop-blur-md
						boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // shadow-lg
						borderRadius: "0.75rem",          // rounded-xl
						border: "none",                   // remove border
						padding: "1.5rem",                // p-6
						marginBottom: "2rem"              // mb-8
					}}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-xl font-semibold text-gray-100 mb-6">Ajouter une Actualité</h2>
					<form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
						<input
							type="text"
							placeholder="Titre Max 64 caractères"
							value={form.title}
							onChange={e => setForm({ ...form, title: e.target.value })}
							className="w-full rounded-lg p-2"
							style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
							required
							maxLength={64}
						/>
						<textarea
							placeholder="Description Max 112 caractères"
							value={form.content}
							onChange={e => setForm({ ...form, content: e.target.value })}
							className="w-full rounded-lg p-2"
							style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
							required
							maxLength={112}
						/>
						<textarea
							placeholder="Contenu"
							value={form.description}
							onChange={e => setForm({ ...form, description: e.target.value })}
							className="w-full rounded-lg p-4 min-h-[200px]"
							style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
							required
						/>
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-2">
								Temps de lecture (minutes)
								{form.readTime && (
									<span className="ml-2 text-indigo-400">
										{form.readTime} {form.readTime === "1" ? "minute" : "minutes"}
									</span>
								)}
							</label>
							<input
								type="number"
								min="1"
								max="60"
								placeholder="5 Minutes"
								value={form.readTime}
								onChange={e => setForm({ ...form, readTime: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
							<label className="w-full flex items-center rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}>
								<span className="flex-1 truncate">
									{form.image ? form.image.name : "Choisir un fichier Max 2MO..."}
								</span>
								<input
									type="file"
									accept="image/*"
									onChange={e => setForm({ ...form, image: e.target.files[0] })}
									className="hidden"
								/>
								<span className="ml-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm font-medium transition-colors">
									Parcourir
								</span>
							</label>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
						>
							{loading ? "Ajout..." : "Ajouter"}
						</button>
					</form>
				</motion.div>

				{/* Add Player Form */}
				<motion.div
					style={{
						background: "rgba(31,41,55,0.5)",
						backdropFilter: "blur(10px)",
						boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
						borderRadius: "0.75rem",
						border: "none",
						padding: "1.5rem",
						marginBottom: "2rem",
					}}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-xl font-semibold text-gray-100 mb-6">Ajouter un Joueur</h2>
					<form onSubmit={handlePlayerSubmit} className="space-y-4" encType="multipart/form-data">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								placeholder="Nom"
								value={playerForm.name}
								onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
							/>
							<input
								type="text"
								placeholder="Poste"
								value={playerForm.poste}
								onChange={(e) => setPlayerForm({ ...playerForm, poste: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
							/>
							<input
								type="number"
								placeholder="Nombre de matchs joués"
								value={playerForm.matches}
								onChange={(e) => setPlayerForm({ ...playerForm, matches: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
								min="0"
							/>
							<input
								type="number"
								placeholder="Nombre de passes décisives"
								value={playerForm.passes}
								onChange={(e) => setPlayerForm({ ...playerForm, passes: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
								min="0"
							/>
							<input
								type="number"
								placeholder="Nombre de buts"
								value={playerForm.buts}
								onChange={(e) => setPlayerForm({ ...playerForm, buts: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
								min="0"
							/>
							<input
								type="number"
								placeholder="Note"
								value={playerForm.note}
								onChange={(e) => setPlayerForm({ ...playerForm, note: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
								min="0"
							/>
							<input
								type="number"
								placeholder="Numéro de maillot"
								value={playerForm.maillot}
								onChange={(e) => setPlayerForm({ ...playerForm, maillot: e.target.value })}
								className="w-full rounded-lg p-2"
								style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}
								required
								min="0"
							/>
							<div className="flex flex-col justify-end">
								<label className="block text-sm font-medium text-gray-400 mb-2">Image du joueur</label>
								<label className="w-full flex items-center rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors"
									style={{ backgroundColor: "#374151", color: "#fff", border: "none" }}>
									<span className="flex-1 truncate">
										{playerForm.image ? playerForm.image.name : "Choisir un fichier Max 2MO..."}
									</span>
									<input
										type="file"
										accept="image/*"
										onChange={e => setPlayerForm({ ...playerForm, image: e.target.files[0] })}
										className="hidden"
									/>
									<span className="ml-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm font-medium transition-colors">
										Parcourir
									</span>
								</label>
							</div>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
						>
							{loading ? "Ajout..." : "Ajouter"}
						</button>
					</form>
				</motion.div>

				{/* List of Actualities */}
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					<h3 className="text-lg font-semibold text-gray-100 mb-4">Liste des Actualités</h3>
					<ul className="space-y-4">
						{actualities.map((a, idx) => (
							<li key={a.id || idx} className="border-b border-gray-700 pb-2 flex items-center justify-between">
								<div>
									<div className="text-indigo-400 font-bold">{a.title}</div>
									<div className="text-gray-300">{a.content}</div>
									{a.description && (
										<div className="text-gray-400 mt-1" style={{ fontStyle: "italic" }}>
											{a.description.length > 120 ? a.description.slice(0, 120) + "..." : a.description}
										</div>
									)}
									{/* Affiche l'image si présente */}
									{a.image_url && (
										<img
											src={
												a.image_url.startsWith("http")
													? a.image_url
													: `http://localhost:8000${a.image_url}`
											}
											alt={a.title}
											style={{ maxWidth: 120, maxHeight: 80, marginTop: 8, borderRadius: 8 }}
										/>
									)}
								</div>
								<button
									onClick={() => handleDelete(a.id)}
									style={{
										background: "none",
										border: "none",
										color: "#f87171",
										fontWeight: 400,
										fontSize: "1rem",
										cursor: "pointer",
										padding: 0,
										marginLeft: "1rem",
										transition: "color 0.2s"
									}}
									onMouseOver={e => (e.currentTarget.style.color = "#dc2626")}
									onMouseOut={e => (e.currentTarget.style.color = "#f87171")}
								>
									Delete
								</button>
							</li>
						))}
						{actualities.length === 0 && <li className="text-gray-400">Aucune actualité.</li>}
					</ul>
				</motion.div>

				{/* Players Table */}
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 mt-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					<h3 className="text-lg font-semibold text-gray-100 mb-4">Liste des Joueurs</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-700">
							<thead>
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Nom
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Poste
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Maillot
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Stats
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{players.map((player) => (
									<tr key={player.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												{player.image_url && (
													<img
														src={player.image_url.startsWith("http") ? player.image_url : `http://localhost:8000${player.image_url}`}
														alt={player.name}
														className="h-10 w-10 rounded-full object-cover mr-3"
													/>
												)}
												<div className="text-sm font-medium text-gray-200">
													{player.name}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
											{player.poste}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
											#{player.maillot}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
											<div>Matchs: {player.matches}</div>
											<div>Buts: {player.buts}</div>
											<div>Passes: {player.passes}</div>
											<div>Note: {player.note}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
											<button
												onClick={() => handlePlayerDelete(player.id)}
												style={{
													background: "none",
													border: "none",
													color: "#f87171",
													fontWeight: 400,
													fontSize: "1rem",
													cursor: "pointer",
													padding: 0,
													marginLeft: "1rem",
													transition: "color 0.2s"
												}}
												onMouseOver={e => (e.currentTarget.style.color = "#dc2626")}
												onMouseOut={e => (e.currentTarget.style.color = "#f87171")}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
								{players.length === 0 && (
									<tr>
										<td colSpan="5" className="px-6 py-4 text-center text-gray-400">
											Aucun joueur trouvé.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</motion.div>
			</main>
		</div>
	);
}

export default ActualitePage;
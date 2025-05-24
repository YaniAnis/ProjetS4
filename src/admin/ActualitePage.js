import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Newspaper, CalendarClock,   } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Pages.css";

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const ActualitePage = () => {
	const [actualities, setActualities] = useState([]);
	const [form, setForm] = useState({ title: "", content: "", description: "", readTime: "", image: null });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchActualities = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/actualities");
				const data = await res.json();
				setActualities(Array.isArray(data) ? data : data.data || []);
			} catch {
				setActualities([]);
			}
		};
		fetchActualities();
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

	return (
		<div className='products-page'>
			<Header title={"Actualité"} />
			<main className='products-main'>
				{/* STATS */}
				<motion.div
					className='products-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Actualite' icon={Newspaper} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard name='New Actualite Today' icon={CalendarClock} value={orderStats.pendingOrders} color='#F59E0B' />
				</motion.div>

				{/* Add Actuality Form */}
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-6 mb-8"
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
							className="w-full bg-gray-700 text-white rounded-lg p-2"
							required
							maxLength={64}
						/>
						<textarea
							placeholder="Contenu Max 128 caractères"
							value={form.content}
							onChange={e => setForm({ ...form, content: e.target.value })}
							className="w-full bg-gray-700 text-white rounded-lg p-2"
							required
							maxLength={128}
						/>
						<textarea
							placeholder="Description"
							value={form.description}
							onChange={e => setForm({ ...form, description: e.target.value })}
							className="w-full bg-gray-700 text-white rounded-lg p-4 min-h-[200px]"
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
								className="w-full bg-gray-700 text-white rounded-lg p-2"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
							<label className="w-full flex items-center bg-gray-700 text-white rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors">
								<span className="flex-1 truncate">
									{form.image ? form.image.name : "Choisir un fichier..."}
								</span>
								<input
									type="file"
									accept="image/*"
									onChange={e => setForm({ ...form, image: e.target.files[0] })}
									className="hidden"
								/>
								<span className="ml-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm font-medium transition-colors">
									Parcourir Max 2MO
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
			</main>
		</div>
	);
}

export default ActualitePage;
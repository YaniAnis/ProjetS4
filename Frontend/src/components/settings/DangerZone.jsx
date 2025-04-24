import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import "./setting.css";

const DangerZone = () => {
	return (
		<motion.div
			className='danger-zone'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='danger-zone-header'>
				<Trash2 className='danger-zone-icon' size={24} />
				<h2 className='danger-zone-title'>Danger Zone</h2>
			</div>
			<p className='danger-zone-description'>Supprimez définitivement votre compte et tout votre contenu.</p>
			<button className='danger-zone-button'>Supprimer le Compte</button>
		</motion.div>
	);
};
export default DangerZone;

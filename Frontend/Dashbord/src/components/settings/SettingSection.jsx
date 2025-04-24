import { motion } from "framer-motion";
import "./setting.css";

const SettingSection = ({ icon: Icon, title, children }) => {
	return (
		<motion.div
			className='setting-section'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='setting-section-header'>
				<Icon className='setting-section-icon' size='24' />
				<h2 className='setting-section-title'>{title}</h2>
			</div>
			{children}
		</motion.div>
	);
};
export default SettingSection;

import "./setting.css";

const ToggleSwitch = ({ label, isOn, onToggle }) => {
	return (
		<div className='toggle-switch'>
			<span className='toggle-switch-label'>{label}</span>
			<button
				className={`toggle-switch-button ${isOn ? "toggle-switch-on" : "toggle-switch-off"}`}
				onClick={onToggle}
			>
				<span
					className={`toggle-switch-indicator ${isOn ? "toggle-switch-indicator-on" : "toggle-switch-indicator-off"}`}
				/>
			</button>
		</div>
	);
};
export default ToggleSwitch;

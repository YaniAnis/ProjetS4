import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import "./setting.css";

const Security = () => {
	const [twoFactor, setTwoFactor] = useState(false);

	return (
		<SettingSection icon={Lock} title={"Security"}>
			<ToggleSwitch
				label={"Two-Factor Authentication"}
				isOn={twoFactor}
				onToggle={() => setTwoFactor(!twoFactor)}
			/>
			<div className='security-button-container'>
				<button className='security-change-password-button'>Changer le Mot de Passe</button>
			</div>
		</SettingSection>
	);
};
export default Security;

import Header from "../components/common/Header";
import DangerZone from "../components/settings/DangerZone";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import "./Pages.css";

const ParametrePage = () => {
	return (
		<div className='settings-page'>
			<Header title='Settings' />
			<main className='settings-main'>
				<Profile />
				<Security />
				<DangerZone />
			</main>
		</div>
	);
};
export default ParametrePage;
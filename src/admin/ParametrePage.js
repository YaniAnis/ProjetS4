import Header from "../components/common/Header";
import DangerZone from "../components/settings/DangerZone";
// import Profile from "../components/settings/Profile";
// import Security from "../components/settings/Security";
import "./Pages.css";

const ParametrePage = () => {
	return (
		<div className='settings-page'>
			<Header title='Settings' />
			<main className='settings-main'>
				{/* <Profile /> */}
				<div style={{
					background: "#232b3b",
					color: "#fff",
					borderRadius: 8,
					padding: 24,
					marginBottom: 24
				}}>
					<b>Profile</b> (Composant manquant)
				</div>
				{/* <Security /> */}
				<div style={{
					background: "#232b3b",
					color: "#fff",
					borderRadius: 8,
					padding: 24,
					marginBottom: 24
				}}>
					<b>Security</b> (Composant manquant)
				</div>
				<DangerZone />
			</main>
		</div>
	);
};
export default ParametrePage;
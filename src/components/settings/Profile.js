import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import "./setting.css";

const Profile = () => {
	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='profile-header'>
				<img
					src='https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
					alt='Profile'
					className='profile-image'
				/>

				<div>
					<h3 className='profile-name'>Admin</h3>
					<p className='profile-email'>jsp@example.com</p>
				</div>
			</div>

			<button className='profile-edit-button'>Edit Profile</button>
		</SettingSection>
	);
};
export default Profile;

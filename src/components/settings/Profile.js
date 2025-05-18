import "./setting.css"

const Profile = () => {
  return (
    <div className="setting-section">
      <div className="setting-section-header">
        <span className="setting-section-icon">👤</span>
        <h2 className="setting-section-title">Profile</h2>
      </div>
      <div className="profile-header">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          alt="Profile"
          className="profile-image"
        />

        <div>
          <h3 className="profile-name">Admin</h3>
          <p className="profile-email">jsp@example.com</p>
        </div>
      </div>

      <button className="profile-edit-button">Edit Profile</button>
    </div>
  )
}
export default Profile


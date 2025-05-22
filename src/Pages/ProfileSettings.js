"use client"

import { useState } from "react"
import ProfileHeader from "./ProfileHeader.js";
import ProfileSidebar from "./ProfileSidebar.js";
import PersonalInfoTab from "./tabs/PersonalInfoTab.js";
import SecurityTab from "./tabs/SecurityTab.js";
import NotificationsTab from "./tabs/NotificationsTab.js";
import PrivacyTab from "./tabs/PrivacyTab";
import DeleteAccountTab from "./tabs/DeleteAccountTab";
import TwoFactorModal from "./TwoFactorModal.js"
import "./profile-settings.css";

import "./main.css";


function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("personal")
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)

  return (
    <div className="profile-settings-container">
      <ProfileHeader />

      <div className="profile-settings-content">
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="profile-settings-main">
          {activeTab === "personal" && <PersonalInfoTab />}
          {activeTab === "security" && <SecurityTab showTwoFactorModal={() => setShowTwoFactorModal(true)} />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "privacy" && <PrivacyTab />}
          {activeTab === "delete" && <DeleteAccountTab />}
        </div>
      </div>

      {showTwoFactorModal && <TwoFactorModal onClose={() => setShowTwoFactorModal(false)} />}
    </div>
  )
}

export default ProfileSettings
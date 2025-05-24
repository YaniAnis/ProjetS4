import TeamPage from "../components/TeamPage";
import "../Pages/Teams.css";

function Teams({ darkMode }) {
  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <main className="main-content">
        <TeamPage darkMode={darkMode} />
      </main>
    </div>
  );
}

export default Teams;

import TeamCard from "./TeamCard"
import "./TeamGrid.css"

function TeamGrid({ teams, darkMode, onTeamClick }) {
  return (
    <div className={`team-grid${darkMode ? " dark-mode" : ""}`}>
      {teams.length > 0 ? (
        teams.map((team) => (
          <div
            key={team.id}
            className="team-card"
            onClick={() => onTeamClick && onTeamClick(team.name)}
            style={{ cursor: "pointer" }}
          >
            <img src={team.logo} alt={team.name} className="team-logo" />
            <div className="team-name">{team.name}</div>
          </div>
        ))
      ) : (
        <div className="no-results">Aucune équipe trouvée</div>
      )}
    </div>
  )
}

export default TeamGrid

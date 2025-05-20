import TeamCard from "./TeamCard"
import "./TeamGrid.css"

function TeamGrid({ teams }) {
  return (
    <div className="team-grid">
      {teams.length > 0 ? (
        teams.map((team) => <TeamCard key={team.id} team={team} />)
      ) : (
        <div className="no-results">Aucune équipe trouvée</div>
      )}
    </div>
  )
}

export default TeamGrid

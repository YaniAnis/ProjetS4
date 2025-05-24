const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <div className="card-inner">
        <div className="player-image-container">
          <img src={player.photo || "/placeholder.svg"} alt={player.name} className="player-image" />
          <div className="jersey-number">{player.jerseyNumber}</div>
          <div className="image-overlay"></div>
          <div className="player-info">
            <h3 className="player-name">{player.name}</h3>
            <p className="player-position">{player.position}</p>
          </div>
          <div className="stats-overlay">
            <div className="stats-content">
              <div className="main-stat">
                <div className="stat-icon-container">
                  <i className="fas fa-bullseye stat-icon"></i>
                  <span className="main-stat-number">{player.goals}</span>
                </div>
                <p className="main-stat-label">Buts cette saison</p>
              </div>
              <div className="additional-stats">
                <div className="stat-item">
                  <div className="stat-value">{player.assists}</div>
                  <div className="stat-label">Passes D.</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    <i className="fas fa-star"></i>
                    {player.rating}
                  </div>
                  <div className="stat-label">Note</div>
                </div>
              </div>
              <div className="matches-info">
                <span className="matches-text">{player.matches} matchs joués</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard

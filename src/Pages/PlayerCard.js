const PlayerCard = ({ player }) => {
  // Map backend fields to frontend fields
  const jerseyNumber = player.maillot;
  const goals = player.buts;
  const assists = player.passes;
  const rating = player.note;
  const matches = player.matches;
  const position = player.poste;
  // Update photo path construction
  const photo = player.image_url 
    ? player.image_url 
    : "/placeholder.svg";

  return (
    <div className="player-card">
      <div className="card-inner">
        <div className="player-image-container">
          <img src={photo} alt={player.name} className="player-image" />
          <div className="jersey-number">{jerseyNumber}</div>
          <div className="image-overlay"></div>
          <div className="player-info">
            <h3 className="player-name">{player.name}</h3>
            <p className="player-position">{position}</p>
          </div>
          <div className="stats-overlay">
            <div className="stats-content">
              <div className="main-stat">
                <div className="stat-icon-container">
                  <i className="fas fa-bullseye stat-icon"></i>
                  <span className="main-stat-number">{goals}</span>
                </div>
                <p className="main-stat-label">Buts cette saison</p>
              </div>
              <div className="additional-stats">
                <div className="stat-item">
                  <div className="stat-value">{assists}</div>
                  <div className="stat-label">Passes D.</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    <i className="fas fa-star"></i>
                    {rating}
                  </div>
                  <div className="stat-label">Note</div>
                </div>
              </div>
              <div className="matches-info">
                <span className="matches-text">{matches} matchs joués</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard

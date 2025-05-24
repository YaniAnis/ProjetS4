import "./MatchInfo.css"

function MatchInfo({ homeTeam, awayTeam, date, time, stadium, homeTeamLogo, awayTeamLogo }) {
  return (
    <div className="match-info-wrapper">
      <div className="container">
        <div className="match-info-card">
          <div className="match-info-content">
            <div className="match-teams">
              {/* Home Team */}
              <div className="team-info">
                <div className="team-logo-container">
                  {homeTeamLogo ? (
                    <img src={homeTeamLogo || "/placeholder.svg"} alt={`${homeTeam} logo`} className="team-logo" />
                  ) : (
                    <img
                      src={`/placeholder.svg?height=60&width=60&text=${homeTeam.substring(0, 2)}`}
                      alt={`${homeTeam} logo`}
                      className="team-logo-placeholder"
                    />
                  )}
                </div>
                <h2 className="team-name">{homeTeam}</h2>
              </div>

              {/* Match Details */}
              <div className="match-details">
                <div className="vs-text">VS</div>
                <div className="match-info-details">
                  <div className="match-info-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="match-info-icon"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="match-info-text">{date}</span>
                  </div>
                  <div className="match-info-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="match-info-icon"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="match-info-text">{time}</span>
                  </div>
                  <div className="match-info-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="match-info-icon"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="match-info-text">{stadium}</span>
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="team-info">
                <div className="team-logo-container">
                  {awayTeamLogo ? (
                    <img src={awayTeamLogo || "/placeholder.svg"} alt={`${awayTeam} logo`} className="team-logo" />
                  ) : (
                    <img
                      src={`/placeholder.svg?height=60&width=60&text=${awayTeam.substring(0, 2)}`}
                      alt={`${awayTeam} logo`}
                      className="team-logo-placeholder"
                    />
                  )}
                </div>
                <h2 className="team-name">{awayTeam}</h2>
              </div>
            </div>
          </div>

          <div className="match-info-footer">
            <h3 className="match-info-footer-text">Select Your Seats Below</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchInfo

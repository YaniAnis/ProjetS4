import React, { useState } from 'react';
import './App.css';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

function App() {
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
  
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    dates.push({
      date: yesterday,
      label: 'Hier',
      dayName: yesterday.toLocaleString('fr-FR', { weekday: 'long' }),
      day: yesterday.getDate()
    });
    
    dates.push({
      date: new Date(today),
      label: "Aujourd'hui",
      dayName: today.toLocaleString('fr-FR', { weekday: 'long' }),
      day: today.getDate()
    });
    
    for (let i = 1; i <= 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push({
        date: nextDate,
        label: '',
        dayName: nextDate.toLocaleString('fr-FR', { weekday: 'long' }),
        day: nextDate.getDate()
      });
    }
    
    return dates;
  };

  const dates = generateDates();
  const [selectedDateIndex, setSelectedDateIndex] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const loadNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
    setSelectedDateIndex(0);
  };

  const matchesByDate = {
    0: [
      {
        homeTeam: "MCA",
        awayTeam: "USMA",
        stadium: "Stade 5 Juillet",
        time: "18:00",
        status: "Terminé",
        score: "2-1"
      }
    ],
    1: [
      {
        homeTeam: "MCA",
        awayTeam: "JSK",
        stadium: "Stade Omar Hamadi",
        time: "16:00",
        status: "En cours",
        score: "1-0",
        minute: "65'"
      },
      {
        homeTeam: "CRB",
        awayTeam: "USMA",
        stadium: "Stade 20 Août 1955",
        time: "20:00",
        status: "À venir",
        score: "vs",
        countdown: "03:45:22"
      }
    ],
    2: [
      {
        homeTeam: "ESS",
        awayTeam: "MCA",
        stadium: "Stade 8 Mai 1945",
        time: "17:30",
        status: "À venir",
        score: "vs",
        countdown: "29:30:15"
      }
    ],
    3: [
      {
        homeTeam: "USMA",
        awayTeam: "CSC",
        stadium: "Stade Omar Hamadi",
        time: "15:00",
        status: "À venir",
        score: "vs",
        countdown: "51:00:45"
      }
    ],
    5: [
      {
        homeTeam: "MCA",
        awayTeam: "USMA",
        stadium: "Stade 5 Juillet",
        time: "19:00",
        status: "À venir",
        score: "vs",
        countdown: "103:00:30"
      }
    ]
  };

  const getMatchesForSelectedDate = () => {
    return matchesByDate[selectedDateIndex] || [];
  };

  const handleMatchClick = (match) => {
    if (match.status === "À venir") {
      console.log(`Redirection vers le match: ${match.homeTeam} vs ${match.awayTeam}`);
      alert(`Vous serez redirigé vers la page du match: ${match.homeTeam} vs ${match.awayTeam}`);
    }
  };

  return (
    <main className="matches-page">
      <div className="container">
        <h1 className="section-title">MATCHES</h1>
        
        <div className="month-container">
          <div className="current-month">{currentMonth}</div>
        </div>
        
        <div className="date-navigation">
          <div className="date-scroll">
            {dates.map((dateObj, index) => (
              <div 
                key={index} 
                className={`date-item ${selectedDateIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedDateIndex(index)}
              >
                {dateObj.label ? (
                  <div className="date-label">{dateObj.label}</div>
                ) : (
                  <>
                    <div className="date-day-name">{dateObj.dayName.charAt(0).toUpperCase() + dateObj.dayName.slice(1, 3)}</div>
                    <div className="date-number">{dateObj.day}</div>
                  </>
                )}
              </div>
            ))}
            <div className="date-item next-week" onClick={loadNextWeek}>
              <div className="next-week-icon">
                <ChevronRight />
              </div>
              <div className="next-week-text">Semaine suivante</div>
            </div>
          </div>
        </div>
        
        <div className="matches-container">
          {getMatchesForSelectedDate().length > 0 ? (
            getMatchesForSelectedDate().map((match, index) => (
              <div 
                key={index} 
                className={`match-box ${match.status === "À venir" ? 'clickable' : ''}`}
                onClick={() => handleMatchClick(match)}
              >
                {match.status !== "À venir" && (
                  <div className={`match-status ${match.status.toLowerCase().replace(' ', '-')}`}>
                    {match.status}
                  </div>
                )}
                
                <div className="match-teams">
                  <div className="team home-team">
                    <div className="team-logo-container">
                      {match.homeTeam === "MCA" ? (
                        <img src="/mca-logo.png" alt="MCA" className="team-logo" />
                      ) : match.homeTeam === "USMA" ? (
                        <img src="/usma-logo.png" alt="USMA" className="team-logo" />
                      ) : (
                        <div className="team-logo-placeholder">{match.homeTeam.charAt(0)}</div>
                      )}
                    </div>
                    <div className="team-name">{match.homeTeam}</div>
                  </div>
                  
                  <div className="match-center">
                    {match.status === "À venir" && match.countdown && (
                      <div className="match-countdown">
                        {match.countdown}
                      </div>
                    )}
                    
                    <div className="match-score">
                      <span>{match.score}</span>
                      {match.status === "En cours" && <div className="match-minute">{match.minute}</div>}
                    </div>
                    
                    <div className="match-info">
                      <div className="match-time">
                        <Clock className="info-icon" />
                        <span>{match.time}</span>
                      </div>
                      <div className="match-stadium">
                        <MapPin className="info-icon" />
                        <span>{match.stadium}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="team away-team">
                    <div className="team-logo-container">
                      {match.awayTeam === "MCA" ? (
                        <img src="/mca-logo.png" alt="MCA" className="team-logo" />
                      ) : match.awayTeam === "USMA" ? (
                        <img src="/usma-logo.png" alt="USMA" className="team-logo" />
                      ) : (
                        <div className="team-logo-placeholder">{match.awayTeam.charAt(0)}</div>
                      )}
                    </div>
                    <div className="team-name">{match.awayTeam}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-matches">
              <p>Aucun match prévu pour cette date</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
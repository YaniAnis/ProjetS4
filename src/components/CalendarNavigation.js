"use client"

import { useEffect, useState } from "react"
import DayItem from "./DayItem"

function CalendarNavigation({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  selectedDate,
  setSelectedDate,
  matches,
}) {
  const [daysInMonth, setDaysInMonth] = useState([])

  // Fonction pour obtenir le nom du mois
  const getMonthName = (month) => {
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]
    return monthNames[month]
  }

  // Fonction pour obtenir le nombre de jours dans un mois
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getDaysInMonthFromMatches = (matches) => {
    const days = new Set();
    
    if (!matches || !Array.isArray(matches)) return [];
  
    matches.forEach((match) => {
      if (!match?.date) return;
      
      try {
        const dateParts = match.date.split(" ");
        if (dateParts.length < 3) return;
  
        const day = parseInt(dateParts[0]);
        const monthStr = (dateParts[1] || "").toLowerCase();
        const year = parseInt(dateParts[2]);
  
        // Only add days for current month/year
        if (monthStr && monthNames[monthStr] === currentMonth + 1 && year === currentYear) {
          days.add(day);
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    });
  
    return Array.from(days).sort((a, b) => a - b);
  };

  const getDaysWithMatches = () => {
    const days = new Set();
    
    if (!matches || !Array.isArray(matches)) return [];
  
    matches.forEach(match => {
      if (!match?.date || typeof match.date !== 'string') return;
      
      try {
        const dateParts = match.date.split(" ");
        if (dateParts.length < 3) return;
  
        const day = parseInt(dateParts[0]);
        const monthStr = (dateParts[1] || "").toLowerCase();
        const year = parseInt(dateParts[2]);
  
        if (isNaN(day) || !monthStr || isNaN(year)) return;
  
        const monthNum = monthNames[monthStr];
        if (!monthNum) return;
  
        if (monthNum - 1 === currentMonth && year === currentYear) {
          days.add(day);
        }
      } catch (err) {
        console.error('Error parsing date:', err);
      }
    });
  
    return Array.from(days).sort((a, b) => a - b);
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const matchDays = getDaysWithMatches();
  
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNumber = i + 1;
      const date = formatDate(dayNumber);
      return {
        number: dayNumber,
        date: date,
        hasMatch: matchDays.includes(dayNumber),
        isSelected: date === selectedDate
      };
    });
  };

  // Générer les jours du mois actuel
  useEffect(() => {
    const days = []
    const daysCount = getDaysInMonth(currentYear, currentMonth)
    const today = new Date()
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear
    const currentDate = today.getDate()

    // Ajouter "Tous les jours"
    days.push({
      date: "all",
      name: "Tous",
      number: "les jours",
      isToday: false,
      isOtherMonth: false,
      hasMatches: false,
    })

    // Ajouter les jours du mois
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dayOfWeek = date.getDay()
      const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

      const month = currentMonth + 1
      const formattedDate = `${currentYear}-${month < 10 ? "0" + month : month}-${i < 10 ? "0" + i : i}`

      days.push({
        date: formattedDate,
        name: dayNames[dayOfWeek],
        number: i,
        isToday: isCurrentMonth && i === currentDate,
        isOtherMonth: false,
        hasMatches: false,
      })
    }

    // Marquer les jours qui ont des matchs
    if (matches.length > 0) {
      const datesWithMatches = new Set();

      matches.forEach((match) => {
        if (!match?.date) return;
        const dateParts = (typeof match.date === "string" ? match.date : "").split(" ");
        if (!dateParts[1] || typeof dateParts[1] !== "string") return;

        const day = Number.parseInt(dateParts[0]);

        const monthNames = {
          janvier: "01",
          février: "02",
          mars: "03",
          avril: "04",
          mai: "05",
          juin: "06",
          juillet: "07",
          août: "08",
          septembre: "09",
          octobre: "10",
          novembre: "11",
          décembre: "12",
        };

        // Defensive: only call toLowerCase if dateParts[1] is a string
        let monthKey = "";
        try {
          monthKey = dateParts[1].toLowerCase();
        } catch {
          monthKey = "";
        }
        const month = monthNames[monthKey];
        const year = Number.parseInt(dateParts[2]);
        if (!month || isNaN(day) || isNaN(year)) return;

        const formattedDate = `${year}-${month}-${day < 10 ? "0" + day : day}`;
        datesWithMatches.add(formattedDate);
      });

      days.forEach((day, index) => {
        if (day.date !== "all" && datesWithMatches.has(day.date)) {
          days[index].hasMatches = true;
        }
      });
    }

    setDaysInMonth(days)
  }, [currentMonth, currentYear, matches])

  // Fonction pour naviguer vers le mois précédent
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1); // Only decrement by 1
        return 11
      }
      return prev - 1
    })
  }

  // Fonction pour naviguer vers le mois suivant
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1); // Only increment by 1
        return 0
      }
      return prev + 1
    })
  }

  // Fonction pour faire défiler les jours vers la gauche
  const scrollDaysLeft = () => {
    const daysSlider = document.getElementById("days-slider")
    if (daysSlider) {
      daysSlider.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  // Fonction pour faire défiler les jours vers la droite
  const scrollDaysRight = () => {
    const daysSlider = document.getElementById("days-slider")
    if (daysSlider) {
      daysSlider.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="calendar-navigation">
      <div className="month-selector">
        <button className="month-nav prev-month" id="prev-month" onClick={goToPreviousMonth}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 id="current-month">
          {getMonthName(currentMonth)} {currentYear}
        </h3>
        <button className="month-nav next-month" id="next-month" onClick={goToNextMonth}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="days-navigation">
        <button className="nav-arrow nav-prev" id="prev-days" onClick={scrollDaysLeft}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="days-slider" id="days-slider">
          {daysInMonth.map((day) => (
            <DayItem
              key={day.date}
              date={day.date}
              name={day.name}
              number={day.number}
              isToday={day.isToday}
              isOtherMonth={day.isOtherMonth}
              hasMatches={day.hasMatches}
              isActive={selectedDate === day.date}
              onClick={() => setSelectedDate(day.date)}
            />
          ))}
        </div>
        <button className="nav-arrow nav-next" id="next-days" onClick={scrollDaysRight}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="days-legend">
        <div className="legend-item">
          <span className="legend-dot has-matches-dot"></span>
          <span>Matchs disponibles</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot today-dot"></span>
          <span>Aujourd'hui</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarNavigation

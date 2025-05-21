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
      const datesWithMatches = new Set()

      matches.forEach((match) => {
        const dateParts = match.date.split(" ")
        const day = Number.parseInt(dateParts[0])

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
        }

        const month = monthNames[dateParts[1].toLowerCase()]
        const year = Number.parseInt(dateParts[2])

        const formattedDate = `${year}-${month}-${day < 10 ? "0" + day : day}`
        datesWithMatches.add(formattedDate)
      })

      days.forEach((day, index) => {
        if (day.date !== "all" && datesWithMatches.has(day.date)) {
          days[index].hasMatches = true
        }
      })
    }

    setDaysInMonth(days)
  }, [currentMonth, currentYear, matches])

  // Fonction pour naviguer vers le mois précédent
  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1
    let newYear = currentYear
    if (newMonth < 0) {
      newMonth = 11
      newYear = currentYear - 1
    }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  // Fonction pour naviguer vers le mois suivant
  const goToNextMonth = () => {
    let newMonth = currentMonth + 1
    let newYear = currentYear
    if (newMonth > 11) {
      newMonth = 0
      newYear = currentYear + 1
    }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
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
          {/* SVG flèche gauche */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h3 id="current-month">
          {getMonthName(currentMonth)} {currentYear}
        </h3>
        <button className="month-nav next-month" id="next-month" onClick={goToNextMonth}>
          {/* SVG flèche droite */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="days-navigation">
        <button className="nav-arrow nav-prev" id="prev-days" onClick={scrollDaysLeft}>
          {/* SVG flèche gauche */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
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
          {/* SVG flèche droite */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
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

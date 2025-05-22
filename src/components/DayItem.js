"use client"

function DayItem({ date, name, number, isToday, isOtherMonth, hasMatches, isActive, onClick }) {
  const classes = [
    "day-item",
    isActive ? "active" : "",
    isToday ? "today" : "",
    isOtherMonth ? "other-month" : "",
    hasMatches ? "has-matches" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes} data-date={date} onClick={onClick}>
      <div className="day-name">{name}</div>
      <div className="day-date">{number}</div>
    </div>
  )
}

export default DayItem

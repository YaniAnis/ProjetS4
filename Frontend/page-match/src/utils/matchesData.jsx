// Fonction pour charger les matchs depuis le localStorage ou utiliser un tableau vide
export function loadMatches() {
  const storedMatches = localStorage.getItem("footballMatches")
  if (storedMatches) {
    return JSON.parse(storedMatches)
  } else {
    // Retourner un tableau vide au lieu des matchs par défaut
    return []
  }
}

// Fonction pour sauvegarder les matchs dans le localStorage
export function saveMatches(matches) {
  localStorage.setItem("footballMatches", JSON.stringify(matches))
}

// Fonction pour formater la date
export function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { day: "numeric", month: "long", year: "numeric" }
  return date.toLocaleDateString("fr-FR", options)
}

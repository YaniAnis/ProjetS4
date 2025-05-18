"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react"
import "./AddMatch.css"

const AddMatch = () => {
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    stadium: "",
    price: "",
    capacity: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Match ajouté:", formData)
    // Réinitialiser le formulaire
    setFormData({
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      stadium: "",
      price: "",
      capacity: "",
    })
  }

  return (
    <motion.div
      className="add-match-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="add-match-title">Ajouter un Match</h2>

      <form onSubmit={handleSubmit} className="add-match-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="homeTeam">Équipe à domicile</label>
            <select
              id="homeTeam"
              name="homeTeam"
              value={formData.homeTeam}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Sélectionner une équipe</option>
              <option value="MC Alger">MC Alger</option>
              <option value="CR Belouizdad">CR Belouizdad</option>
              <option value="JS Kabylie">JS Kabylie</option>
              <option value="USM Alger">USM Alger</option>
              <option value="Paradou AC">Paradou AC</option>
              <option value="ES Sétif">ES Sétif</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="awayTeam">Équipe à l'extérieur</label>
            <select
              id="awayTeam"
              name="awayTeam"
              value={formData.awayTeam}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Sélectionner une équipe</option>
              <option value="MC Alger">MC Alger</option>
              <option value="CR Belouizdad">CR Belouizdad</option>
              <option value="JS Kabylie">JS Kabylie</option>
              <option value="USM Alger">USM Alger</option>
              <option value="Paradou AC">Paradou AC</option>
              <option value="ES Sétif">ES Sétif</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">
              <Calendar size={16} className="form-icon" />
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">
              <Clock size={16} className="form-icon" />
              Heure
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stadium">
              <MapPin size={16} className="form-icon" />
              Stade
            </label>
            <select
              id="stadium"
              name="stadium"
              value={formData.stadium}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Sélectionner un stade</option>
              <option value="Stade 5 Juillet">Stade 5 Juillet</option>
              <option value="Stade 20 Août">Stade 20 Août</option>
              <option value="Stade 1er Novembre">Stade 1er Novembre</option>
              <option value="Stade Nelson Mandela">Stade Nelson Mandela</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">
              <Users size={16} className="form-icon" />
              Capacité
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="form-control"
              min="1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">
              <Tag size={16} className="form-icon" />
              Prix (DA)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="form-control"
              min="0"
              step="100"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Ajouter le Match
        </button>
      </form>
    </motion.div>
  )
}

export default AddMatch

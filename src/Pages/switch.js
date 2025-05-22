"use client"

function Switch({ checked, onChange, disabled = false }) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked)
    }
  }

  return (
    <label className={`switch ${disabled ? "disabled" : ""}`}>
      <input type="checkbox" checked={checked} onChange={handleChange} disabled={disabled} />
      <span className="slider"></span>
    </label>
  )
}

export default Switch

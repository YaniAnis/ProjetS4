"use client"
import "./FormInput.css"

const FormInput = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  maxLength,
  pattern,
  format,
  required,
}) => {
  const handleChange = (e) => {
    if (format) {
      e.target.value = format(e.target.value)
    }
    onChange(e)
  }

  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        maxLength={maxLength}
        pattern={pattern}
        required={required}
      />
    </div>
  )
}

export default FormInput

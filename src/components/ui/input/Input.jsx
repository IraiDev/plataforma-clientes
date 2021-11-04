import React from 'react'
const styleDefault = 'text-sm text-gray-800 border-gray-300 focus:border-blue-500'

function Input({ type = 'text', id, name, value, onChange, placeholder = 'Escriba aqui', className = styleDefault, field = 'campo' }) {
  return (
    <div className="relative">
      <label className="absolute z-20 -top-3 left-6 bg-white px-4 capitalize text-xs">{field}</label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`border px-4 py-2 rounded-full placeholder-gray-400 w-full transition duration-500 focus:outline-none focus:shadow-lg ${className}`}
        placeholder={placeholder}
        onKeyPress={(event) => {
          if (type !== 'number') return
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }} />
    </div>
  )
}

export default Input
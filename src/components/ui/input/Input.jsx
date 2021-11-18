import React from 'react'

function Input({ type = 'text', id, name, value, onChange, placeholder = 'Escriba aqui', field = 'campo' }) {
  return (
    <div>
      <p className="px-4 py-1 capitalize text-xs">{field}</p>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="px-4 py-2 rounded-md w-full bg-gray-100 focus:bg-white transition duration-500 focus:ring-2 focus:shadow-lg"
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
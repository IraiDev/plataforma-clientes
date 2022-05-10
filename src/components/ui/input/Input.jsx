import React from 'react'

function Input({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = 'Escriba aqui',
  field,
  width = 'w-full',
  disabled = false,
  tooltip,
  isNumber = false,
  hidden = false
}
) {

  if (hidden) return null

  return (
    <div className='grid gap-1'>
      <label className='bg-yellow-200 font-semibold capitalize w-max text-sm px-2 rounded-full'>{field}</label>
      <input
        id={id}
        name={name}
        title={tooltip}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={type}
        className={`
          px-4 py-2 rounded-md focus:bg-white transition duration-500
          focus:ring-2 focus:shadow-lg ${width}
          ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-gray-100'}
          `}
        placeholder={placeholder}
        onKeyPress={e => {
          if (isNumber) {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault()
            }
          }
        }} />
    </div>
  )
}

export default Input
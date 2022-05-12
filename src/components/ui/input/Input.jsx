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
  hidden = false,
  isFilter = false
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
          rounded-md transition duration-500
          focus:ring-2 focus:shadow-lg ${width}
          ${isFilter ? 'px-2 py-1' : 'px-4 py-2'}
          ${isFilter ?
            'bg-gray-800 bg-opacity-40 text-white focus:bg-opacity-30' :
            disabled ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 focus:bg-white'
          }
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
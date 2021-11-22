import React from 'react'

function Button({
  name = 'boton',
  icon = 'fas fa-bars',
  className = 'rounded-lg bg-blue-500 hover:bg-blue-600 text-white',
  block = false,
  shadow = false,
  onClick,
  type,
  disabled = false,
  iconFirst = false,
  tooltip
}) {

  if (disabled) {
    return null
  }

  if (type === 'icon') {
    return (
      <button
        title={tooltip}
        onClick={onClick}
        className={`focus:outline-none transition duration-500 h-8 w-8 ${className} ${shadow && 'shadow-md'}`}>
        <i className={icon}></i>
      </button>
    )
  }

  if (type === 'iconText') {
    return (
      <button
        title={tooltip}
        onClick={onClick}
        className={`focus:outline-none transition duration-500 capitalize py-2 px-4 font-semibold ${className} ${shadow && 'shadow-md'} ${block && 'block w-full'}`}
      >
        {iconFirst ?
          <>
            <i className={`${icon} mr-2`}></i>
            {name}
          </>
          :
          <>
            {name}
            <i className={`${icon} ml-2`}></i>
          </>
        }

      </button>
    )
  }

  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={`focus:outline-none transition duration-500 capitalize py-2 px-6 font-semibold ${className} ${shadow && 'shadow-md'}  ${block && 'block w-full'}`}>
      {name}
    </button>

  )
}

export default Button
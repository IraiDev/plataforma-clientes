import React from 'react'
import Tippy from '@tippyjs/react'

function Button({
  name = 'boton',
  icon = 'fas fa-bars',
  className = 'rounded-lg bg-blue-500 hover:bg-blue-600 text-white',
  block = false,
  shadow = false,
  onClick,
  type,
  tippyText = '',
  disabled = false,
  iconFirst = false,
  placement = 'bottom',
}) {

  if (disabled) {
    return null
  }

  if (type === 'icon') {
    return (
      <Tippy
        disabled={tippyText === ''}
        offset={[0, 10]}
        delay={[700, 0]}
        placement={placement}
        content={<span>{tippyText}</span>}
      >
        <button
          onClick={onClick}
          className={`focus:outline-none transition duration-500 h-8 w-8 ${className} ${shadow && 'shadow-md'}`}>
          <i className={icon}></i>
        </button>
      </Tippy>
    )
  }

  if (type === 'iconText') {
    return (
      <Tippy
        disabled={tippyText === ''}
        offset={[0, 10]}
        delay={[700, 0]}
        placement={placement}
        content={<span>{tippyText}</span>}
      >
        <button
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
      </Tippy>
    )
  }

  return (
    <Tippy
      disabled={tippyText === ''}
      offset={[0, 10]}
      delay={[700, 0]}
      placement={placement}
      content={<span>{tippyText}</span>}
    >
      <button
        onClick={onClick}
        className={`focus:outline-none transition duration-500 capitalize py-2 px-4 font-semibold ${className} ${shadow && 'shadow-md'}  ${block && 'block w-full'}`}>
        {name}
      </button>
    </Tippy>

  )
}

export default Button
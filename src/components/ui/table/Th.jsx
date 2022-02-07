import React from 'react'

const Th = ({ children, highlight = false, className, width }) => {
  return (
    <th
      className={`py-1.5 px-3 text-xs md:text-sm ${
        highlight && 'text-red-400'
      } ${className} ${width}`}
    >
      {children}
    </th>
  )
}

export default Th

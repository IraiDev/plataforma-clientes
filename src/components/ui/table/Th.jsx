import React from 'react'

const Th = ({ children, highlight = false, className, width }) => {
   return (
      <th className={`py-2 px-3 ${highlight && 'text-red-400'} ${className} ${width}`}>
         {children}
      </th>
   )
}

export default Th

import React from 'react'

const Td = ({ borderLeft = false, children, align = 'text-center', isMultiLine, width, className }) => {
   return (
      <td className={`py-1.5 ${borderLeft && 'border-l border-gray-300'} ${width}`}>
         <div
            className={`
               ${align} ${isMultiLine ? 'truncate' : 'whitespace-pre-wrap'} 
               ${className}
               px-2 border-gray-300 animate__animated animate__slideInLeft animate__faster z-10`}
         >
            {children}
         </div>
      </td>
   )
}

export default Td

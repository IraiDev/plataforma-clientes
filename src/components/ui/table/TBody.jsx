import React from 'react'

const TBody = ({ children, className = 'bg-white rounded-b-lg' }) => {
   return (
      <tbody className={className}>
         {children}
      </tbody>
   )
}

export default TBody

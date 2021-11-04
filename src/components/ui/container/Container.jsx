import React from 'react'

function Container({ children, tag = 'label', className = 'w-1/3' }) {
  return (
    <div className={`relative border border-gray-700 p-3 rounded-xl h-44 ${className}`}>
      <label className="absolute -top-3 left-4 bg-white px-4">{tag}</label>
      {children}
    </div>
  )
}

export default Container

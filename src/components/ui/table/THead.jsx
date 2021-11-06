import React from 'react'

function THead({ children, width = 'min-w-table' }) {
  return (
    <div className={`sticky top-0 grid grid-cols-12 text-sm mb-4 ${width}`}>
      {children}
    </div>
  )
}

export default THead

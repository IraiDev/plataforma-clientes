import React from 'react'

function THead({ children }) {
  return (
    <div className="sticky top-0 grid grid-cols-12 text-sm mb-4 min-w-table">
      {children}
    </div>
  )
}

export default THead

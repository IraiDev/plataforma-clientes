import React from 'react'

function Table({ children, position = 'fixed fixed top-20 left-0 right-0 bottom-0', margin = 'mx-5 xl:mx-16 2xl:mx-30 mt-10' }) {
  return (
    <div className={`h-5/6 overflow-custom ${margin} ${position}`}>
      {children}
    </div>
  )
}

export default Table

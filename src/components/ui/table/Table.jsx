import React from 'react'



function Table({ children }) {
  return (
    <div className="mx-5 xl:mx-16 2xl:mx-30 mt-10 h-5/6 fixed top-20 left-0 right-0 bottom-0 overflow-auto">
      {children}
    </div>
  )
}

export default Table

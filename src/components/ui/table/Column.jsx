import React from 'react'

function Column({
  children = 'columna',
  className = 'col-span-1 text-center',
  isMultiLine = false,
  isValue = false,
  value
}) {
  return (
    <div className={`p-4 ${className} ${isMultiLine && 'truncate'}`}>
      {children}
      {isValue && <p className="text-xs">({value})</p>}
    </div>
  )
}

export default Column

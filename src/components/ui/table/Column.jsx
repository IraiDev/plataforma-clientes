import React from 'react'

function Column({
  value = 'columna',
  secValue = 'subValue',
  className = 'col-span-1 bg-gray-600 text-white text-center font-semibold p-4',
  isSecValue = false,
  isMultiLine = false
}) {
  return (
    <div className={`capitalize ${className} ${isMultiLine && 'truncate'}`}>
      {value}
      {isSecValue && <p className="text-xs">({secValue})</p>}
    </div>
  )
}

export default Column

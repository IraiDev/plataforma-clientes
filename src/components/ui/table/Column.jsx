import React from 'react'

function Column({
  value = 'columna',
  secValue = 'subValue',
  className = 'col-span-1 bg-gray-600 text-white text-center p-4',
  isSecValue = false
}) {
  return (
    <div className={`capitalize font-semibold shadow-md ${className}`}>
      {value}
      {isSecValue && <p className="text-xs">({secValue})</p>}
    </div>
  )
}

export default Column

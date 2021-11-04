import React from 'react'

function THead() {
  return (
    <div className="sticky top-0 grid grid-cols-12 text-sm mb-4 min-w-table">
      <div className="col-span-1 bg-gray-600 text-white font-semibold text-center p-4 capitalize  shadow-md rounded-l-lg">Numero</div>
      <div className="col-span-1 bg-gray-700 text-white font-semibold text-center p-4 capitalize  shadow-md">fecha</div>
      <div className="col-span-1 bg-gray-600 text-white font-semibold text-center p-2 capitalize  shadow-md">
        empresa
        <p className="text-xs">(proyecto)</p>
      </div>
      <div className="col-span-1 bg-gray-700 text-white font-semibold text-center p-4 capitalize  shadow-md">solicita</div>
      <div className="col-span-2 bg-gray-600 text-white font-semibold text-center p-4 capitalize  shadow-md">titulo</div>
      <div className="col-span-4 bg-gray-700 text-white font-semibold text-center p-4 capitalize  shadow-md">descipcion</div>
      <div className="col-span-1 bg-gray-600 text-white font-semibold text-center p-4 capitalize  shadow-md">estado</div>
      <div className="col-span-1 bg-gray-700 text-white font-semibold text-center p-2 capitalize  shadow-md rounded-r-lg">
        prioridad
        <p className="text-xs">(cliente)</p>
      </div>
    </div>
  )
}

export default THead

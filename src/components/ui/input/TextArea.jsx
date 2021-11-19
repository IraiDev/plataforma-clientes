import React from 'react'
function TextArea({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = 'Escriba aqui',
  field = 'campo',
  rows = 7,
  countChart = 0,
  chartLimit = 500
}) {
  return (
    <div>
      <p className="px-4 py-1 capitalize text-xs">{field}</p>
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        type={type}
        className="scroll-row px-4 py-2 text-justify rounded-md bg-gray-100 focus:bg-white w-full resize-none transition duration-500 focus:ring-2 focus:shadow-lg"
        placeholder={placeholder}></textarea>
      <label className="ml-4 text-gray-500">{countChart}/{chartLimit}</label>
    </div>
  )
}

export default TextArea

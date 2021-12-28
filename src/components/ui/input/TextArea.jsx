import React from 'react'
function TextArea({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = 'Escriba aqui',
  field = 'campo',
  rows = 7,
  chartLimit = 1500
}) {
  return (
    <div>
      <p className="px-4 py-1 capitalize text-xs">{field}</p>
      <textarea
        maxLength={chartLimit}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        type={type}
        className="scroll-row px-4 py-2 text-justify rounded-md bg-gray-100 focus:bg-white w-full resize-none transition duration-500 focus:ring-2 focus:shadow-lg"
        placeholder={placeholder}></textarea>
      <label className={`ml-4 ${value.length === chartLimit ? 'text-red-600' : 'text-gray-700'}`}>
        {value.length}/{chartLimit}
        <p className='ml-2 inline'>Caracteres max.</p>
      </label>
    </div>
  )
}

export default TextArea

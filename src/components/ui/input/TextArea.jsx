import React from 'react'
function TextArea({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = 'Escriba aqui',
  field = 'campo',
  rows = 7,
  chartLimit = 1500,
  disabled = false,
  hiddeHelperText = false,
  isFilter = false
}) {
  return (
    <div className='grid gap-1'>
      <label className='bg-yellow-200 font-semibold capitalize w-max text-sm px-2 rounded-full'>{field}</label>
      <textarea
        disabled={disabled}
        maxLength={chartLimit}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        type={type}
        className={`
          scroll-row text-justify rounded-md bg-gray-100
          focus:bg-white w-full resize-none transition duration-500 focus:ring-2
          focus:shadow-lg
          ${isFilter ? 'px-2 py-1' : 'px-4 py-2'}
          `}
        placeholder={placeholder}></textarea>
      {!hiddeHelperText &&
        <label className={`ml-4 ${value?.length === chartLimit ? 'text-red-600' : 'text-gray-700'}`}>
          {value?.length}/{chartLimit}
          <p className='ml-2 inline'>Caracteres max.</p>
        </label>
      }
    </div>
  )
}

export default TextArea

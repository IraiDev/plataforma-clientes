import Select from 'react-select'

const ComboBox = ({ label, options = [], value, name, onChange, className, placeholder = 'seleccione...' }) => {

  const listOptions = [{ label: 'Ninguno', value: '' }, ...options]

  return (
    <div className='grid gap-1'>

      <label className='bg-yellow-200 font-semibold capitalize w-max text-sm px-2 rounded-full'>{label}</label>

      <Select
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        options={listOptions}
      />

    </div>
  )
}

export default ComboBox
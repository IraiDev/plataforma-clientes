import Select, { components } from 'react-select'
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip'
import styled from '@emotion/styled'

const InlineDialog = styled(TooltipPrimitive)`
  background: rgb(244, 244, 245);
  border-radius: 4px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  border: 1px solid #ccc;
  max-height: 300px;
  max-width: 300px;
  padding: 8px 12px;
  margin-left: 13px;
`

const Option = (props) => {

  return (
    <Tooltip appearance='secundary' content={props?.data?.label} position='right-end' component={InlineDialog}>
      <components.Option {...props} />
    </Tooltip>
  )
}

const ComboBox = ({ label, options = [], value, name, onChange, placeholder = 'seleccione...', isMulti = false }) => {

  const listOptions = [{ label: 'Ninguno', value: '' }, ...options]

  return (
    <div className='grid gap-1'>

      <label className='bg-yellow-200 font-semibold capitalize w-max text-sm px-2 rounded-full'>{label}</label>

      <Select
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        options={isMulti ? options : listOptions}
        menuPortalTarget={document.getElementById('select-root')}
        maxMenuHeight={200}
        isMulti={isMulti}
        isClearable={false}
        components={isMulti ? { Option } : null}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 99999999 }),
          control: (base) => ({
            backgroundColor: isMulti ? 'rgba(28, 40, 51, 0.3)' : 'white',
            border: isMulti ? 'none' : '1px solid #ccc',
            padding: '0px 12px 0px 0px',
            position: 'relative',
            borderRadius: '5px',
          }),
          input: base => ({
            ...base,
            color: isMulti ? 'white' : 'black',
          }),
          indicatorsContainer: (base) => ({
            ...base,
            position: 'absolute',
            right: '-4px',
            top: '50%',
            transform: 'translateY(-50%)',
          }),
          indicatorSeparator: (base) => {
            return {
              display: 'none',
            }
          },
          multiValue: base => ({
            ...base,
            backgroundColor: isMulti ? 'rgba(28, 40, 51, 0.7)' : 'white',
          }),
          multiValueLabel: base => ({
            ...base,
            color: isMulti ? 'white' : 'black',
          }),
          multiValueRemove: base => ({
            ...base,
            color: isMulti ? 'white' : 'black',
          })
        }}
      />

    </div>
  )
}

export default ComboBox
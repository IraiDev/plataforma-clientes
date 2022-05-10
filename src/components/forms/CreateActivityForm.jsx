import { useContext, useEffect, useState } from "react"
import { Ticket } from "../../context/Ticket"
import Button from "../ui/button/Button"
import ComboBox from "../ui/ComboBox"
import Input from "../ui/input/Input"
import TextArea from "../ui/input/TextArea"

const findById = (id, array, hashValue, hashLabel) => {

  const result = array.find(item => item.id_proy === id)

  const formatResult = {
    label: result[hashLabel],
    value: result[hashValue]
  }

  return formatResult || { label: 'Ninguno', value: '' }

}

const formatArray = (array, hashValue, hashLabel) => {

  const format = array.map(item => {
    return {
      label: item[hashLabel],
      value: item[hashValue]
    }
  })

  return format

}

const CreateActivityForm = ({ data }) => {

  const { filterList } = useContext(Ticket)

  const [values, setValues] = useState({
    titulo: '',
    prioridad: '150',
    tiempo_estimado: '1',
    desc: '',
    glosa: ''
  })

  const [select, setSelect] = useState({
    proyecto: { label: 'Ninguno', value: '' },
    subproyecto: { label: 'Ninguno', value: '' },
    solicita: { label: 'Ninguno', value: '' },
    encargado: { label: 'Ninguno', value: '' },
    revisor: { label: 'Ninguno', value: '' }
  })

  const [options, setOptions] = useState({
    proyectos: [],
    sub_proyectos: [],
  })

  const handleInputChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (option, target) => {
    setSelect({
      ...values,
      [target.name]: option
    })
  }

  useEffect(() => {
    setValues(prevState => ({
      ...prevState,
      titulo: data?.titulo_ticket,
      desc: data?.desc_requerimiento,
    }))

    setSelect(prevState => ({
      ...prevState,
      proyecto: findById(data?.id_proyecto, data?.proyectos, 'id_proy', 'proyecto'),
    }))

    setOptions({
      proyectos: formatArray(data?.proyectos, 'id_proy', 'proyecto'),
      sub_proyectos: formatArray(data?.sub_proyectos, 'id_sub_proyecto', 'nombre_sub_proy'),
    })

  }, [data])

  return (
    <div className='grid grid-cols-2 gap-4 mt-5'>

      <h1 className='text-lg font-semibold capitalize absolute top-7'>
        Asignar actividad a
        <label className='bg-yellow-100 px-2 rounded-full ml-2 text-yellow-500'>ticket: 123</label>
      </h1>

      <section className='grid gap-3 mb-5'>
        <ComboBox
          label='proyecto'
          name='proyecto'
          value={select.proyecto}
          onChange={handleSelectChange}
          options={options.proyectos}
        />
        <ComboBox
          label='sub proyecto'
          name='subproyecto'
          value={select.subproyecto}
          onChange={handleSelectChange}
          options={options.sub_proyectos}
        />
        <ComboBox
          label='solicita'
          name='solicita'
          value={select.solicita}
          onChange={handleSelectChange}
          options={filterList?.user_zionit}
        />
        <ComboBox
          label='encargado'
          name='encargado'
          value={select.encargado}
          onChange={handleSelectChange}
          options={filterList?.user_zionit}
        />
        <ComboBox
          label='revisor'
          name='revisor'
          value={select.revisor}
          onChange={handleSelectChange}
          options={filterList?.user_zionit}
        />
      </section>

      <section className='grid gap-3 content-start mb-5'>
        <Input
          field='Titulo'
          name='titulo'
          value={values.titulo}
          onChange={handleInputChange}
        />
        <Input
          field='prioridad'
          name='prioridad'
          value={values.prioridad}
          onChange={handleInputChange}
        />
        <Input
          field='tiempo estimado'
          name='tiempo_estimado'
          value={values.tiempo_estimado}
          onChange={handleInputChange}
        />
      </section>

      <TextArea
        hiddeHelperText
        rows={4}
        field='Descripción'
        name='desc'
        value={values.desc}
        onChange={handleInputChange}
      />
      <TextArea
        hiddeHelperText
        rows={4}
        field='Glosa'
        name='glosa'
        value={values.glosa}
        onChange={handleInputChange}
      />

      <footer className='col-span-2 flex justify-between mt-10'>

        <label
          className='capitalize text-center cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-500 transition duration-500 rounded-full py-1.5 px-3.5 font-semibold h-9 w-max'
          htmlFor='inputFile2'
        >
          <input
            // key={resetFile || ''}
            className='hidden'
            type='file'
            id='inputFile2'
          // onChange={onChangeFile}
          />
          Seleccionar archivo
        </label>

        <Button
          className='bg-transparent hover:bg-green-500 text-green-500 hover:text-white rounded-full border border-green-500'
          name='crear actividad'
        />

      </footer>

    </div>
  )
}

export default CreateActivityForm
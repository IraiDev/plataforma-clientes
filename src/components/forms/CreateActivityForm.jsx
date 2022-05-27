import { useContext, useEffect, useState } from "react"
import { Ticket } from "../../context/Ticket"
import { Ui } from "../../context/Ui"
import { Alert } from "../../helpers/alerts"
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

const CreateActivityForm = ({ data, onClose }) => {

  let randomString = Math.random().toString(36)
  const { optionsList, createActivity } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)

  const [file, setFile] = useState(null)
  const [resetFile, setResetFile] = useState(randomString)

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
      ...select,
      [target.name]: option
    })
  }

  const handleSelectProyect = (option, target) => {

    const filterSubProy = data?.sub_proyectos.filter(item => item.id_proyecto === option.value)

    if (option.value === '') {
      setOptions({
        ...options,
        sub_proyectos: formatArray(data?.sub_proyectos, 'id_sub_proyecto', 'nombre_sub_proy'),
      })
    }
    else {
      setOptions({
        ...options,
        sub_proyectos: formatArray(filterSubProy, 'id_sub_proyecto', 'nombre_sub_proy'),
      })
    }

    setSelect({
      ...select,
      [target.name]: option,
      subproyecto: { label: 'Ninguno', value: '' }
    })
  }

  const validation = () => {

    const errors = {}

    if (!values.titulo) {
      errors.titulo = 'título'
    }

    if (!values.prioridad) {
      errors.prioridad = 'prioridad'
    }

    if (!values.tiempo_estimado) {
      errors.tiempo_estimado = 'tiempo estimado'
    }

    if (!values.desc) {
      errors.desc = 'descripción'
    }

    if (!select.proyecto.value) {
      errors.proyecto = 'proyecto'
    }

    if (!select.solicita.value) {
      errors.solicita = 'solicita'
    }

    if (!select.encargado.value) {
      errors.encargado = 'encargado'
    }

    if (!select.revisor.value) {
      errors.revisor = 'revisor'
    }

    if (select.revisor.value === select.encargado.value) {
      errors.revisor = 'revisor y encargado deben ser distintos'
    }

    return errors

  }

  const handleCreate = async () => {

    toggleLoading(true)

    let formData = new FormData()

    formData.append('id_ticket', data.id_ticket)
    formData.append('titulo', values.titulo)
    formData.append('prioridad', values.prioridad)
    formData.append('tiempo_estimado', values.tiempo_estimado)
    formData.append('descripcion', values.desc)
    formData.append('glosa', values.glosa)
    formData.append('id_proyecto', select.proyecto.value)
    formData.append('sub_proyecto', select.subproyecto.value)
    formData.append('solicita', select.solicita.label)
    formData.append('encargado', select.encargado.label)
    formData.append('revisor', select.revisor.value)
    formData.append('archivo', file)

    const resp = await createActivity(formData)
    onClose()

    if (!resp) {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'Error al crear actividad de este ticket',
        showCancelButton: false,
      })
      return
    }

    Alert({
      title: 'Actividad creada',
      content: 'Se ha creado la actividad con exito',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 2000
    })
  }

  const handleFile = e => {
    if (e.target.files[0].size < 5242881) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
      setResetFile(randomString)
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content:
          'Archivo excede el peso permitido por el sistema, peso maximo 5MB',
        showCancelButton: false,
      })
      return
    }
  }

  const validationLength = Object.keys(validation()).length

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
    <div>
      {validationLength > 0 &&
        <div className="bg-red-100 bg-opacity-60 p-1.5 rounded-lg text-sm w-full text-red-700">
          <p>ATENCION!: revise los siguientes campos</p>
          <span className="flex">
            {
              Object.keys(validation()).map((key, index) => (
                <p
                  key={key}
                  className='mr-1 text-red-500'
                >
                  {validation()[key]}
                  {index === validationLength - 1 ? '' : ','}
                </p>
              ))
            }
          </span>
        </div>
      }

      <h1 className='text-lg font-semibold capitalize absolute top-7'>
        Asignar actividad a
        <label className='bg-yellow-100 px-2 rounded-full ml-2 text-yellow-500'>ticket: {data.id_ticket}</label>
      </h1>

      <div className='grid grid-cols-2 gap-4 mt-5'>

        <section className='grid gap-3 mb-5'>
          <ComboBox
            label='proyecto'
            name='proyecto'
            value={select.proyecto}
            onChange={handleSelectProyect}
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
            options={optionsList?.user_zionit}
          />
          <ComboBox
            label='encargado'
            name='encargado'
            value={select.encargado}
            onChange={handleSelectChange}
            options={optionsList?.user_zionit}
          />
          <ComboBox
            label='revisor'
            name='revisor'
            value={select.revisor}
            onChange={handleSelectChange}
            options={optionsList?.user_zionit}
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

        <footer className='col-span-2 flex justify-between items-end mt-10'>

          <div>
            <label
              className='capitalize text-center cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-500 transition duration-500 rounded-full py-1.5 px-3.5 font-semibold h-9 w-max'
              htmlFor='inputFile2'
            >
              <input
                key={resetFile || ''}
                className='hidden'
                type='file'
                id='inputFile2'
                onChange={handleFile}
              />
              Seleccionar archivo
            </label>

            <label className='text-xs flex mt-4 justify-center'>
              {file ? file.name : 'No hay Archivo adjunto'}
            </label>
          </div>

          <Button
            isDisabled={Object.keys(validation()).length > 0}
            className='bg-transparent hover:bg-green-500 text-green-500 hover:text-white rounded-full border border-green-500'
            name='crear actividad'
            onClick={handleCreate}
          />

        </footer>

      </div>
    </div >
  )
}

export default CreateActivityForm
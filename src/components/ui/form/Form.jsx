import { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from '../../../hooks/useForm'
import { checkForms } from '../../../helpers/helpers'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import { Alert } from '../../../helpers/alerts'
import TextArea from '../input/TextArea'
import Button from '../button/Button'
import LiDocs from '../List/LiDocs'
import Input from '../input/Input'
import Table from '../table/Table'
import Th from '../table/Th'
import THead from '../table/THead'
import TBody from '../table/TBody'
import Td from '../table/Td'
import moment from 'moment'
import Select from 'react-select'

const notAllow = ['exe', 'js']

function Form({ onClick, data, from = 'EX' }) {
  let randomString = Math.random().toString(36)
  const {
    ticket,
    desc_detalle,
    desc_empresa,
    desc_usuario,
    documentos,
    historial,
    id_actividad,
    id_proyecto,
    nombre_actividad,
    prioridad_cliente,
    estado,
  } = data

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { createEvent, addDoc, updatePriority, user } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [{ desc, priority }, onChangeValues, reset] = useForm({
    desc: '',
    priority: prioridad_cliente || '',
  })
  const [file, setFile] = useState(null)
  const [resetFile, setResetFile] = useState(randomString)
  const [events, setEvents] = useState([])
  const [idEvent, setIdEvent] = useState([])
  const [options, setOptions] = useState([])
  const [select, setSelect] = useState({ value: '', label: 'ninguno' })

  const onChangeFile = e => {
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

  const handleNewEvent = async state => {
    let formData = new FormData()
    file !== null && formData.append('archivo', file)
    formData.append('publicOrPrivate', from !== 'EX' ? 'PR' : 'PU')
    id_actividad !== '' && formData.append('id_actividad', id_actividad)
    id_actividad === '' && formData.append('id_ticket', ticket)

    toggleLoading(true)

    const dataPriority = {
      id_ticket: ticket,
      prioridad: Number(priority),
    }

    const fileValidation = () => {
      if (file !== null) {
        const name = file.name.split('.')
        const ext = name[name.length - 1]

        if (notAllow.includes(ext)) {
          setFile(null)
          toggleLoading(false)
          return false
        }
        return true
      }
      return false
    }

    const vFile = await fileValidation()
    const vDesc = checkForms(desc)
    const { state: ok, char, list } = vDesc

    if (ok) {
      toggleLoading(false)
      Alert({
        icon: 'error',
        title: 'Advertencia',
        content: `
        Caracter <b class="text-2xl">${char}</b> no permitido, campo <b class="capitalize"/>Descripcion</b></br>
        Caracteres no permitidos por el sistema: </br>
        <b>${list}</b>
        `,
        showCancelButton: false,
      })
      return
    }

    if (desc === '') {
      if (vFile) {
        addDoc({ data: formData, id: ticket })
        setFile(null)
        setResetFile(randomString)
        Number(priority) !== prioridad_cliente &&
          updatePriority({ data: dataPriority, id: ticket })
        return onClick()
      }
      if (!vFile && file !== null) {
        Alert({
          icon: 'error',
          title: 'Advertencia',
          content:
            'No se puede subir archivos con extensiones, .exe, .js, estos seran removidos de la seleccion',
          showCancelButton: false,
        })
        return
      }
      if (Number(priority) !== prioridad_cliente) {
        updatePriority({ data: dataPriority, id: ticket })
        return onClick()
      }
      toggleLoading(false)
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'No puedes crear un evento sin descripcion',
        showCancelButton: false,
      })
      return
    }

    if (select.value === '') {
      toggleLoading(false)
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'Debes seleccionar un receptor para crear un evento',
        showCancelButton: false,
      })
      return
    }

    const data = {
      id_actividad,
      id_ticket: ticket,
      contenido: desc,
      mensajes_contesta: idEvent,
      emisor: user.rut,
      desc_emisor: user.rut,
      receptor: select.value,
      publico_privado: from === 'EX' ? 'PU' : 'PR',
      est_evento: state,
      id_proyecto: id_proyecto,
      origen: from,
    }

    const resp = await createEvent({ data, id: ticket })

    if (resp) {
      if (vFile) {
        addDoc({ data: formData, id: ticket })
        setFile(null)
        setResetFile(randomString)
        Number(priority) !== prioridad_cliente &&
          updatePriority({ data: dataPriority, id: ticket })
        reset()
        return onClick()
      }
      Number(priority) !== prioridad_cliente &&
        updatePriority({ data: dataPriority, id: ticket })
      reset()
    } else {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'Error al guardar el evento guardar el evento.',
        showCancelButton: false,
      })
    }
    setIdEvent([])
    onClick()
    reset()
  }

  const handleDeleteDoc = () => {
    setFile(null)
    setResetFile(randomString)
    from === 'EX' && onClick()
  }

  const handleCancel = () => {
    if (pathname.includes('/email/') || pathname.includes('/in/')) {
      navigate('/')
    } else onClick()
  }

  useEffect(() => {
    let temp = [{ value: '', label: 'ninguno' }]
    historial.forEach(hist => {
      if (!temp.some(t => t.value === hist.receptor)) {
        temp.push({ value: hist.receptor, label: hist.desc_receptor })
      }
      if (!temp.some(t => t.value === hist.emisor)) {
        temp.push({ value: hist.emisor, label: hist.desc_emisor })
      }
    })
    setOptions(temp)

    setEvents(
      historial.map(el => ({
        select: false,
        id: el.id_evento,
        name: el.desc_emisor,
        rut: el.emisor,
      }))
    )

    return null
    // eslint-disable-next-line
  }, [])

  return (
    <div className='w-full mb-5'>
      <header className='text-2xl capitalize'>
        <h1 className='font-semibold inline'>Ticket:</h1>
        <h1 className='inline ml-2'>{ticket}</h1>
        <h1 className='font-semibold inline'>; actividad:</h1>
        <h1 className='inline ml-2'>
          {id_actividad}, {nombre_actividad}
        </h1>
        <br />
        <h1 className='font-semibold inline'>Empresa:</h1>
        <h1 className='inline ml-2'>
          {desc_empresa}, {desc_usuario}
        </h1>
      </header>
      <section className='border-b border-t border-gray-300 py-5 my-5'>
        <h5 className='capitalize text-xl font-semibold mb-2'>
          mensaje ticket
        </h5>
        <p className='font-light'>{desc_detalle}</p>
      </section>
      <h5 className='text-xl font-semibold w-full mb-5'>Historial</h5>
      <section className='flex flex-col md:flex-row justify-between items-start gap-2 md:gap-6 mb-5'>
        <div className='flex items-baseline gap-2 w-full md:w-1/3'>
          Prioridad
          <Input
            disabled={from !== 'EX' || id_actividad === ''}
            isNumber
            tooltip={
              id_actividad === ''
                ? 'No puedes modificar este campo si este ticket no tiene asignada una actividad'
                : ''
            }
            width='w-20'
            placeholder=''
            name='priority'
            value={priority}
            onChange={onChangeValues}
          />
        </div>
        <div className='flex gap-2 items-center w-full md:w-1/3'>
          Receptor
          <Select
            className='w-full'
            options={options}
            value={select}
            onChange={option => setSelect(option)}
          />
        </div>
      </section>
      <section className='mb-10'>
        <Table width='min-w-table-md' height='max-h-evt-table'>
          <THead>
            <tr className='text-sm text-center capitalize text-white bg-gray-700'>
              <Th width='w-14'>#</Th>
              <Th width='w-14' className='bg-gray-600'>
                estado
              </Th>
              <Th width='w-14'>fecha</Th>
              <Th width='w-14' className='bg-gray-600'>
                actividad
              </Th>
              <Th width='w-20'>emisor</Th>
              <Th width='w-24' className='bg-gray-600'>
                receptor
              </Th>
              <Th>contenido</Th>
            </tr>
          </THead>
          <TBody>
            {historial.length > 0 &&
              historial.map((evt, i) => (
                <tr
                  key={i}
                  className='text-gray-700 bg-gray-100 border-b border-gray-300 text-sm w-max align-text-top'
                >
                  <Td borderLeft={false}>
                    <span className='px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-md'>
                      {i + 1}
                    </span>
                  </Td>
                  <Td borderLeft className='font-semibold'>
                    {evt.est_evento}
                    <input
                      disabled={evt.origen === from}
                      className={`ml-2 ${evt.est_evento !== 'P' && 'hidden'}`}
                      type='checkbox'
                      onChange={e => {
                        const check = e.target.checked
                        setEvents(
                          events.map(ev => {
                            if (ev.id === evt.id_evento) {
                              if (check) {
                                setIdEvent([...idEvent, ev.id])
                              } else {
                                setIdEvent(
                                  idEvent.filter(item => item !== ev.id)
                                )
                              }
                              ev.select = check
                            }
                            return ev
                          })
                        )
                      }}
                    />
                  </Td>
                  <Td borderLeft>
                    {moment(evt.fecha_hora).format('DD/MM/YYYY')}
                    <span className='text-gray-400 block'>
                      {moment(evt.fecha_hora).format('HH:mm')}
                    </span>
                  </Td>
                  <Td borderLeft>{evt.id_actividad}</Td>
                  <Td borderLeft>{evt.desc_emisor} </Td>
                  <Td borderLeft>{evt.desc_receptor}</Td>
                  <Td borderLeft align='text-left'>
                    {evt.contenido}
                  </Td>
                </tr>
              ))}
          </TBody>
        </Table>
      </section>
      {select.value !== '' && (
        <span className='mb-5 text-xl font-semibold'>
          Para:{' '}
          <p className='text-gray-700 font-normal inline'>{select.label}</p>
        </span>
      )}
      <TextArea
        disabled={estado === 3}
        field='Descripcion evento'
        name='desc'
        value={desc}
        onChange={onChangeValues}
      />
      <footer className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10 items-center'>
        <div className='text-sm bg-gray-100 rounded-lg p-2 w-full'>
          <p className='capitalize'>archivo seleccionado (max 5MB):</p>
          <p className='font-semibold mb-2'>
            {file !== null ? file.name : 'no hay archivo seleccionado'}
          </p>
          <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-28 overflow-custom'>
            {documentos.length > 0 &&
              documentos.map(doc => (
                <LiDocs
                  key={doc.id_docum}
                  id={doc.id_docum}
                  from={from}
                  isPublic={doc.publico_privado}
                  type={doc.tipo}
                  route={doc.ruta_docum}
                  idActivity={doc.id_det}
                  idTicket={ticket}
                  ticket={ticket}
                  onClick={handleDeleteDoc}
                >
                  {doc.nom_docum}
                </LiDocs>
              ))}
          </ul>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Button
            disabled={estado === 3 || estado === 8}
            tooltip='Puedes guardar el archivo seleccionado presionando este boton'
            className='bg-yellow-500 hover:bg-yellow-400 text-white rounded-full w-full'
            shadow
            name='guardar pendiente'
            onClick={() => handleNewEvent('P')}
          />
          <Button
            disabled={estado === 3 || estado === 8}
            tooltip='Puedes guardar el archivo seleccionado presionando este boton'
            className='bg-green-500 hover:bg-green-400 text-white rounded-full w-full'
            shadow
            name='guardar OK'
            onClick={() => handleNewEvent('OK')}
          />

          {estado !== 3 && estado !== 8 ?
            <label
              disabled={id_actividad === '' && documentos.length === 1}
              title={
                id_actividad === '' && documentos.length === 1
                  ? 'No puedes subir mas de un archivo si no tienes asignada una actividad'
                  : ''
              }
              className={
                id_actividad === '' && documentos.length === 1
                  ? 'bg-blue-300 cursor-not-allowed text-white rounded-full w-full text-center py-1.5 px-3.5 font-semibold'
                  : 'capitalize text-center cursor-pointer bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-1.5 px-3.5 font-semibold shadow-md w-full'
              }
              htmlFor='inputFile'
            >
              <input
                key={resetFile || ''}
                disabled={id_actividad === '' && documentos.length === 1}
                className='hidden'
                type='file'
                id='inputFile'
                onChange={onChangeFile}
              />
              Seleccionar archivo
            </label>
            : <span />
          }

          <Button
            className={`text-red-500 border border-red-400 hover:bg-red-400 w-full
             hover:text-white rounded-full ${estado === 3 && 'place-self-end'}
             `}
            shadow
            name='cancelar'
            onClick={handleCancel}
          />
        </div>
      </footer>
    </div>
  )
}

export default Form

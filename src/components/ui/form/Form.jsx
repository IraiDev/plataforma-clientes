import React, { useContext, useEffect, useState } from 'react'
import TextArea from '../input/TextArea'
import Table from '../table/Table'
import THead from '../table/THead'
import { v4 as uuidv4 } from 'uuid'
import Column from '../table/Column'
import TBody from '../table/TBody'
import Button from '../button/Button'
import moment from 'moment'
import LiDocs from '../List/LiDocs'
import Input from '../input/Input'
import { useForm } from '../../../hooks/useForm'
import { checkForms } from '../../../helpers/helpers'
import Alert from '../alert/Alert'
import { Ticket } from '../../../context/Ticket'
const notAllow = ['exe', 'js']

const columnEvents = [
  { id: uuidv4(), title: '#' },
  { id: uuidv4(), title: 'fecha' },
  { id: uuidv4(), title: 'actividad' },
  { id: uuidv4(), title: 'emisor' },
  { id: uuidv4(), title: 'receptor' },
  { id: uuidv4(), title: 'contenido' }
]

function Form({ onClick, data, from = 'EX' }) {

  let randomString = Math.random().toString(36)
  const {
    ticket, desc_detalle, desc_proyecto, desc_empresa,
    desc_usuario, documentos, historial, id_actividad,
    id_proyecto, nombre_actividad, prioridad_cliente,
    prioridad_zionit
  } = data

  const { createEvent, addDoc, updatePriority, user } = useContext(Ticket)
  const [{ desc, priority }, onChangeValues, reset] = useForm({ desc: '', priority: prioridad_cliente })
  const [{ isHtml, icon, title, content }, setAlertContent] = useState({})
  const [alert, setAlert] = useState(false)
  const [file, setFile] = useState(null)
  const [resetFile, setResetFile] = useState(randomString)
  const [event, setEvent] = useState([])
  const [idEvent, setIdEvent] = useState([])

  const onChangeFile = (e) => {
    if (e.target.files[0].size < 5242881) {
      setFile(e.target.files[0])
    }
    else {
      setFile(null)
      setResetFile(randomString)
      setAlertContent({
        isHtml: false,
        icon: 'warning',
        title: 'Atencion',
        content: 'Archivo excede el peso permitido por el sistema, peso maximo 5MB'
      })
      return setAlert(true)
    }
  }

  const handleNewEvent = async (state) => {

    let formData = new FormData()
    file !== null && formData.append('archivo', file)
    formData.append('publicOrPrivate', origin ? 'PR' : 'PU')

    const dataPriority = {
      id_ticket: ticket,
      prioridad: Number(priority)
    }

    const fileValidation = () => {
      if (file !== null) {
        const name = file.name.split('.')
        const ext = name[name.length - 1]

        if (notAllow.includes(ext)) {
          setAlertContent({
            isHtml: false,
            icon: 'error',
            title: 'Advertencia',
            content: 'No se puede subir archivos con extensiones, .exe, .js, estos seran removidos de la seleccion.'
          })
          setFile(null)
          setAlert(true)
          return false
        }
        return true
      }
      return false
    }

    const vFile = fileValidation()
    const vDesc = checkForms(desc)

    if (vDesc.state) {
      setAlertContent({
        isHtml: true,
        icon: 'error',
        title: 'Advertencia',
        content: vDesc
      })
      return setAlert(true)
    }

    if (desc === '') {
      if (vFile) {
        addDoc(formData)
        Number(priority) !== prioridad_cliente && updatePriority(dataPriority)
        return
      }
      if (Number(priority) !== prioridad_cliente) {
        return updatePriority(dataPriority)
      }
      setAlertContent({
        isHtml: false,
        icon: 'warning',
        title: 'Atencion',
        content: 'Debe llegar el campo para guardar el evento.'
      })
      return setAlert(true)
    }

    const filter = event.filter(item => item.id === idEvent[0])
    console.log(filter);

    const data = {
      id_actividad,
      id_ticket: ticket,
      contenido: desc,
      mensajes_contesta: idEvent,
      emisor: user.rut,
      desc_emisor: user.rut,
      receptor: filter[0].rec,
      publico_privado: from === 'EX' ? 'PU' : 'PR',
      est_evento: state,
      id_proyecto: id_proyecto,
      origen: from
    }

    const resp = await createEvent(data)
  }

  useEffect(() => {
    setEvent(historial.map(el => ({
      select: false,
      id: el.id_evento,
      rec: el.desc_emisor
    })))
  }, [])

  useEffect(() => {
    console.log(event);
  }, [event])

  return (
    <>
      <div className="w-full mb-5">
        <div className="text-2xl capitalize">
          <h1 className="font-semibold inline">Ticket:</h1>
          <h1 className="inline ml-2">{ticket}</h1>
          <h1 className="font-semibold inline">; actividad:</h1>
          <h1 className="inline ml-2">{id_actividad}, {nombre_actividad}</h1>
          <br />
          <h1 className="font-semibold inline">Empresa:</h1>
          <h1 className="inline ml-2">{desc_empresa}, {desc_usuario}</h1>
        </div>
        <div className="border-b border-t border-gray-300 py-5 my-5">
          <h5 className="capitalize text-lg font-semibolds mb-2">mensaje ticket</h5>
          <p className="font-light">{desc_detalle}</p>
        </div>
        <div className="h-96 mb-10">
          <div className="mb-5 flex justify-between items-center">
            <h5 className="text-xl">Historial</h5>
            <div className="flex items-center gap-2">
              <h5 className="capitalize">Prioridad cliente</h5>
              <Input
                disabled={from !== 'EX'}
                type="number"
                width="w-20"
                placeholder=""
                name="priority"
                value={priority}
                onChange={onChangeValues}
              />
            </div>
          </div>
          <Table position margin >
            <THead width="min-w-table-md">
              {
                columnEvents.map((item, index) => (
                  <Column
                    key={item.id}
                    className={`text-white text-center font-semibold text-base py-3 capitalize
                  ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'}
                  ${index === 5 ? 'col-span-7' : 'col-span-1'}
                  ${index === 0 ? 'rounded-l-md' : index === 5 && 'rounded-r-md'}
                  `} >
                    {item.title}
                  </Column>
                ))
              }
            </THead>
            {
              historial.length > 0 &&
              historial.map(item => (
                <TBody key={item.id_evento} className="text-xs text-center text-gray-600" width="min-w-table-md" isModal={false}>
                  <Column className="p-1.5">
                    {item.est_evento}
                    <input
                      disabled={item.origen === 'IN'}
                      className={`ml-2 ${item.est_evento !== 'P' && 'hidden'}`}
                      type="checkbox"
                      onChange={(e) => {
                        const check = e.target.checked
                        setEvent(event.map(ev => {
                          if (ev.id === item.id_evento) {
                            if (check) {
                              setIdEvent([...idEvent, ev.id])
                            }
                            else {
                              setIdEvent(idEvent.filter(item => item !== ev.id))
                            }
                            ev.select = check
                          }
                          return ev
                        }))
                      }}
                    />
                  </Column>
                  <Column className="bg-gray-100 py-1.5">{moment(item.fecha_hora).format('DD-MM-yyyy')}</Column>
                  <Column className="py-1.5">{item.id_actividad}</Column>
                  <Column className="bg-gray-100 p-1.5">{item.desc_emisor}</Column>
                  <Column className="py-1.5">{item.desc_receptor}</Column>
                  <Column className="col-span-7 bg-gray-100 p-1.5 text-justify rounded-r-md">{item.contenido}</Column>
                </TBody>
              ))
            }
          </Table>
        </div>
        <TextArea
          field="Descripcion evento"
          name="desc"
          value={desc}
          onChange={onChangeValues}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10 items-center">
          <div className="text-sm bg-gray-100 rounded-lg p-2 w-full">
            <p className="capitalize">archivo seleccionado (max 5MB):</p>
            <p className="font-semibold mb-2">{file !== null ? file.name : 'no hay archivo seleccionado'}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-28 overflow-y-auto">
              {
                documentos.length > 0 &&
                documentos.map(doc => (
                  <LiDocs
                    key={doc.id_docum}
                    id={doc.id_docum}
                    origin={doc.publico_privado}
                    type={doc.tipo}
                    route={doc.ruta_docum}
                    idActivity={doc.id_det}>
                    {doc.nom_docum}
                  </LiDocs>
                ))
              }
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              className="bg-yellow-500 hover:bg-yellow-400 text-white rounded-full w-full"
              shadow
              name="guardar pendiente"
              onClick={() => handleNewEvent('P')} />
            <Button
              className="bg-green-500 hover:bg-green-400 text-white rounded-full w-full"
              shadow
              name="guardar OK"
              onClick={() => handleNewEvent('OK')} />
            <label
              className="capitalize text-center cursor-pointer bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-2 px-4 font-semibold shadow-md w-full"
              htmlFor="inputFile">
              <input key={resetFile || ''} className="hidden" type="file" id="inputFile" onChange={onChangeFile} />
              Subir archivo
            </label>
            <Button
              className="text-red-500 border border-red-400 hover:bg-red-400 w-full hover:text-white rounded-full"
              shadow
              name="cancelar"
              onClick={onClick} />
          </div>
        </div>
      </div>

      <Alert
        html={isHtml}
        show={alert}
        showCancelButton={false}
        icon={icon}
        title={title}
        content={!isHtml && content}
        onAction={() => setAlert(false)}>
        {isHtml &&
          <p className="text-gray-700">
            Caracter <b className="font-semibold text-black text-xl">{content.char} No Permitido</b>,
            por favor revise el texto ingresado.
            <br />
            <br />
            <b className="font-semibold capitalize">Caracteres no permitidos:</b>
            <br />
            {content.list}
          </p>
        }
      </Alert>
    </>
  )
}

export default Form

import React from 'react'
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

const columnEvents = [
  { id: uuidv4(), title: '#' },
  { id: uuidv4(), title: 'fecha' },
  { id: uuidv4(), title: 'actividad' },
  { id: uuidv4(), title: 'emisor' },
  { id: uuidv4(), title: 'receptor' },
  { id: uuidv4(), title: 'contenido' }
]

function Form({ onClick, data }) {

  const {
    ticket, desc_detalle, desc_proyecto, desc_empresa,
    desc_usuario, documentos, historial, id_actividad,
    id_proyecto, nombre_actividad, prioridad_cliente,
    prioridad_zionit
  } = data
  const [{ desc, priority }, onChangeValues, reset] = useForm({ desc: '', priority: prioridad_cliente })

  return (
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
                    id={item.id_evento}
                    className={`ml-2 ${item.est_evento !== 'P' && 'hidden'}`}
                    type="checkbox"
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
          <p className="font-semibold mb-2">no hay archivo seleccionado</p>
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
            name="guardar pendiente" />
          <Button
            className="bg-green-500 hover:bg-green-400 text-white rounded-full w-full"
            shadow
            name="guardar OK" />
          <label
            className="capitalize text-center cursor-pointer bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-2 px-4 font-semibold shadow-md w-full"
            htmlFor="inputFile">
            <input className="hidden" type="file" id="inputFile" />
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
  )
}

export default Form

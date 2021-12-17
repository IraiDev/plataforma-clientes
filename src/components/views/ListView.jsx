import React, { useContext, useState } from 'react'
import Column from '../ui/table/Column'
import Table from '../ui/table/Table'
import Row from '../ui/table/Row'
import THead from '../ui/table/THead'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { Ticket } from '../../context/Ticket'

const columnTickets = [
  { id: uuidv4(), title: 'Numero', subTitle: null },
  { id: uuidv4(), title: 'fecha', subTitle: null },
  { id: uuidv4(), title: 'empresa', subTitle: 'proyecto' },
  { id: uuidv4(), title: 'solicita', subTitle: null },
  { id: uuidv4(), title: 'titulo', subTitle: null },
  { id: uuidv4(), title: 'descripcion', subTitle: null },
  { id: uuidv4(), title: 'estado', subTitle: null },
  { id: uuidv4(), title: 'prioridad', subTitle: 'cliente' },
]

function ListView({ multiLine }) {

  const { ticketList, filters, user } = useContext(Ticket)
  const [idRow, setIdRow] = useState(null)

  if (Object.keys(filters).length > 0) { // falta seleccionar algun filtro
    if (filters.emisores.length < 1 || filters.proyectos.length < 1 || filters.estados.length < 1) {
      return (
        <div className="max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20">
          <p>
            Por favor seleccione las tres opciones de filtros <label className="font-semibold capitalize">(Proyectos, emisores y estados)</label>, de lo contrario no se reralizara la busqueda.
            <br />
            <label className="font-semibold block mt-3">Falta seleccionar:</label>
          </p>
          <ul className="font-semibold text-red-500 uppercase mx-auto w-max text-left">
            {filters.proyectos.length < 1 && <li className="list-inside list-disc">proyectos</li>}
            {filters.emisores.length < 1 && <li className="list-inside list-disc">emisores</li>}
            {filters.estados.length < 1 && <li className="list-inside list-disc">estados</li>}
          </ul>
        </div>
      )
    }
  }

  if (ticketList.length === 0 && Object.keys(filters).length < 1) { // no hay filtros aplicados
    return (
      <div className="max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20">
        <p>
          Estimado(a) <label className="font-semibold uppercase">{user.fullName}</label> dado que acaba de ingresar a la plataforma no hay criterios de filtros aplicados, por favor dirigase a la seccion <label className="font-bold text-yellow-500 uppercase">filtros</label> para aplicar criterios de busqueda.
        </p>
      </div>
    )
  }

  if (ticketList.length === 0 && Object.keys(filters).length > 0) { // no se encontraron coincidencias
    return (
      <div className="max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20">
        <p>
          No se encontraron tickets que coincidadn con los filtros aplicados, por favor modifique su seleccion de <label className="font-bold text-yellow-500 uppercase">filtros</label> para realizar una nueva busqueda.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <Table>
        <THead>
          {
            columnTickets.map((item, index) => (
              <Column
                key={item.id}
                className={`text-white text-center w-full text-base font-semibold capitalize
                  ${item.subTitle === null ? 'p-5' : 'p-2'}
                  ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'}
                  ${index === 0 ? 'rounded-l-lg' : index + 1 === columnTickets.length ? 'rounded-r-lg' : ''}
                  ${item.title === 'descripcion' ? 'col-span-4' : item.title === 'titulo' ? 'col-span-2' : 'col-span-1'}
                  `}
                value={item.subTitle !== null ? item.subTitle : ''}
                isValue={item.subTitle !== null} >
                {item.title}
              </Column>
            ))
          }
        </THead>
        {
          ticketList.map(item => (
            <Row
              className="uppercase"
              key={item.id_ticket}
              id={item.id_ticket}
              getId={(id) => setIdRow(id)}
              active={idRow === item.id_ticket && 'border-purple-700 text-purple-700 hover:text-black'}
            >
              <Column className="p-4 text-center">{item.id_ticket}</Column>
              <Column className="col-span-1 px-4 py-1.5 text-center bg-gray-100">
                {moment(item.fecha_hora_tx).format('DD-MM-yyyy')}
                <p className="text-xs text-gray-400">({moment(item.fecha_hora_tx).format('HH:MM')})</p>
              </Column>
              <Column isMultiLine={multiLine} className="col-span-1 px-4 py-1.5 text-center">
                {item.empresa}
                <p className="text-xs text-gray-400">({item.proyecto})</p>
              </Column>
              <Column className="col-span-1 bg-gray-100 p-4 text-center">{item.user_ticket}</Column>
              <Column isMultiLine={multiLine} className="col-span-2 p-4 capitalize font-semibold">{item.titulo_ticket}</Column>
              <Column isMultiLine={multiLine} className="col-span-4 p-4 lowercase bg-gray-100">{item.desc_requerimiento}</Column>
              <Column className={`p-4 capitalize ${item.tiene_pendientes && 'text-red-600 font-semibold'}`}>{item.desc_estado}</Column>
              <Column className="col-span-1 bg-gray-100  text-center p-4 rounded-r-md">{item.prio_cl}</Column>
            </Row>
          ))
        }
      </Table>
    </div>
  )

}

export default ListView

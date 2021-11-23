import React, { useContext } from 'react'
import Column from '../ui/table/Column'
import Table from '../ui/table/Table'
import TBody from '../ui/table/TBody'
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

  const { ticketList } = useContext(Ticket)
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
            <TBody className="uppercase" key={item.id_ticket} id={item.id_ticket}>
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
              <Column isMultiLine={multiLine} className="col-span-4 p-4 capitalize bg-gray-100">{item.desc_requerimiento}</Column>
              <Column className={`p-4 capitalize ${item.tiene_pendientes && 'text-red-600 font-semibold'}`}>{item.desc_estado}</Column>
              <Column className="col-span-1 bg-gray-100  text-center p-4 rounded-r-md">{item.prio_cl}</Column>
            </TBody>
          ))
        }
      </Table>
    </div>
  )
}

export default ListView

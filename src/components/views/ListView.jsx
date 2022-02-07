import React, { useContext, useState } from 'react'
import moment from 'moment'
import { Ticket } from '../../context/Ticket'
import Table from '../ui/table/Table'
import THead from '../ui/table/THead'
import TBody from '../ui/table/TBody'
import Th from '../ui/table/Th'
import Td from '../ui/table/Td'
import Modal from '../ui/modal/Modal'
import Form from '../ui/form/Form'
import { Ui } from '../../context/Ui'
import { Alert } from '../../helpers/alerts'
import Card from '../ui/card/Card'

function ListView({ multiLine }) {
  const { ticketList, filters, user, getTicketDetails } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [idRow, setIdRow] = useState(null)
  const [detailData, setDetailData] = useState({})
  const [modalForm, setModalForm] = useState(false)

  const handleOpenFormModal = async id => {
    setIdRow(id)
    toggleLoading(true)
    const resp = await getTicketDetails(id)
    const { ok, data } = resp
    if (ok) {
      setDetailData(data)
      setModalForm(true)
    } else {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'No se pudo obtener los datos del ticket',
        showCancelButton: false,
      })
    }
  }

  if (Object.keys(filters).length > 0) {
    // falta seleccionar algun filtro
    if (
      filters.emisores.length < 1 ||
      filters.proyectos.length < 1 ||
      filters.estados.length < 1
    ) {
      return (
        <div className='max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20'>
          <p>
            Por favor seleccione las tres opciones de filtros{' '}
            <label className='font-semibold capitalize'>
              (Proyectos, emisores y estados)
            </label>
            , de lo contrario no se reralizara la busqueda.
            <br />
            <label className='font-semibold block mt-3'>
              Falta seleccionar:
            </label>
          </p>
          <ul className='font-semibold text-red-500 uppercase mx-auto w-max text-left'>
            {filters.proyectos.length < 1 && (
              <li className='list-inside list-disc'>proyectos</li>
            )}
            {filters.emisores.length < 1 && (
              <li className='list-inside list-disc'>emisores</li>
            )}
            {filters.estados.length < 1 && (
              <li className='list-inside list-disc'>estados</li>
            )}
          </ul>
        </div>
      )
    }
  }

  if (ticketList.length === 0 && Object.keys(filters).length < 1) {
    // no hay filtros aplicados
    return (
      <div className='max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20'>
        <p>
          Estimado(a){' '}
          <label className='font-semibold uppercase'>{user.fullName}</label>{' '}
          dado que acaba de ingresar a la plataforma no hay criterios de filtros
          aplicados, por favor dirigase a la seccion{' '}
          <label className='font-bold text-yellow-500 uppercase'>filtros</label>{' '}
          para aplicar criterios de busqueda.
        </p>
      </div>
    )
  }

  if (ticketList.length === 0 && Object.keys(filters).length > 0) {
    // no se encontraron coincidencias
    return (
      <div className='max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20'>
        <p>
          No se encontraron tickets que coincidadn con los filtros aplicados,
          por favor modifique su seleccion de{' '}
          <label className='font-bold text-yellow-500 uppercase'>filtros</label>{' '}
          para realizar una nueva busqueda.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='px-2 lg:px-10 2xl:px-32 text-xs md:text-base hidden md:block'>
        <Table width='w-table'>
          <THead>
            <tr className='text-sm font-semibold text-center capitalize text-white bg-gray-700'>
              <Th width='w-10'>#</Th>
              <Th width='w-14' className='bg-gray-600'>
                ID
              </Th>
              <Th width='w-36'>fecha</Th>
              <Th width='w-36' className='bg-gray-600'>
                proyecto
                <span className='block text-gray-300'>(empresa)</span>
              </Th>
              <Th width='w-24'>solicita</Th>
              <Th width='w-60' className='bg-gray-600'>
                titulo
              </Th>
              <Th width='w-128'>descripcion</Th>
              <Th width='w-24' className='bg-gray-600'>
                estado
              </Th>
              <Th width='w-20'>
                prioridad
                <span className='block text-gray-300 font-normal'>
                  (cliente)
                </span>
              </Th>
            </tr>
          </THead>
          <TBody>
            {ticketList.length > 0 &&
              ticketList.map((ticket, i) => (
                <tr
                  onDoubleClick={() => handleOpenFormModal(ticket.id_ticket)}
                  key={ticket.id_ticket}
                  className={`
                  text-gray-700 text-sm border-b w-max
                  hover:bg-blue-100 transition duration-300 cursor-pointer
                  ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  ${idRow === ticket.id_ticket && 'bg-purple-100'}
                  ${!multiLine && 'align-text-top'}
                  `}
                >
                  <Td>
                    <span className='px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-md'>
                      {i + 1}
                    </span>
                  </Td>
                  <Td className='font-semibold text-black'>
                    {ticket.id_ticket}
                  </Td>
                  <Td>
                    {moment(ticket.fecha_hora_tx).format('DD/MM/YYYY')}
                    <span className='block text-gray-400'>
                      {moment(ticket.fecha_hora_tx).format('HH:MM')}
                    </span>
                  </Td>
                  <Td>
                    {ticket.proyecto}
                    <span className='block text-gray-400'>
                      ({ticket.empresa})
                    </span>
                  </Td>
                  <Td className='uppercase'>{ticket.user_ticket}</Td>
                  <Td
                    className='font-semibold text-black'
                    isMultiLine={multiLine}
                    width='max-w-title'
                    align='text-left'
                  >
                    {ticket.titulo_ticket}
                  </Td>
                  <Td
                    width='max-w-desc'
                    isMultiLine={multiLine}
                    align='text-left'
                  >
                    {ticket.desc_requerimiento}
                  </Td>
                  <Td
                    className={`
                    font-semibold ${
                      ticket.tiene_pendientes ? 'text-red-600' : 'text-gray-700'
                    }
                    `}
                  >
                    {ticket.desc_estado}
                  </Td>
                  <Td>{ticket.prio_cl}</Td>
                </tr>
              ))}
          </TBody>
        </Table>
      </div>

      <div className='grid gap-2 px-2 py-4 md:hidden'>
        {ticketList.length > 0 &&
          ticketList.map((ticket, i) => (
            <Card
              onClick={() => handleOpenFormModal(ticket.id_ticket)}
              key={ticket.id_ticket}
              numerator={i}
              title={ticket.titulo_ticket}
              date={moment(ticket.fecha_hora_tx).format('DD/MM/YYYY, HH:MM')}
              project={ticket.proyecto + ' (' + ticket.empresa + ')'}
              userRequest={ticket.user_ticket}
              desc={ticket.desc_requerimiento}
              state={ticket.desc_estado}
              priority={ticket.prio_cl}
              id={ticket.id_ticket}
              isPending={ticket.tiene_pendientes}
            />
          ))}
      </div>

      <Modal
        showModal={modalForm}
        isBlur={false}
        onClose={() => setModalForm(false)}
        className='max-w-7xl'
      >
        <Form data={detailData} onClick={() => setModalForm(false)} />
      </Modal>
    </>
  )
}

export default ListView

import React, { useContext, useState, useEffect } from 'react'
import moment from 'moment'
import { Ticket } from '../../context/Ticket'
import Modal from '../ui/modal/Modal'
import Form from '../ui/form/Form'
import { Ui } from '../../context/Ui'
import { Alert } from '../../helpers/alerts'
import Card from '../ui/card/Card'
import Button from '../ui/button/Button'
import { useWindowSize } from '../../hooks/useWindowSize'
import CreateActivityForm from '../forms/CreateActivityForm'
import HomeTable from '../tables/HomeTable'

function ListView({ multiLine }) {
  const { ticketList, filters, user, getTicketDetails } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [idRow, setIdRow] = useState(null)
  const [detailData, setDetailData] = useState({})
  const [ticketData, setTicketData] = useState({})
  const [modalForm, setModalForm] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [view, toggleView] = useState(true)
  const size = useWindowSize()

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

  const openModalAdd = data => {
    setAddModal(true)
    setTicketData(data)
  }

  useEffect(() => {
    if (view) {
      size.width <= 640 ? toggleView(false) : toggleView(true)
    }
    // eslint-disable-next-line
  }, [size])

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
          No se encontraron tickets que coincidan con los filtros aplicados,
          por favor modifique su seleccion de{' '}
          <label className='font-bold text-yellow-500 uppercase'>filtros</label>{' '}
          para realizar una nueva busqueda.
        </p>
      </div>
    )
  }

  return (
    <>
      {view ? (
        <HomeTable
          data={ticketList}
          openModal={data => openModalAdd(data)}
          openForm={id => handleOpenFormModal(id)}
          multiLine={multiLine}
          idRow={idRow}
        />
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto gap-3 px-2 pt-4 pb-14'>
          {ticketList.length > 0 &&
            ticketList.map((ticket, i) => (
              <Card
                onClick={() => handleOpenFormModal(ticket.id_ticket)}
                onCreateActivity={() => openModalAdd(ticket)}
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
      )}

      <footer className='fixed w-full bottom-0 h-12 bg-white shadow border-t flex justify-between items-center px-5'>
        {view ? 'Modo tabla' : 'Modo tarjetas'}
        <div>
          <Button
            disabled={size.width <= 640}
            className={`hover:bg-gray-200 rounded-lg hover:text-blue-500 ${view && 'text-blue-500'
              }`}
            type='icon'
            icon='fas fa-th-list'
            onClick={() => toggleView(true)}
          />
          <Button
            className={`hover:bg-gray-200 rounded-lg hover:text-blue-500 ${!view && 'text-blue-500'
              }`}
            type='icon'
            icon='fas fa-border-all'
            onClick={() => toggleView(false)}
          />
        </div>
      </footer>

      <Modal
        showModal={modalForm}
        isBlur={false}
        onClose={() => setModalForm(false)}
        className='max-w-7xl'
      >
        <Form data={detailData} onClick={() => setModalForm(false)} />
      </Modal>

      <Modal
        showModal={addModal}
        isBlur={false}
        onClose={() => setAddModal(false)}
        className='max-w-3xl'
      >
        <CreateActivityForm data={ticketData} onClose={() => setAddModal(false)} />
      </Modal>
    </>
  )
}

export default ListView

import { useContext, useState } from 'react'
import { Ticket } from '../../context/Ticket'
import Modal from '../ui/modal/Modal'
import Form from '../ui/form/Form'
import { Ui } from '../../context/Ui'
import { Alert } from '../../helpers/alerts'
import CreateActivityForm from '../forms/CreateActivityForm'
import HomeTable from '../tables/HomeTable'

function ListView({ multiLine }) {
  const { getTicketDetails } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [idRow, setIdRow] = useState(null)
  const [detailData, setDetailData] = useState({})
  const [ticketData, setTicketData] = useState({})
  const [modalForm, setModalForm] = useState(false)
  const [addModal, setAddModal] = useState(false)

  const handleOpenFormModal = async id => {
    setIdRow(id)
    toggleLoading(true)
    const resp = await getTicketDetails(id)
    const { ok, data } = resp

    if (!ok) {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'No se pudo obtener los datos del ticket',
        showCancelButton: false,
      })
      return
    }

    if (data.estado === 3 || data.estado === 8) {
      Alert({
        title: 'Atencion!',
        content: `
        El estado del ticket: ${data.ticket} <b>(${data.desc_detalle})</b> es <b>PARA REVISIÓN</b>,
        en este estado no puede generar nuevos eventos, ya que el ticket ha sido aceptado como
        solucionado y esta en su tramite final. <br> ¿Desea abrir igualmente el ticket?`,
        confirmText: 'Abrir ticket',
        cancelText: 'Cancelar y volver',
        action: () => {
          setDetailData(data)
          setModalForm(true)
        },
        cancelAction: () => {
          toggleLoading(false)
        }
      })
      return
    }
    setDetailData(data)
    setModalForm(true)
  }

  const openModalAdd = data => {
    setAddModal(true)
    setTicketData(data)
  }

  // useEffect(() => {
  //   if (view) {
  //     size.width <= 640 ? toggleView(false) : toggleView(true)
  //   }
  //   // eslint-disable-next-line
  // }, [size])

  // if (Object.keys(filters).length > 0) {
  //   // falta seleccionar algun filtro
  //   if (
  //     filters.emisores.length < 1 ||
  //     filters.proyectos.length < 1 ||
  //     filters.estados.length < 1
  //   ) {
  //     return (
  //       <div className='max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20'>
  //         <p>
  //           Por favor seleccione las tres opciones de filtros{' '}
  //           <label className='font-semibold capitalize'>
  //             (Proyectos, emisores y estados)
  //           </label>
  //           , de lo contrario no se reralizara la busqueda.
  //           <br />
  //           <label className='font-semibold block mt-3'>
  //             Falta seleccionar:
  //           </label>
  //         </p>
  //         <ul className='font-semibold text-red-500 uppercase mx-auto w-max text-left'>
  //           {filters.proyectos.length < 1 && (
  //             <li className='list-inside list-disc'>proyectos</li>
  //           )}
  //           {filters.emisores.length < 1 && (
  //             <li className='list-inside list-disc'>emisores</li>
  //           )}
  //           {filters.estados.length < 1 && (
  //             <li className='list-inside list-disc'>estados</li>
  //           )}
  //         </ul>
  //       </div>
  //     )
  //   }
  // }

  // if (ticketList.length === 0 && Object.keys(filters).length < 1) {
  //   // no hay filtros aplicados
  //   return (
  //     <div className='max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20'>
  //       <p>
  //         Estimado(a){' '}
  //         <label className='font-semibold uppercase'>{user.fullName}</label>{' '}
  //         dado que acaba de ingresar a la plataforma no hay criterios de filtros
  //         aplicados, por favor dirigase a la seccion{' '}
  //         <label className='font-bold text-yellow-500 uppercase'>filtros</label>{' '}
  //         para aplicar criterios de busqueda.
  //       </p>
  //     </div>
  //   )
  // }

  // if (ticketList.length === 0 && Object.keys(filters).length > 0) {
  //   // no se encontraron coincidencias
  //   return (
  //     <div className='max-w-3xl bg-white rounded-md p-8 text-center mx-3 md:mx-auto shadow-lg mt-20'>
  //       <p>
  //         No se encontraron tickets que coincidan con los filtros aplicados,
  //         por favor modifique su seleccion de{' '}
  //         <label className='font-bold text-yellow-500 uppercase'>filtros</label>{' '}
  //         para realizar una nueva busqueda.
  //       </p>
  //     </div>
  //   )
  // }

  return (
    <>
      <HomeTable
        openModal={data => openModalAdd(data)}
        openForm={id => handleOpenFormModal(id)}
        multiLine={multiLine}
        idRow={idRow}
      />

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

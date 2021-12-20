import React, { useContext, useState } from 'react'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import { Alert } from '../../../helpers/alerts'
import Form from '../form/Form'
import Modal from '../modal/Modal'

function Row({ id, children, width = 'min-w-table', isModal = true, className, active, getId }) {

  const { getTicketDetails, ticketDetail } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [modalFrom, setModalForm] = useState(false)

  const openModal = async () => {
    getId(id)
    await toggleLoading(true)
    const resp = await getTicketDetails(id)
    if (resp) setModalForm(true)
    else {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'No se pudo obtener los datos del ticket',
        showCancelButton: false
      })
    }
  }

  return (
    <>
      <div onDoubleClick={isModal ? openModal : () => { }}
        className={`grid grid-cols-12 text-sm my-1 bg-white hover:border-gray-500 hover:bg-gray-50 cursor-pointer transition duration-300 border-2 rounded-lg shadow-md ${width} ${className} ${active}`}>
        {children}
      </div>

      {
        isModal &&
        <Modal showModal={modalFrom} isBlur={false} onClose={() => setModalForm(false)}
          className="max-w-7xl">
          <Form data={ticketDetail} onClick={() => setModalForm(false)} />
        </Modal>
      }
    </>
  )
}

export default Row

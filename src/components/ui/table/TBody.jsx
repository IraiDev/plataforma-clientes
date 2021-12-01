import React, { useContext, useState } from 'react'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import { Alert } from '../../../helpers/alerts'
import Form from '../form/Form'
import Modal from '../modal/Modal'

function TBody({ id, children, width = 'min-w-table', isModal = true, className }) {

  const [modalFrom, setModalForm] = useState(false)
  const { getTicketDetails } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [ticketDetails, setTicketDetails] = useState({})

  const openModal = async () => {
    await toggleLoading(true)
    const resp = await getTicketDetails(id)
    if (Object.keys(resp).length > 0) {
      setTicketDetails(resp)
      setModalForm(true)
    }
    else {
      Alert({
        icon: 'error',
        title: 'Error',
        content: 'No se pudo obtener los datos del ticket',
        showCancelButton: false,
        timer: 5000
      })
    }
  }

  return (
    <>
      <div onDoubleClick={isModal ? openModal : () => { }}
        className={`grid grid-cols-12 text-sm my-1 bg-white hover:border-gray-500 hover:bg-gray-50 transition duration-300 border-2 rounded-lg shadow-md ${width} ${className}`}>
        {children}
      </div>

      {
        isModal &&
        <Modal showModal={modalFrom} isBlur={false} onClose={() => setModalForm(false)}
          className="max-w-5xl p-8">
          <Form data={ticketDetails} onClick={() => setModalForm(false)} />
        </Modal>
      }
    </>
  )
}

export default TBody

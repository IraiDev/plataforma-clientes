import React, { useState } from 'react'
import Form from '../form/Form'
import Modal from '../modal/Modal'

function TBody({ children, width = 'min-w-table', isModal = true }) {

  const [modalFrom, setModalForm] = useState(false)

  return (
    <>
      <div onDoubleClick={() => setModalForm(true)}
        className={`grid grid-cols-12 text-sm my-1 bg-white hover:border-gray-500 hover:bg-gray-50 transition duration-300 border-2 rounded-lg shadow-md ${width}`}>
        {children}
      </div>

      {
        isModal &&
        <Modal showModal={modalFrom} isBlur={false} onClose={() => setModalForm(false)}
          className="max-w-5xl p-8">
          <Form onClick={() => setModalForm(false)} />
        </Modal>
      }
    </>
  )
}

export default TBody

import React, { useState } from 'react'
import Form from '../form/Form'
import Modal from '../modal/Modal'

function TBody({ isMultiLine, numero }) {

  const [modalFrom, setModalForm] = useState(false)

  return (
    <>
      <div onDoubleClick={() => setModalForm(true)}
        className="grid grid-cols-12 text-sm my-1 bg-white hover:border-gray-500 hover:bg-gray-50 transition duration-300 border-2 rounded-lg shadow-md min-w-table">
        <div className="col-span-1 text-center p-4 rounded-l-lg">{numero}</div>
        <div className="col-span-1 text-center p-4">fecha</div>
        <div className="col-span-1 text-center p-4">emmpresa</div>
        <div className="col-span-1 text-center p-4">solicita</div>
        <div className={`col-span-2 p-4 ${isMultiLine && 'truncate'}`}>adipisicing elit. Facere quaerat deleniti</div>
        <div className={`col-span-4 text-justify p-4 ${isMultiLine && 'truncate'}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere quaerat deleniti accusantium animi. Cumque reiciendis laboriosam voluptas explicabo fuga autem error enim iusto, aspernatur voluptatum maiores provident recusandae quibusdam officiis?</div>
        <div className="col-span-1 text-center p-4">estado</div>
        <div className="col-span-1 text-center p-4 rounded-r-lg">prioridad</div>
      </div>

      <Modal showModal={modalFrom} isBlur={false} onClose={() => setModalForm(false)}
        className="max-w-5xl">
        <Form />
      </Modal>
    </>
  )
}

export default TBody

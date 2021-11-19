import React, { useState } from 'react'
import Alert from '../alert/Alert'
import Button from '../button/Button'

const urlRA = 'http://www.zcloud.cl/registro_avance/'
const urlTicket = 'http://www.zcloud.cl/'

function LiDocs(props) {
  const { children, type, route, idActivity, origin, id } = props
  const [check, setCheck] = useState(false)
  const [alert, setAlert] = useState(false)

  const handleDelete = () => {
    setAlert(true)
  }

  return (
    <>
      <li className="p-2 col-span-1 border-2 border-transparent hover:border-blue-400 shadow-md transition duration-300 bg-white rounded-md flex items-center justify-between">
        <div className="truncate">
          <input
            disabled={origin === 'PU'}
            className={`mr-2 ${origin === 'PU' && 'hidden'}`}
            type="checkbox"
            checked={check}
            onChange={(e) => { setCheck(e.target.checked) }} />
          <a className="hover:text-blue-500 font-semibold text-gray-600 transition duration-300"
            rel="noreferrer"
            href={`${idActivity !== null ? urlRA : urlTicket}${route}`}
            target="_blank">
            {children}
          </a>
        </div>
        <Button
          className="text-blue-500 hover:text-red-500"
          type="icon"
          icon="fas fa-trash-alt"
          onClick={handleDelete} />
      </li>
      <Alert
        show={alert}
        icon="warning"
        title="Atencion"
        html={true}
        onCancel={() => setAlert(false)}>
        <p className="text-gray-600">Se eliminara el siguiente archivo: <p className="font-semibold text-black">{children}</p></p>
      </Alert>
    </>
  )
}

export default LiDocs

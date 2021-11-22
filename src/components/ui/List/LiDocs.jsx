import React, { useContext, useState } from 'react'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import Alert from '../alert/Alert'
import Button from '../button/Button'

const urlRA = 'http://www.zcloud.cl/registro_avance/'
const urlTicket = 'http://www.zcloud.cl/'

function LiDocs(props) {
  const { children, type, route, idActivity, origin, id, onClick } = props
  const { deleteDoc } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [check, setCheck] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertState, setAlertState] = useState(false)

  const handleDelete = () => {
    setAlertState(false)
    setAlert(true)
  }

  const onAction = async () => {
    if (!alertState) {
      toggleLoading(true)
      setAlert(false)
      const data = { id_docum: id, tipo: type }
      const resp = await deleteDoc(data)
      if (resp) onClick()
      else {
        setAlert(true)
        setAlertState(true)
      }
    }
    else {
      setAlert(false)
    }
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
        icon={alertState ? 'error' : 'warning'}
        title={alertState ? 'Error' : 'Atencion'}
        html={true}
        onAction={onAction}
        showCancelButton={!alertState}
        onCancel={() => setAlert(false)}>
        {alertState ?
          'Error al eliminar el archivo, vuelva a intentarlo, si el error persiste comuniquese con un administrador.'
          :
          <p className="text-gray-600">
            Se eliminara el siguiente archivo:
            <br />
            <b className="font-semibold text-black">{children}</b>
            <br />
            Esta accion cerrara el formulario.
          </p>}
      </Alert>
    </>
  )
}

export default LiDocs

import React, { useContext, useState } from 'react'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import Alert from '../alert/Alert'
import Button from '../button/Button'

const urlRA = 'http://www.zcloud.cl/registro_avance/'
const urlTicket = 'http://www.zcloud.cl/'

const initialState = {
  ok: false,
  icon: 'warning',
  title: 'Atencion',
  content: 'P',
  cancelButton: true,
  action: true
}

function LiDocs(props) {
  const { children, type, route, idActivity, isPublic, from, id, onClick } = props
  const { deleteDoc, toggleDoc } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [check, setCheck] = useState(isPublic === 'PU')
  const [alert, setAlert] = useState(false)
  const [{ ok, icon, title, content, cancelButton, action }, setAlertContent] = useState(initialState)

  const handleDelete = () => {
    setAlertContent(initialState)
    setAlert(true)
  }

  const onDelete = async () => {
    if (!ok) {
      toggleLoading(true)
      setAlert(false)
      const data = { id_docum: 123123123, tipo: type }
      const resp = await deleteDoc(data)
      if (resp) onClick()
      else {
        setAlert(true)
        setAlertContent({
          ok: true,
          icon: 'error',
          title: 'Error',
          content: 'Error al eliminar el archivo, vuelva a intentarlo, si el error persiste comuniquese con un administrador.',
          cancelButton: false,
          action: true
        })
      }
    }
    else {
      setAlert(false)
    }
  }

  const onChangeFile = (e) => {
    const target = e.target.checked
    setCheck(target)
    setAlert(true)
    setAlertContent({
      ok: false,
      icon: 'info',
      title: 'Actualizacion',
      cancelButton: true,
      action: false,
      content: `${<p className="text-gray-600">
        Se eliminara el siguiente archivo:
        <br />
        <b className="font-semibold text-black">{children}</b>
        <br />
        Esta accion cerrara el formulario.
      </p>}`
    })
  }

  const onUpdate = async () => {
    const resp = await toggleDoc({ id_docum: id, accion: check ? 'PU' : 'PR' })
  }

  return (
    <>
      <li className="p-2 col-span-1 border-2 border-transparent hover:border-blue-400 shadow-md transition duration-300 bg-white rounded-md flex items-center justify-between">
        <div className="truncate">
          <input
            disabled={isPublic === 'PU' && from === 'EX'}
            className={`mr-2 ${from === 'EX' && 'hidden'}`}
            type="checkbox"
            checked={check}
            onChange={onChangeFile} />
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
        icon={icon}
        title={title}
        html={true}
        onAction={action ? onDelete : onUpdate}
        showCancelButton={cancelButton}
        onCancel={() => setAlert(false)}>
        {content !== 'P' ?
          content
          :
          <p className="text-gray-600">
            Se eliminara el siguiente archivo:
            <br />
            <b className="font-semibold text-black">{children}</b>
            <br />
            Esta accion cerrara el formulario.
          </p>
        }
      </Alert>
    </>
  )
}

export default LiDocs

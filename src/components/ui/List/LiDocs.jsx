import React, { useContext, useState } from 'react'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import { Alert } from '../../../helpers/alerts'
import Button from '../button/Button'

const urlRA = 'http://www.zcloud.cl/registro_avance/'
const urlTicket = 'http://www.zcloud.cl/'

function LiDocs(props) {
  const { children, type, route, idActivity, isPublic, from, id, onClick, idTicket } = props
  const { deleteDoc, toggleDoc } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [check, setCheck] = useState(isPublic === 'PU')

  const handleDelete = async () => {
    const action = async () => {
      toggleLoading(true)
      const data = { id_docum: id, tipo: type }
      const resp = await deleteDoc({ data, id: idTicket })
      if (resp) {
        onClick()
      }
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al eliminar el archivo, vuelva a intentarlo.',
          showCancelButton: false
        })
      }
    }

    Alert({
      icon: 'warn',
      title: 'Atencion',
      content: `¿Esta seguro de eliminar el siguiente archivo: <b>${children}</b>?`,
      cancelText: 'No, cancelar',
      confirmText: 'Si, eliminar',
      action
    })
  }

  const onChangeFile = (e) => {
    const target = e.target.checked

    const action = async () => {
      toggleLoading(true)
      const data = { id_docum: id, accion: target ? 'PU' : 'PR' }
      const resp = await toggleDoc({ data, id: idTicket })
      if (resp) setCheck(target)
      else {
        Alert({
          title: 'Error',
          icon: 'error',
          content: 'Hubo un error al cambiar el estado del archivo, vuelva a intentarlo',
          showCancelButton: false
        })
        setCheck(isPublic === 'PU')
      }
    }

    Alert({
      icon: 'info',
      title: 'Cambio de privacidad',
      cancelText: 'No, cancelar',
      confirmText: 'Si, Cambiar',
      content:
        `Se cambiara el estado del archivo  
        <b>"${children}"</b> de: </br>
        <b>${isPublic === 'PU' ? 'Publico' : 'Privado'}</b> a 
        <b>${isPublic !== 'PU' ? 'Publico' : 'Privado'}</b> </br>
        <b>¿Esta seguro de realizar esta accion?</b>
      `,
      action,
    })
  }

  if (isPublic === 'PU' && from === 'EX') return null

  return (
    <li className="p-2 col-span-1 border-2 border-transparent hover:border-blue-400 shadow-md transition duration-300 bg-white rounded-md flex items-center justify-between" >
      <div className="truncate">
        <input
          disabled={from === 'EX'}
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
  )
}

export default LiDocs

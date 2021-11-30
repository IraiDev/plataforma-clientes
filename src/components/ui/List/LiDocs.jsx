import React, { useContext, useState } from 'react'
import { Ticket } from '../../../context/Ticket'
import { Ui } from '../../../context/Ui'
import { Alert } from '../../../helpers/alerts'
import Button from '../button/Button'

const urlRA = 'http://www.zcloud.cl/registro_avance/'
const urlTicket = 'http://www.zcloud.cl/'

function LiDocs(props) {
  const { children, type, route, idActivity, isPublic, from, id, onClick } = props
  const { deleteDoc, toggleDoc } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [check, setCheck] = useState(isPublic === 'PU')

  const handleDelete = () => {
  }

  const onDelete = async () => {
    if (true) {
      toggleLoading(true)
      const data = { id_docum: 123123123, tipo: type }
      const resp = await deleteDoc(data)
      if (resp) onClick()
      else {
        Alert({
          icon: 'error',
          title: 'Error',
          content: 'Error al eliminar el archivo, vuelva a intentarlo.',
          showCancelButton: false,
          timer: 5000
        })
      }
    }
  }

  const onChangeFile = (e) => {
    const target = e.target.checked

    const action = async () => {
      const resp = await toggleDoc({ id_docum: id, accion: target ? 'PU' : 'PR' })
      if (!resp) {
        Alert({
          title: 'Error',
          icon: 'error',
          content: 'Hubo un error al cambiar el estado del archivo, vuelva a intentarlo',
          showCancelButton: false,
          timer: 5000
        })
        setCheck(isPublic === 'PU')
      }
      else setCheck(target)
    }

    Alert({
      icon: 'info',
      title: 'Cambio de privacidad',
      cancelButtonText: 'No, cancelar',
      confirmButtonText: 'Si, Cambiar',
      content: `Se cambiara el estado del archivo  
      <b"${children}"</p> de: </br>
      <b${isPublic === 'PU' ? 'Publico' : 'Privado'}</b> a 
      <b${isPublic !== 'PU' ? 'Publico' : 'Privado'}</b> </br>
      <b>¿Esta seguro de realizar esta accion?</b>
      `,
      action,
    })
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
    </>
  )
}

export default LiDocs

import React, { useState } from 'react'
import { fetchToken, fetchUnToken } from '../helpers/fetch'

export const Ticket = React.createContext()

const msg = '-- “Estimado Usuario este pin no es reconocido por el sistema, deben ser solo letras y números (mínimo 8), intente nuevamente por favor o en su defecto dejar su dirección de correo electrónico en casilla y luego elegir procesar, el sistema le enviará indicaciones, OBS: si la dirección e-mail proporcionada por usted no está en nuestros registros el correo no será enviado”--'

function TicketProvider({ children }) {

  const [user, setUser] = useState({ ok: false })

  const login = async (data) => {

    if (data.pin === '') {
      setUser({ title: 'PIN vacio', content: 'Debe llenar el campo', icon: 'info' })
      return
    }

    const resp = await fetchUnToken('auth-ticket/login', data, 'POST')
    const body = await resp.json()

    if (body.ok) {
      localStorage.setItem('ticketToken', body.token)
      const data = {
        ok: body.ok,
        rut: body.resUser.rut_user,
        name: body.resUser.nom_user,
        fullName: body.resUser.nombre
      }
      setUser(data)
      return true
    }
    else {
      if (body.tipo === 1) {
        setUser({
          content: msg,
          title: 'atencion',
          icon: 'info'
        })
        return false
      }
      if (body.tipo === 2) {
        setUser({
          content: body.msg,
          title: 'atencion',
          icon: 'warning'
        })
        return false
      }
      if (body.tipo === 3) {
        setUser({
          content: body.msg,
          title: 'PIN recuperado',
          icon: 'info'
        })
        return false
      }
    }
  }

  const validateSession = async () => {
    const resp = await fetchToken('auth-ticket/renew-ticket')
    const body = await resp.json()

    if (body.ok) {
      localStorage.setItem('ticketToken', body.token)
      const data = {
        ok: body.ok,
        rut: body.resUser.rut_user,
        name: body.resUser.nom_user,
        fullName: body.resUser.nombre
      }
      setUser(data)
      return true
    }
    else {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('ticketToken')
    window.location.reload()
  }

  const value = {
    login,
    validateSession,
    logout,
    user
  }

  return (
    <Ticket.Provider value={value}>
      {children}
    </Ticket.Provider>
  )
}

export default TicketProvider

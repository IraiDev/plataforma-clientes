import React, { useState } from 'react'
import { fetchToken, fetchUnToken } from '../helpers/fetch'

export const Ticket = React.createContext()

const msg = '-- “Estimado Usuario este pin no es reconocido por el sistema, deben ser solo letras y números (mínimo 8), intente nuevamente por favor o en su defecto dejar su dirección de correo electrónico en casilla y luego elegir procesar, el sistema le enviará indicaciones, OBS: si la dirección e-mail proporcionada por usted no está en nuestros registros el correo no será enviado”--'

function TicketProvider({ children }) {

  const [user, setUser] = useState({ ok: false })
  const [ticketList, setTicketList] = useState([])

  const login = async (data) => {

    if (data.pin === '') {
      setUser({ title: 'PIN vacio', content: 'Debe llenar el campo', icon: 'info' })
      return
    }

    const resp = await fetchUnToken('auth-ticket/login', data, 'POST')
    const body = await resp.json()
    const { ok, resUser, token, tipo } = body

    if (ok) {
      const r = await fetchToken(`ticket/get-info-user?rut_usuario=${resUser.rut_user}`)
      const b = await r.json()
      localStorage.setItem('ticketToken', token)
      const data = {
        ok,
        rut: resUser.rut_user,
        name: resUser.nom_user,
        fullName: resUser.nombre,
        email: resUser.correo,
        phone: b.usuario.phone
      }

      setUser(data)
      return true
    }
    else {
      if (tipo === 1) {
        setUser({
          content: msg,
          title: 'atencion',
          icon: 'info'
        })
        return false
      }
      if (tipo === 2) {
        setUser({
          content: msg,
          title: 'atencion',
          icon: 'warning'
        })
        return false
      }
      if (tipo === 3) {
        setUser({
          content: msg,
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
    const { ok, resUser, token } = body

    if (ok) {
      const r = await fetchToken(`ticket/get-info-user?rut_usuario=${resUser.rut_user}`)
      const b = await r.json()
      localStorage.setItem('ticketToken', token)
      const data = {
        ok,
        rut: resUser.rut_user,
        name: resUser.nom_user,
        fullName: resUser.nombre,
        email: resUser.correo,
        phone: b.usuario.phone
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
    window.console.clear()
  }

  const getProjects = async () => {
    const resp = await fetchToken(`ticket/get-filters-ticket?rut_usuario=${user.rut}`)
    const body = await resp.json()
    const { ok, msg } = body
    if (ok) {
      return msg.arrayEmpresas
    }
    console.log('fallo la peticion (getPorject)', body)
  }

  const getUsers = async (data) => {
    const resp = await fetchToken('ticket/get-user-empresa', data, 'POST')
    const body = await resp.json()
    const { ok, msg } = body
    if (ok) {
      return msg
    }
    console.log('fallo la peticion (getusers)', body)
  }

  const getStates = async (data) => {
    const resp = await fetchToken('ticket/get-user-estado', data, 'POST')
    const body = await resp.json()
    const { ok, msg } = body
    if (ok) return msg
    console.log('fallo la peticion (getStates)', body)
  }

  const getTicketList = async (filters) => {
    const resp = await fetchToken('ticket/get-tickets', filters, 'POST')
    const body = await resp.json()
    const { ok, resp: res } = body

    console.log('ticketList: ', res)

    if (ok) setTicketList(res)
    else { console.log('fallo la peticion (getTicketList): ', body) }
  }

  const value = {
    login,
    validateSession,
    logout,
    getProjects,
    getUsers,
    getStates,
    getTicketList,
    user,
    ticketList
  }

  return (
    <Ticket.Provider value={value}>
      {children}
    </Ticket.Provider>
  )
}

export default TicketProvider

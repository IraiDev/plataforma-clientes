import React, { useContext, useState } from 'react'
import { fetchToken, fetchTokenFile, fetchUnToken } from '../helpers/fetch'
import { Ui } from './Ui'

export const Ticket = React.createContext()

const msg = '-- “Estimado Usuario este pin no es reconocido por el sistema, deben ser solo letras y números (mínimo 8), intente nuevamente por favor o en su defecto dejar su dirección de correo electrónico en casilla y luego elegir procesar, el sistema le enviará indicaciones, OBS: si la dirección e-mail proporcionada por usted no está en nuestros registros el correo no será enviado”--'

function TicketProvider({ children }) {

  const { toggleLoading } = useContext(Ui)
  const [user, setUser] = useState({ ok: false })
  const [ticketList, setTicketList] = useState([])
  const [filters, setFilters] = useState({})

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

  const getQuestion = async (id) => {
    const resp = await fetchToken(`ticket/get-preguntas?id_proyecto=${id}`)
    const body = await resp.json()
    const { ok, resp: res } = body

    toggleLoading(false)

    if (ok) return res
    console.log('fallo la peticion (getQuestion): ', body)
  }

  const getTicketList = async (params = null) => {

    if (params === null) params = filters

    const resp = await fetchToken('ticket/get-tickets', params, 'POST')
    const body = await resp.json()
    const { ok, resp: res } = body

    toggleLoading(false)
    console.log(body)

    if (ok) setTicketList(res)
    else { console.log('fallo la peticion (getTicketList): ', body) }
  }

  const getTicketDetails = async (id) => {
    const resp = await fetchToken(`ticket?id_ticket=${id}`)
    const body = await resp.json()
    const { ok, arrayResp } = body

    toggleLoading(false)

    console.log(body)

    if (ok) return arrayResp[0]
    console.log('fallo la solicitud (getTicketsDetails)', body)
  }

  const createTicket = async (data) => {
    const resp = await fetchTokenFile('ticket/insert-ticket', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    toggleLoading(false)

    if (ok) {
      getTicketList()
      return true
    }
    else {
      console.log('fallo la consulta (createTicket)', body)
      return false
    }
  }

  const updatePriority = async (data) => {

    const resp = await fetchToken('ticket/cambiar-prioridad-cliente', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    toggleLoading(false)

    if (ok) return true
    else {
      console.log('fallo la consulta (updatePriority)', body)
      return false
    }
  }

  const createEvent = async (data) => {

    const resp = await fetchToken('ticket/insert-evento', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    toggleLoading(false)

    if (ok) return true
    else {
      console.log('fallo la consulta (createTicket)', body)
      return false
    }
  }

  // docs CRUD
  const toggleDoc = async (data) => {
    const resp = await fetchToken('ticket/check-document', data, 'PUT')
    const body = await resp.json()
    const { ok } = body

    toggleLoading(false)

    if (ok) return true
    else {
      console.log('fallo la consulta (toggleDocs)', body)
      return false
    }
  }

  const deleteDoc = async (data) => {
    const resp = await fetchToken('ticket/delete-document', data, 'DELETE')
    const body = await resp.json()
    const { ok } = body

    toggleLoading(false)

    if (ok) return true
    else {
      console.log('fallo la consulta (deleteDoc)', body)
      return false
    }
  }

  const addDoc = async (data) => {

    const resp = await fetchTokenFile('ticket/add-document', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    toggleLoading(false)

    if (ok) return true
    else {
      console.log('fallo la consulta (addDoc)', body)
      return false
    }
  }

  const saveFilters = ({ rut_usuario = user.rut, emisores = [], proyectos = [], estados = [] }) => {
    setFilters({
      rut_usuario,
      emisores,
      proyectos,
      estados
    })
  }

  const value = {
    login,
    validateSession,
    logout,
    getProjects,
    getUsers,
    getStates,
    getTicketList,
    getTicketDetails,
    getQuestion,
    toggleDoc,
    deleteDoc,
    addDoc,
    updatePriority,
    createTicket,
    saveFilters,
    createEvent,
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

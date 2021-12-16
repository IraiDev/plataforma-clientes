import { useContext, useState, createContext } from 'react'
import { useLocation } from 'react-router-dom';
import { Alert } from '../helpers/alerts'
import { fetchToken, fetchTokenFile, fetchUnToken } from '../helpers/fetch'
import { Ui } from './Ui'

export const Ticket = createContext()

const msg = '-- “Estimado Usuario este pin no es reconocido por el sistema, deben ser solo letras y números, si lo ha olvidado dirigase a la opcion ¿Olvido su pin? para recuperarlo”--'

function TicketProvider({ children }) {

  const { pathname } = useLocation()
  const { toggleLoading } = useContext(Ui)
  const [user, setUser] = useState({ ok: false })
  const [ticketList, setTicketList] = useState([])
  const [ticketDetail, setTicketDetail] = useState({})
  const [filters, setFilters] = useState({})

  const login = async (data) => {

    if (data.pin === '') {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'El campo pin esta vacio, por favor introduce tu pin',
        showCancelButton: false,
        timer: 5000
      })
      toggleLoading(false)
      return
    }

    const resp = await fetchUnToken('auth-ticket/login', data, 'POST')
    const body = await resp.json()
    const { ok, resUser, token, tipo } = body

    toggleLoading(false)

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
        phone: b.usuario.phone,
        pin: b.usuario.pin,
        isAdmin: resUser.es_admin
      }

      setUser(data)
      return true
    }
    else {
      if (tipo === 1) {
        Alert({
          title: 'Atencion',
          icon: 'info',
          content: msg,
          showCancelButton: false,
          timer: 7000
        })
        return false
      }
      if (tipo === 2) {
        Alert({
          title: 'Atencion',
          icon: 'info',
          content: msg,
          showCancelButton: false,
          timer: 7000
        })
        return false
      }
      if (tipo === 3) {
        Alert({
          title: 'PIN recuperado',
          icon: 'info',
          content: msg,
          showCancelButton: false,
          timer: 7000
        })
        return false
      }
    }
  }

  const validateSession = async () => {
    const resp = await fetchToken('auth-ticket/renew-ticket')
    const body = await resp.json()
    const { ok, resUser, token } = body

    toggleLoading(false)

    if (ok) {
      const r = await fetchToken(`ticket/get-info-user?rut_usuario=${resUser.rut_user}`)
      const b = await r.json()

      window.localStorage.setItem('ticketToken', token)
      window.localStorage.setItem('lastPath-ticket', pathname)

      const data = {
        ok,
        rut: resUser.rut_user,
        name: resUser.nom_user,
        fullName: resUser.nombre,
        email: resUser.correo,
        phone: b.usuario.phone,
        pin: b.usuario.pin,
        isAdmin: resUser.es_admin
      }
      setUser(data)
      return true
    }
    else {
      return false
    }
  }

  const logout = () => {
    setUser({ ok: false })
    setTicketList([])
    setTicketDetail({})
    setFilters({})
    localStorage.removeItem('ticketToken')
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
    if (params.emisores.length < 1 || params.estados.length < 1 || params.proyectos.length < 1) setTicketList([])
    if (params.emisores.length < 1) return
    if (params.estados.length < 1) return
    if (params.proyectos.length < 1) return

    const resp = await fetchToken('ticket/get-tickets', params, 'POST')
    const body = await resp.json()
    const { ok, resp: res } = body

    toggleLoading(false)

    if (ok) setTicketList(res)
    else { console.log('fallo la peticion (getTicketList): ', body) }
  }

  const getTicketDetails = async (id) => {
    const resp = await fetchToken(`ticket?id_ticket=${id}`)
    const body = await resp.json()
    const { ok, arrayResp } = body

    toggleLoading(false)

    if (ok) {
      setTicketDetail(arrayResp[0])
      return true
    }
    else {
      console.log('fallo la peticion (getTicketDetails): ', body)
      return false
    }
  }

  const createTicket = async (data) => {
    const resp = await fetchTokenFile('ticket/insert-ticket', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    if (ok) {
      getTicketList()
      return true
    }
    else {
      console.log('fallo la consulta (createTicket)', body)
      toggleLoading(false)
      return false
    }
  }

  const updatePriority = async ({ data, id }) => {

    const resp = await fetchToken('ticket/cambiar-prioridad-cliente', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    if (ok) {
      getTicketDetails(id)
      return true
    }
    else {
      console.log('fallo la consulta (updatePriority)', body)
      toggleLoading(false)
      return false
    }
  }

  const createEvent = async ({ data, id }) => {

    const resp = await fetchToken('ticket/insert-evento', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    if (ok) {
      getTicketDetails(id)
      return true
    }
    else {
      console.log('fallo la consulta (createTicket)', body)
      toggleLoading(false)
      return false
    }
  }

  // docs CRUD
  const toggleDoc = async ({ data, id }) => {
    const resp = await fetchToken('ticket/check-document', data, 'PUT')
    const body = await resp.json()
    const { ok } = body

    if (ok) {
      getTicketDetails(id)
      return true
    }
    else {
      console.log('fallo la consulta (toggleDocs)', body)
      toggleLoading(false)
      return false
    }
  }

  const deleteDoc = async ({ data, id }) => {
    const resp = await fetchToken('ticket/delete-document', data, 'DELETE')
    const body = await resp.json()
    const { ok } = body

    if (ok) {
      getTicketDetails(id)
      return true
    }
    else {
      console.log('fallo la consulta (deleteDoc)', body)
      toggleLoading(false)
      return false
    }
  }

  const addDoc = async ({ data, id }) => {
    const resp = await fetchTokenFile('ticket/add-document', data, 'POST')
    const body = await resp.json()
    const { ok } = body

    if (ok) {
      getTicketDetails(id)
      return true
    }
    else {
      console.log('fallo la consulta (addDoc)', body)
      toggleLoading(false)
      return false
    }
  }
  // docs CRUD

  const getUserPin = async (rut, state = false) => {
    const resp = await fetchUnToken(`/auth-ticket/get-pass?rut_user=${rut}&olvido=${state}`)
    const body = await resp.json()
    const { ok, resUser } = body

    toggleLoading(false)

    if (ok) return { ok, response: resUser }
    else {
      console.log('fallo la consulta (getPin)', body)
      return { ok, response: null }
    }
  }

  const updateUser = async (data) => {
    const resp = await fetchUnToken('auth-ticket/change-data-user', data, 'POST')
    const body = await resp.json()
    const { ok, msg } = body

    toggleLoading(false)

    if (ok) {
      validateSession()
      return { ok, msg }
    }
    else {
      console.log('fallo la consulta (updateUser)', body)
      return { ok }
    }
  }

  const insertMantainerUser = async (data) => {
    const resp = await fetchToken('auth-ticket/insert-user', data, 'POST')
    const body = await resp.json()

    toggleLoading(false)

    if (body.ok) return body
    else return body

  }

  const updataMantainerUser = async (data) => {
    const resp = await fetchToken('auth-ticket/update-user', data, 'POST')
    const body = await resp.json()

    toggleLoading(false)

    if (body.ok) return body
    else return body

  }

  const getMantainerUser = async (rut) => {
    const resp = await fetchToken('auth-ticket/get-info-to-change-user', { rut_user: rut }, 'POST')
    const body = await resp.json()

    toggleLoading(false)

    if (body.ok) return body
    else return body
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
    getMantainerUser,
    getStates,
    getTicketList,
    getTicketDetails,
    getQuestion,
    getUserPin,
    toggleDoc,
    deleteDoc,
    addDoc,
    updateUser,
    updatePriority,
    createTicket,
    saveFilters,
    createEvent,
    user,
    ticketList,
    ticketDetail,
    filters,
    updataMantainerUser,
    insertMantainerUser
  }

  return (
    <Ticket.Provider value={value}>
      {children}
    </Ticket.Provider>
  )
}

export default TicketProvider

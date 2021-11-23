import React, { useContext, useEffect, useState } from 'react'
import Button from '../button/Button'
import Modal from '../modal/Modal'
import TextContent from '../textContent/TextContent'
import Select from 'react-select'
import Input from '../input/Input'
import TextArea from '../input/TextArea'
import Container from '../container/Container'
import { Ticket } from '../../../context/Ticket'
import { useForm } from '../../../hooks/useForm'
import LiNotes from '../List/LiNotes'
import Alert from '../alert/Alert'
import { Ui } from '../../../context/Ui'
import { checkForms } from '../../../helpers/helpers'
const notAllow = ['exe', 'js']

function NavBar({ onMultiLine, isMultiLine }) {

  let randomString = Math.random().toString(36)
  const { createTicket, getQuestion, saveFilters, getTicketList, getProjects, getUsers, getStates, logout, user } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [values, setValues] = useState({ email: '', phone: '' })
  const [modalTicket, setModalTicket] = useState(false)
  const [modalFilter, setModalFilter] = useState(false)
  const [alert, setAlert] = useState(false)
  const [{ iconAlert, titleAlert, contentAlert, isHtml }, setAlertContent] = useState({ iconAlert: '', titleAlert: {}, contentAlert: '', isHtml: false })
  const [option, setOption] = useState(null)
  const [file, setFile] = useState(null)
  const [resetFile, setResetFile] = useState(randomString)
  const [questions, setQuestions] = useState([])

  // checkboxes
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [states, setStates] = useState([])
  const [projectsAll, setProjectsAll] = useState(false)
  const [usersAll, setUsersAll] = useState(false)
  const [statesAll, setStatesAll] = useState(false)
  const [oldState, setOldState] = useState({ pr: [], us: [], st: [] })
  // checkboxes

  // custom hooks
  const [{ title, desc }, onChangeValues, reset] = useForm({ title: '', desc: '' })
  // custom hooks

  // object destructuring
  const { email, phone } = values

  const getFilters = async () => {
    const data = { rut_usuario: user.rut, proyectos: [] }
    const pr = await getProjects()
    const us = await getUsers(data)
    const st = await getStates(data)
    setProjects(pr.map(pr => ({
      value: pr.id_proyecto,
      label: pr.desc_proyecto,
      select: false
    })))
    setUsers(us.map(us => ({
      value: us.rut,
      label: us.nombre,
      select: false
    })))
    setStates(st.map(st => ({
      value: st.id,
      label: st.est,
      select: false
    })))
  }

  const getIds = (arr) => {
    const complete = arr
    let id = arr.filter(item => item.select === true)
    id = id.map(item => item.value)
    return { complete, id }
  }

  const onChangeFile = (e) => {
    if (e.target.files[0].size < 5242881) {
      setFile(e.target.files[0])
    }
    else {
      setFile(null)
      setResetFile(randomString)
      setAlertContent({
        iconAlert: 'warning',
        titleAlert: 'Atencion',
        contentAlert: 'Archivo excede el peso permitido por el sistema, peso maximo 5MB'
      })
      return setAlert(true)
    }
  }

  const onClose = () => {
    setModalTicket(false)
    setOption(null)
    setFile(null)
    setResetFile(randomString)
    reset()
    setValues({
      email: user.email,
      phone: user.phone
    })
  }

  const handleCreateTicket = async () => {
    const vTitle = checkForms(title)
    const vEmail = checkForms(email)
    const vPhone = checkForms(phone)
    const vDesc = checkForms(desc)

    toggleLoading(true)

    if (vTitle.state) {
      setAlertContent({
        isHtml: true,
        iconAlert: 'warning',
        contentAlert: vTitle,
        titleAlert: 'Atencion'
      })
      return setAlert(true)
    }
    if (vEmail.state) {
      setAlertContent({
        isHtml: true,
        iconAlert: 'warning',
        contentAlert: vEmail,
        titleAlert: 'Atencion'
      })
      return setAlert(true)
    }
    if (vPhone.state) {
      setAlertContent({
        isHtml: true,
        iconAlert: 'warning',
        contentAlert: vPhone,
        titleAlert: 'Atencion'
      })
      return setAlert(true)
    }
    if (vDesc.state) {
      setAlertContent({
        isHtml: true,
        iconAlert: 'warning',
        contentAlert: vDesc,
        titleAlert: 'Atencion'
      })
      return setAlert(true)
    }

    if (title === '' || desc === '' || email === '' || phone === '' || option === null) {
      setAlertContent({
        iconAlert: 'warning',
        titleAlert: 'Atencion',
        contentAlert: 'Debes seleccionar proyecto y llenar todos los campos'
      })
      return setAlert(true)
    }

    if (file !== null) {
      const name = file.name.split('.')
      const ext = name[name.length - 1]

      if (notAllow.includes(ext)) {
        setAlertContent({
          isHtml: false,
          iconAlert: 'error',
          titleAlert: 'Advertencia',
          contentAlert: 'No se puede subir archivos con extensiones, .exe, .js, estos seran removidos de la seleccion.'
        })
        setFile(null)
        return setAlert(true)
      }
    }

    let formData = new FormData()
    file !== null && formData.append('archivo', file)
    formData.append('rut_usuario', user.rut)
    formData.append('titulo', title)
    formData.append('correo', email)
    formData.append('telefono', phone)
    formData.append('mensaje', desc)
    formData.append('proyecto', option.value)

    const resp = await createTicket(formData)

    if (resp) return onClose()

    setAlertContent({
      html: false,
      iconAlert: 'warning',
      titleAlert: 'Atencion',
      contentAlert: 'Error al crear ticket, vuelva a intentarlo.'
    })

    setAlert(true)
  }

  const handleFilter = () => {
    toggleLoading(true)
    const pr = getIds(projects)
    const us = getIds(users)
    const st = getIds(states)

    setOldState({
      pr: pr.complete,
      us: us.complete,
      st: st.complete,
    })

    const data = {
      rut_usuario: user.rut, proyectos: pr.id, emisores: us.id, estados: st.id
    }

    saveFilters(data)
    getTicketList(data)
    setModalFilter(false)
  }

  const handleCancel = () => {
    setProjects(oldState.pr)
    setUsers(oldState.us)
    setStates(oldState.st)
    setProjectsAll(oldState.pr.every(item => item.select === true))
    setUsersAll(oldState.us.every(item => item.select === true))
    setStatesAll(oldState.st.every(item => item.select === true))
    setModalFilter(false)
  }

  useEffect(() => {
    setValues({
      email: user.email,
      phone: user.phone
    })
    getFilters()
  }, [])

  useEffect(() => {
    if (option !== null) {
      toggleLoading(true)
      const resp = async () => {
        const q = await getQuestion(option.value)
        setQuestions(q)
      }
      resp()
    }
  }, [option])

  return (
    <>
      <nav className="sticky top-0 h-20 z-40 bg-white shadow-lg flex justify-between items-center pl-3 pr-5 lg:px-14">
        <Button className="hover:bg-gray-200 rounded-lg inline lg:hidden"
          type="icon" />
        <h5 className="capitalize font-semibold inline lg:hidden">{user.fullName}</h5>
        <div className="hidden lg:flex items-center gap-3">
          <h5 className="capitalize font-semibold">{user.fullName}</h5>
          <Button
            tooltip="mostrar todo el contenido de descripcion de ticket"
            className="border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full"
            type="iconText"
            icon={isMultiLine ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up'}
            shadow
            name="multilinea"
            onClick={onMultiLine} />
          <Button
            className="border border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-full"
            type="iconText"
            icon="fas fa-filter"
            shadow
            name="filtros"
            onClick={() => setModalFilter(true)} />
          <Button
            className="bg-green-500 hover:bg-green-400 text-white rounded-full"
            shadow
            name="nuevo ticket"
            onClick={() => setModalTicket(true)} />
        </div>
        <div className="hidden lg:flex items-center">
          <div className="mr-2">
            <TextContent className="text-xs" tag="proyectos" value="???" />
            <TextContent className="text-xs" tag="emisores" value="???" />
            <TextContent className="text-xs" tag="estados" value="???" />
          </div>
          <Button
            tooltip="Cerrar sesion"
            className="text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg"
            type="icon"
            icon="fas fa-sign-out-alt"
            onClick={logout} />
        </div>
      </nav>

      {/* Modal nuevo ticket */}

      <Modal showModal={modalTicket} isBlur={false} onClose={onClose}
        className="max-w-4xl p-8">
        <h1 className="text-xl font-semibold capitalize inline">nuevo Ticket</h1>
        <p className="inline ml-2">a nombre de {user.name}</p>
        <div className="mt-5 grid gap-2 mb-2">
          <Select
            className="z-50"
            placeholder="Seleccione proyecto"
            options={projects}
            value={option}
            onChange={(option) => {
              setOption(option)
            }} />

          {option !== null && questions.length > 0 &&
            <ul className="bg-gray-100 rounded-md p-2">
              <p className="text-xs mb-2">Preguntas frecuentes:</p>
              {
                questions.map(li => (
                  <LiNotes key={li.id} id={li.id} resp={li.resp}>{li.preg}</LiNotes>
                ))
              }
            </ul>
          }

          <Input field="Titulo" name="title" value={title} onChange={onChangeValues} />
          <Input
            field="Correo"
            name="email"
            value={email}
            onChange={(e) => setValues({
              ...values,
              email: e.target.value
            })} />
          <Input
            field="telefono"
            name="phone"
            value={phone}
            onChange={(e) => setValues({
              ...values,
              phone: e.target.value
            })} />
          <TextArea field="descripcion" name="desc" value={desc} onChange={onChangeValues} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-sm bg-gray-100 rounded-lg p-2 w-full max-h-40 overflow-y-auto">
              <p className="capitalize">archivo seleccionado (max 5MB):</p>
              <p className="font-semibold">{file !== null ? file.name : 'No hay archivo seleccionado'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className="capitalize cursor-pointer text-center bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-2 px-4 font-semibold shadow-md"
                htmlFor="inputFile">
                <input key={resetFile || ''} className="hidden" type="file" id="inputFile" onChange={onChangeFile} />
                Subir archivo
              </label>
              <Button
                className="bg-green-500 hover:bg-green-400 text-white rounded-full"
                shadow
                name="crear ticket"
                onClick={() => handleCreateTicket()} />
              <span className="hidden md:block text-transparent">fake boton</span>
              <Button
                className="border border-red-500 hover:bg-red-400 text-red-400 hover:text-white rounded-full"
                shadow
                name="cancelar"
                onClick={() => onClose()} />
            </div>
          </div>
        </div>
      </Modal>

      {/* modal filtros */}

      <Modal showModal={modalFilter} isBlur={false} onClose={() => setModalFilter(false)}
        className="max-w-7xl p-8">
        <h1 className="text-xl font-semibold capitalize inline">seleccion de filtros</h1>
        <div className="text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Container className="w-full" tag="Seleccione Proyectos">
            <ul className="h-full overflow-y-auto uppercase">
              <li>
                <input
                  className="mr-2 cursor-pointer"
                  type="checkbox"
                  checked={projectsAll}
                  onChange={
                    (e) => {
                      const check = e.target.checked
                      setProjectsAll(check)
                      setProjects(projects.map(el => {
                        el.select = check
                        return el
                      }))
                    }
                  } />
                Todos
              </li>
              {
                projects.map((item) => (
                  <li key={item.value}>
                    <input
                      key={item.value}
                      id={item.value}
                      className="mr-2 cursor-pointer"
                      type="checkbox"
                      checked={item.select}
                      onChange={(e) => {
                        const check = e.target.checked
                        setProjects(projects.map(el => {
                          if (item.value === el.value) {
                            el.select = check
                          }
                          return el
                        }))
                        setProjectsAll(projects.every(el => el.select === true))
                      }}
                    />
                    {item.label}
                  </li>
                ))
              }
            </ul>
          </Container>
          <Container className="w-full" tag="Seleccione Emisores">
            <ul className="h-full overflow-y-auto uppercase">
              <li>
                <input
                  className="mr-2 cursor-pointer"
                  type="checkbox"
                  checked={usersAll}
                  onChange={
                    (e) => {
                      const check = e.target.checked
                      setUsersAll(check)
                      setUsers(users.map(el => {
                        el.select = check
                        return el
                      }))
                    }
                  } />
                Todos
              </li>
              {
                users.map((item) => (
                  <li key={item.value}>
                    <input
                      key={item.value}
                      id={item.value}
                      className="mr-2 cursor-pointer"
                      type="checkbox"
                      checked={item.select}
                      onChange={(e) => {
                        const check = e.target.checked
                        setUsers(users.map(el => {
                          if (item.value === el.value) {
                            el.select = check
                          }
                          return el
                        }))
                        setUsersAll(users.every(el => el.select === true))
                      }}
                    />
                    {item.label}
                  </li>
                ))
              }
            </ul>
          </Container>
          <Container className="w-full" tag="Seleccione Estados">
            <ul className="h-full overflow-y-auto uppercase">
              <li>
                <input
                  className="mr-2 cursor-pointer"
                  type="checkbox"
                  checked={statesAll}
                  onChange={
                    (e) => {
                      const check = e.target.checked
                      setStatesAll(check)
                      setStates(states.map(el => {
                        el.select = check
                        return el
                      }))
                    }
                  } />
                Todos
              </li>
              {
                states.map((item) => (
                  <li key={item.value}>
                    <input
                      key={item.value}
                      id={item.value}
                      className="mr-2 cursor-pointer"
                      type="checkbox"
                      checked={item.select}
                      onChange={(e) => {
                        const check = e.target.checked
                        setStates(states.map(el => {
                          if (item.value === el.value) {
                            el.select = check
                          }
                          return el
                        }))
                        setStatesAll(states.every(el => el.select === true))
                      }}
                    />
                    {item.label}
                  </li>
                ))
              }
            </ul>
          </Container>
        </div>
        <div className="flex justify-center gap-4 mt-10">
          <Button
            className="border border-red-400 hover:bg-red-400 text-red-400 hover:text-white rounded-full w-full md:w-2/5 lg:w-1/5"
            name="cancelar"
            onClick={() => handleCancel()} />
          <Button
            className="bg-green-500 hover:bg-green-400 text-white rounded-full w-full md:w-2/5 lg:w-1/5"
            name="aplicar"
            onClick={() => handleFilter()} />
        </div>
      </Modal>

      <Alert
        html={isHtml}
        show={alert}
        showCancelButton={false}
        icon={iconAlert}
        title={titleAlert}
        content={!isHtml && contentAlert}
        onAction={() => setAlert(false)}>
        {isHtml &&
          <p className="text-gray-700">
            Caracter <b className="font-semibold text-black text-xl">{contentAlert.char} No Permitido</b>,
            por favor revise el texto ingresado.
            <br />
            <br />
            <b className="font-semibold capitalize">Caracteres no permitidos:</b>
            <br />
            {contentAlert.list}
          </p>
        }
      </Alert>
    </>
  )
}

export default NavBar

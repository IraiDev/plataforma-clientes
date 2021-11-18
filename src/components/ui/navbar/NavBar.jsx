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

const arr = [
  { id: 'li1', preg: '¿Cuales son las restricción de correo de visitas?', resp: 'Repuesta correo visitas' },
  { id: 'li2', preg: '¿Cuales son las restricción de correo de anexo fecha?', resp: 'Repuesta correo anexos' },
  { id: 'li3', preg: '¿Por que en informe general anexo de CANOLA no tiene informacion NDVI?', resp: 'Repuesta informe general' },
  { id: 'li4', preg: '¿Por que no puedo consultar indicador NDVI en informe general?', resp: 'Repuesta indicadores NDVI' },
]

function NavBar({ onMultiLine, isMultiLine }) {

  let randomString = Math.random().toString(36)
  const { getProjects, getUsers, getStates, logout, user } = useContext(Ticket)
  const [{ title, desc }, onChangeValues, reset] = useForm({ title: '', desc: '' })
  const [values, setValues] = useState({ email: '', phone: '' })
  const [modalTicket, setModalTicket] = useState(false)
  const [modalFilter, setModalFilter] = useState(false)
  const [alert, setAlert] = useState(false)
  const [{ iconAlert, titleAlert, contentAlert }, setAlertContent] = useState({ iconAlert: '', titleAlert: '', contentAlert: '' })
  const [option, setOption] = useState(null)
  const [file, setFile] = useState(null)
  const [resetFile, setResetFile] = useState(randomString)

  // checkboxes
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [states, setStates] = useState([])
  const [projectsAll, setProjectsAll] = useState(false)
  const [usersAll, setUsersAll] = useState(false)
  const [statesAll, setStatesAll] = useState(false)
  // checkboxes

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

  const createTicket = () => {
    if (title === '' || desc === '' || email === '' || phone === '' || option === null) {
      setAlertContent({
        iconAlert: 'warning',
        titleAlert: 'Atencion',
        contentAlert: 'Debes seleccionar proyecto y llenar todos los campos'
      })
      return setAlert(true)
    }
    console.log(values, option, title, desc);
    onClose()
  }

  const handleFilter = () => {
    const pr = projects.filter(item => item.select === true)

    console.log(pr);
  }

  useEffect(() => {
    setValues({
      email: user.email,
      phone: user.phone
    })
    getFilters()
  }, [])

  return (
    <>
      <nav className="sticky top-0 h-20 bg-white shadow-lg flex justify-between items-center pl-3 pr-5 lg:px-14">
        <Button className="hover:bg-gray-200 rounded-lg inline lg:hidden"
          type="icon" />
        <h5 className="capitalize font-semibold inline lg:hidden">{user.fullName}</h5>
        <div className="hidden lg:flex items-center gap-3">
          <h5 className="capitalize font-semibold">{user.fullName}</h5>
          <Button
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
          <Button className="text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg"
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

          {option !== null &&
            <ul className="bg-gray-100 rounded-md p-2">
              <p className="text-xs mb-2">Preguntas frecuentes:</p>
              {
                arr.map(li => (
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
                onClick={createTicket} />
              <span className="hidden md:block text-transparent">fake boton</span>
              <Button
                className="border border-red-500 hover:bg-red-400 text-red-400 hover:text-white rounded-full"
                shadow
                name="cancelar"
                onClick={onClose} />
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
            <ul className="h-full overflow-y-auto">
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
                          setProjectsAll(projects.every(el => el.select === true))
                          return el
                        }))
                      }}
                    />
                    {item.label}
                  </li>
                ))
              }
            </ul>
          </Container>
          <Container className="w-full" tag="Seleccione Emisores">
            <ul className="h-full overflow-y-auto">
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
                          setUsersAll(users.every(el => el.select === true))
                          return el
                        }))
                      }}
                    />
                    {item.label}
                  </li>
                ))
              }
            </ul>
          </Container>
          <Container className="w-full" tag="Seleccione Estados">
            <ul className="h-full overflow-y-auto">
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
                          setStatesAll(states.every(el => el.select === true))
                          return el
                        }))
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
            name="cancelar" />
          <Button
            className="bg-green-500 hover:bg-green-400 text-white rounded-full w-full md:w-2/5 lg:w-1/5"
            name="aplicar"
            onClick={handleFilter} />
        </div>
      </Modal>

      <Alert
        show={alert}
        showCancelButton={false}
        icon={iconAlert}
        title={titleAlert}
        content={contentAlert}
        onAction={() => setAlert(false)} />
    </>
  )
}

export default NavBar

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Ui } from '../../../context/Ui'
import { checkForms } from '../../../helpers/helpers'
import { Alert } from '../../../helpers/alerts'
import NavMenu from '../navmenu/NavMenu'
const notAllow = ['exe', 'js']

function NavBar({
  onMultiLine,
  isMultiLine,
  hiddenOption = false,
  showModalTicket = false,
  showGoTo = false,
  isMantainerRoute = false,
}) {

  let randomString = Math.random().toString(36)
  const navigate = useNavigate()
  const { updateUser, createTicket, getQuestion, saveFilters, getTicketList, getProjects, getUsers, getStates, logout, user } = useContext(Ticket)
  const { toggleLoading, toggleNavMenu } = useContext(Ui)
  const [values, setValues] = useState({ email: '', phone: '', pin: '' })
  const [modalTicket, setModalTicket] = useState(showModalTicket)
  const [modalFilter, setModalFilter] = useState(false)
  const [modalUser, setModalUser] = useState(false)
  const [option, setOption] = useState(null)
  const [file, setFile] = useState(null)
  const [resetFile, setResetFile] = useState(randomString)
  const [questions, setQuestions] = useState([])
  const [filter, setFilter] = useState({ pr: ['???'], us: ['???'], st: ['???'] })
  const [tooltip, setTooltip] = useState({ pr: '', us: '', st: '' })

  // checkboxes
  const [check, setCheck] = useState(false)
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [states, setStates] = useState([])
  const [projectsAll, setProjectsAll] = useState(false)
  const [usersAll, setUsersAll] = useState(false)
  const [statesAll, setStatesAll] = useState(false)
  // checkboxes

  // custom hooks
  const [{ title, desc, newPin, repeatPin }, onChangeValues, reset] = useForm({ title: '', desc: '', newPin: '', repeatPin: '' })
  // custom hooks

  // object destructuring
  const { email, phone, pin } = values

  const getFilters = async () => {
    const data = { rut_usuario: user.rut, proyectos: [] }
    const pr = await getProjects()
    const us = await getUsers(data)
    const st = await getStates(data)

    const tempPr = pr.map(item => ({ value: item.id_proyecto, label: item.desc_proyecto, select: false }))
    const tempUs = us.map(item => ({ value: item.rut, label: item.nombre, select: false }))
    const tempSt = st.map(item => ({ value: item.id, label: item.est, select: false }))

    setProjects(tempPr)
    setUsers(tempUs)
    setStates(tempSt)
  }

  const getFilterSelection = (arr) => {
    let name = []
    let tooltip = ''
    const filter = arr.filter(item => item.select === true)

    if (filter.length !== 0) {
      if (filter.length === arr.length) name.push('todos')
      else {
        if (filter.length > 3) {
          name = filter.map((item, index) => {
            if (index < 2) return `${item.label}, `
            else if (index === 3) return `${item.label}...`
            else return ''
          })
        }
        else {
          name = filter.map((item, index) => {
            if (index < filter.length - 1) return `${item.label}, `
            else return item.label
          })
        }
      }
    } else name.push('???')

    filter.forEach((item, index) => {
      if (index < filter.length - 1) tooltip = `${tooltip} ${item.label}, `
      else tooltip = `${tooltip} ${item.label}`
    })

    const id = filter.map(item => item.value)

    return { complete: arr, id, name, tooltip }
  }

  const onChangeFile = (e) => {
    if (e.target.files[0].size < 1) {
      setFile(e.target.files[0])
    }
    else {
      setFile(null)
      setResetFile(randomString)
      Alert({
        title: 'Atencion',
        icon: 'warn',
        content: 'Archivo excede el peso permitido por el sistema, <b>peso maximo 5MB</b>',
        showCancelButton: false,
        timer: 7000
      })
      return
    }
  }

  const onCloseTicket = () => {
    setModalTicket(false)
    setOption(null)
    setFile(null)
    setResetFile(randomString)
    reset()
    setValues({
      email: user.email,
      phone: user.phone,
      pin: user.pin
    })
  }

  const handleCreateTicket = async () => {
    const { state: ts, char: tc, list: tl } = checkForms(title)
    const { state: cs, char: cc, list: cl } = checkForms(email)
    const { state: ps, char: pc, list: pl } = checkForms(phone)
    const { state: ds, char: dc, list: dl } = checkForms(desc)

    const AlertContent = (char, field, list) => {
      return `
      <p>Caracter <b class="text-2xl">${char}</b> no permitido, campo <b class="capitalize"/>${field}</b>.</p>
      <p class="mt-2">Caracteres no permitidos por el sistema: </p>
      <b>${list}</b>
      `
    }

    if (ts) {
      Alert({ title: 'Atencion', icon: 'warn', content: AlertContent(tc, 'titulo', tl), showCancelButton: false, timer: 7000 })
      return
    }
    if (cs) {
      Alert({ title: 'Atencion', icon: 'warn', content: AlertContent(cc, 'correo', cl), showCancelButton: false, timer: 7000 })
      return
    }
    if (ps) {
      Alert({ title: 'Atencion', icon: 'warn', content: AlertContent(pc, 'telefono', pl), showCancelButton: false, timer: 7000 })
      return
    }
    if (ds) {
      Alert({ title: 'Atencion', icon: 'warn', content: AlertContent(dc, 'descripcion', dl), showCancelButton: false, timer: 7000 })
      return
    }
    if (title === '' || desc === '' || email === '' || phone === '' || option === null) {
      Alert({ title: 'Atencion', icon: 'warn', content: 'Debes seleccionar proyecto y llenar todos los campos', showCancelButton: false, timer: 5000 })
      return
    }

    if (file !== null) {
      const name = file.name.split('.')
      const ext = name[name.length - 1]

      if (notAllow.includes(ext)) {
        Alert({
          title: 'Advertencia',
          icon: 'error',
          content: 'No se puede subir archivos con extensiones: .exe, .js, estos seran removidos de la seleccion.',
          showCancelButton: false,
          timer: 5000
        })
        setFile(null)
        return
      }
    }

    toggleLoading(true)

    let formData = new FormData()
    file !== null && formData.append('archivo', file)
    formData.append('rut_usuario', user.rut)
    formData.append('titulo', title)
    formData.append('correo', email)
    formData.append('telefono', phone)
    formData.append('mensaje', desc)
    formData.append('proyecto', option.value)

    const resp = await createTicket(formData)

    if (resp) return onCloseTicket()

    Alert({ title: 'Atencion', icon: 'error', content: 'Error al crear ticket, vuelva a intentarlo.', showCancelButton: false, timer: 5000 })
  }
  // FIXME: ver el porque no se se guarda el estado antiguo
  const handleFilter = () => {
    const pr = getFilterSelection(projects)
    const us = getFilterSelection(users)
    const st = getFilterSelection(states)

    if (pr.id.length > 0 && us.id.length > 0 && st.id.length > 0) toggleLoading(true)

    setFilter({
      pr: pr.name,
      us: us.name,
      st: st.name,
    })

    setTooltip({
      pr: pr.tooltip,
      us: us.tooltip,
      st: st.tooltip,
    })

    // const f = () => {
    //   const pp = projects.map(item => {
    //     if (pr.id.includes(item.value)) return { ...item, select: true }
    //     else return { ...item, select: false }
    //   })

    //   const uu = users.map(item => {
    //     if (us.id.includes(item.value)) return { ...item, select: true }
    //     else return { ...item, select: false }
    //   })

    //   const ss = states.map(item => {
    //     if (st.id.includes(item.value)) return { ...item, select: true }
    //     else return { ...item, select: false }
    //   })

    //   console.log('se ejecuta la funcionnnnnn');

    // }
    // f()
    // setOldState({ p: pr.complete, u: us.complete, s: st.complete })

    const data = {
      rut_usuario: user.rut, proyectos: pr.id, emisores: us.id, estados: st.id
    }

    saveFilters(data)
    getTicketList(data)
    setModalFilter(false)
  }
  // FIXME: ver porque no funciona el cancelar para volver al estado antiguo  
  const handleCancel = () => {
    // console.log(p);
    // setProjects(p)
    // setUsers(u)
    // setStates(s)
    // setProjectsAll(p.every(item => item.select === true))
    // setUsersAll(u.every(item => item.select === true))
    // setStatesAll(s.every(item => item.select === true))
    setModalFilter(false)
  }

  const handleUpdateUser = async () => {

    if (pin === '' || pin !== user.pin) {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'Su pin actual no coincide con el ingresado o el campo esta vacio, por favor verifiquelo y vuelva a intentarlo',
        showCancelButton: false,
        timer: 5000
      })
      return
    }
    if (newPin.length !== 8) {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'El pin debe tener 8 caracteres, solo numeros y letras',
        showCancelButton: false,
        timer: 5000
      })
      return
    }

    if (!/^[a-zA-Z0-9]*$/g.test(newPin)) {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'El pin debe tener solo letras y numeros',
        showCancelButton: false,
        timer: 5000
      })
      return
    }

    if (newPin !== repeatPin) {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'El pin nuevo no coincide con su reingreso, verifiquelo y vuelva a intentarlo',
        showCancelButton: false,
        timer: 5000
      })
      return
    }
    if (newPin === pin) {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'El nuevo pin no puede ser igual a su pin actual, por favor modifiquelo y vuelva a intentarlo',
        showCancelButton: false,
        timer: 5000
      })
      return
    }

    const data = {
      correo: email,
      telefono: phone,
      old_pass: user.pin,
      new_pass: newPin,
      repeat_pass: repeatPin,
      rut_user: user.rut
    }

    toggleLoading(true)

    const { ok } = await updateUser(data)

    if (ok) {
      Alert({
        title: 'Usuario actualizado',
        content: 'Usuario actualizado correctamente, se enviara un correo con los datos actualizados',
        showCancelButton: false,
        timer: 7000
      })
      setCheck(false)
      reset()
      setModalUser(false)
    }
    else {
      Alert({
        icon: 'warn',
        title: 'Atencion',
        content: 'Error al actualizar usuario, por favor verifique los datos y vuelva a intentarlo',
        showCancelButton: false,
        timer: 5000
      })
    }
  }

  const onCloseUser = () => {
    setModalUser(false)
    setCheck(false)
    reset()
  }

  const handleOpenUserModal = () => {
    setValues({
      email: user.email,
      phone: user.phone,
      pin: user.pin
    })
    setModalUser(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', {
      replace: true
    })
  }

  useEffect(() => {
    const loadUsersFilter = async () => {
      let p = projects.filter(item => item.select === true)
      p = p.map(item => item.value)

      if (p.length > 0) {
        setStates([])
        setUsers([])
        setStatesAll(false)
        setUsersAll(false)
        const data = { rut_usuario: user.rut, proyectos: p }
        const us = await getUsers(data)
        setUsers(us.map(item => ({
          value: item.rut,
          label: item.nombre,
          select: false
        })))

        const st = await getStates(data)
        setStates(st.map(item => ({
          value: item.id,
          label: item.est,
          select: false
        })))
      }
    }
    loadUsersFilter()
  }, [projects])

  useEffect(() => {
    getFilters()
  }, [])

  useEffect(() => {
    if (option !== null) {
      toggleLoading(true)
      const loadQuestions = async () => {
        const resp = await getQuestion(option.value)
        setQuestions(resp)
      }
      loadQuestions()
    }
  }, [option])

  return (
    <>
      <nav className="sticky top-0 h-20 z-40 bg-white shadow-lg grid pl-3 pr-5 lg:px-5">
        <section className="flex items-center justify-between lg:hidden">
          <Button
            className="hover:bg-gray-200 rounded-lg"
            type="icon"
            onClick={() => toggleNavMenu()} />
          {
            !isMantainerRoute &&
            <div className={`max-w-xs ${hiddenOption && 'hidden'}`} >
              <TextContent className="text-xs uppercase font-light" tag="proyectos" value={filter.pr} toolptipValue={tooltip.pr} />
              <TextContent className="text-xs uppercase font-light" tag="emisores" value={filter.us} toolptipValue={tooltip.us} />
              <TextContent className="text-xs uppercase font-light" tag="estados" value={filter.st} toolptipValue={tooltip.st} />
            </div>
          }
          <Button
            className={`rounded-full hover:bg-blue-100 text-blue-500 ${!showGoTo && 'hidden'}`}
            type="iconText"
            tooltip="Ir al sitio completo"
            icon="fas fa-arrow-left"
            iconFirst
            name="Ir al sitio completo"
            onClick={() => navigate('/')}
          />
          {
            isMantainerRoute &&
            <Button
              className={`rounded-full hover:bg-blue-100 text-blue-500`}
              type="iconText"
              tooltip="Ir al sitio completo"
              icon="fas fa-arrow-left"
              iconFirst
              name="Volver"
              onClick={() => navigate('/')}
            />
          }
        </section>
        <section className="hidden lg:flex lg:justify-between">
          <div className="flex items-center gap-3">
            <Button
              className="rounded-full hover:bg-gray-100"
              type="iconText"
              tooltip="Modificar usuario"
              icon="fas fa-user-cog"
              iconFirst
              name={user.name}
              onClick={handleOpenUserModal}
            />
            {
              !isMantainerRoute &&
              <>
                {user.isAdmin === 1 &&
                  <Button
                    className={`bg-black hover:bg-gray-600 text-white rounded-full ${hiddenOption && 'hidden'}`}
                    shadow
                    name="Mantenedor usuarios"
                    onClick={() => navigate('/mantenedor-usuarios')} />
                }
                <Button
                  tooltip="mostrar todo el contenido de descripcion de ticket"
                  className={`border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full ${hiddenOption && 'hidden'}`}
                  type="iconText"
                  icon={isMultiLine ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up'}
                  shadow
                  name="multilinea"
                  onClick={onMultiLine} />
                <Button
                  className={`border border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-full ${hiddenOption && 'hidden'}`}
                  type="iconText"
                  icon="fas fa-filter"
                  shadow
                  name="filtros"
                  onClick={() => setModalFilter(true)} />
                <Button
                  className={`bg-green-500 hover:bg-green-400 text-white rounded-full ${hiddenOption && 'hidden'}`}
                  shadow
                  name="nuevo ticket"
                  onClick={() => setModalTicket(true)} />
              </>
            }
          </div>
          <div className="flex items-center">
            {
              !isMantainerRoute &&
              <div className={`mr-2 max-w-xs ${hiddenOption && 'hidden'}`} >
                <TextContent className="text-xs uppercase font-light" tag="proyectos" value={filter.pr} toolptipValue={tooltip.pr} />
                <TextContent className="text-xs uppercase font-light" tag="emisores" value={filter.us} toolptipValue={tooltip.us} />
                <TextContent className="text-xs uppercase font-light" tag="estados" value={filter.st} toolptipValue={tooltip.st} />
              </div>
            }
            <Button
              className={`rounded-full hover:bg-blue-100 text-blue-500 ${!showGoTo && 'hidden'}`}
              type="iconText"
              tooltip="Ir al sitio completo"
              icon="fas fa-arrow-left"
              iconFirst
              name="Ir al sitio completo"
              onClick={() => navigate('/')}
            />
            {
              isMantainerRoute &&
              <Button
                className={`rounded-full hover:bg-blue-100 text-blue-500`}
                type="iconText"
                tooltip="Ir al sitio completo"
                icon="fas fa-arrow-left"
                iconFirst
                name="Volver"
                onClick={() => navigate('/')}
              />
            }
            <Button
              tooltip="Cerrar sesion"
              className="text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg"
              type="icon"
              icon="fas fa-sign-out-alt"
              onClick={handleLogout} />
          </div>
        </section>
      </nav>

      {/* navMenu */}
      <NavMenu>
        <Button
          className="rounded-full bg-gray-100 hover:bg-gray-200 "
          type="iconText"
          tooltip="Modificar usuario"
          icon="fas fa-user-cog"
          name={user.name}
          block
          onClick={() => {
            handleOpenUserModal()
            toggleNavMenu()
          }}
        />
        {
          !isMantainerRoute &&
          <>
            {user.isAdmin === 1 &&
              <Button
                className={`bg-black hover:bg-gray-600 text-white rounded-full ${hiddenOption && 'hidden'}`}
                shadow
                name="Mantenedor usuarios"
                onClick={() => navigate('/mantenedor-usuarios')} />
            }
            <Button
              tooltip="mostrar todo el contenido de descripcion de ticket"
              className={`border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full ${hiddenOption && 'hidden'}`}
              type="iconText"
              icon={isMultiLine ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up'}
              shadow
              block
              name="multilinea"
              onClick={() => {
                onMultiLine()
                toggleNavMenu()
              }} />
            <Button
              className={`border border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-full ${hiddenOption && 'hidden'}`}
              type="iconText"
              icon="fas fa-filter"
              shadow
              block
              name="filtros"
              onClick={() => {
                setModalFilter(true)
                toggleNavMenu()
              }} />
            <Button
              className={`bg-green-500 hover:bg-green-400 text-white rounded-full ${hiddenOption && 'hidden'}`}
              shadow
              block
              name="nuevo ticket"
              onClick={() => {
                setModalTicket(true)
                toggleNavMenu()
              }} />
          </>
        }
        <Button
          tooltip="Cerrar sesion"
          className="text-red-400 hover:text-red-600 bg-red-100  hover:bg-red-300 rounded-full"
          type="iconText"
          name="cerrar sesion"
          icon="fas fa-sign-out-alt"
          onClick={handleLogout} />
      </NavMenu>

      {/* Modal update User */}
      <Modal showModal={modalUser} isBlur={false} onClose={onCloseUser}
        className="max-w-lg p-8">
        <h5 className="text-xl mb-4">Modificar usuario</h5>
        <div className="grid gap-5">
          <Input
            disabled
            type="text"
            color="lightBlue"
            size="regular"
            outline={true}
            placeholder={user.fullName}
          />
          <Input
            disabled
            type="text"
            color="lightBlue"
            size="regular"
            outline={true}
            placeholder={user.rut}
          />
          <Input
            name="email"
            value={email}
            onChange={(e) => setValues({
              ...values,
              email: e.target.value
            })}
            placeholder="Correo"
          />
          <Input
            name="phone"
            value={phone}
            onChange={(e) => setValues({
              ...values,
              phone: e.target.value
            })}
            placeholder="Telefono"
          />
          <Input
            name="pin"
            value={pin}
            onChange={(e) => setValues({
              ...values,
              pin: e.target.value
            })}
            type={check ? 'text' : 'password'}
            placeholder="PIN Actual"
          />
          <Input
            name="newPin"
            value={newPin}
            onChange={onChangeValues}
            type={check ? 'text' : 'password'}
            placeholder="PIN nuevo"
          />
          <Input
            name="repeatPin"
            value={repeatPin}
            onChange={onChangeValues}
            type={check ? 'text' : 'password'}
            placeholder="Repita nuevo PIN"
          />
          <label htmlFor="motrarPIN123">
            <input
              className="mr-2"
              id="motrarPIN123"
              type="checkbox"
              checked={check}
              onChange={(e) => {
                setCheck(e.target.checked)
              }}
            />
            Mostrar campos
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Button
            className="rounded-full border border-red-400 hover:bg-red-400 text-red-500 hover:text-white order-last md:order-first"
            name="cancelar"
            shadow
            onClick={onCloseUser} />
          <Button
            className="rounded-full bg-blue-400 hover:bg-blue-500 text-white"
            name="modificar"
            shadow
            onClick={handleUpdateUser}
          />
        </div>
      </Modal>

      {/* Modal nuevo ticket */}
      <Modal showModal={modalTicket} isBlur={false} onClose={onCloseTicket}
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
            <div className="text-sm bg-gray-100 rounded-lg p-2 w-full max-h-40 overflow-custom">
              <p className="capitalize">archivo seleccionado (max 5MB):</p>
              <p className="font-semibold">{file !== null ? file.name : 'No hay archivo seleccionado'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className="capitalize cursor-pointer text-center bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-2 px-4 font-semibold shadow-md"
                htmlFor="inputFile">
                <input key={resetFile || ''} className="hidden" type="file" id="inputFile" onChange={onChangeFile} />
                Seleccionar archivo
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
                onClick={() => onCloseTicket()} />
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
            {projects.length > 0 ?
              <ul className="h-full overflow-custom uppercase">
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
              </ul> : <p className="animate-pulse">cargando <i className="fas fa-spinner animate-spin"></i></p>
            }
          </Container>
          <Container className="w-full" tag="Seleccione Emisores">
            {users.length > 0 ?
              <ul className="h-full overflow-custom uppercase">
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
              </ul> : <p className="animate-pulse">cargando <i className="fas fa-spinner animate-spin"></i></p>
            }
          </Container>
          <Container className="w-full" tag="Seleccione Estados">
            {states.length > 0 ?
              <ul className="h-full overflow-custom uppercase">
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
              </ul> : <p className="animate-pulse">cargando <i className="fas fa-spinner animate-spin"></i></p>
            }
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
    </>
  )
}

export default NavBar

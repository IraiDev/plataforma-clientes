import { useNavigate } from 'react-router-dom'
import NavBar from '../ui/navbar/NavBar'
import Select from 'react-select'
import Input from '../ui/input/Input'
import { useState } from 'react'
import { useContext } from 'react'
import { Ticket } from '../../context/Ticket'
import Container from '../ui/container/Container'
import { useEffect } from 'react'
import Button from '../ui/button/Button'
import HRLabel from '../ui/hr/HRLabel'
import { checkRut, prettifyRut } from 'react-rut-formatter'
import { Alert } from '../../helpers/alerts'
import { Ui } from '../../context/Ui'

const initValuesState = {
   rut: '',
   userName: '',
   fullName: '',
   email: '',
   phone: '',
   id_user: ''
}

const UserMaintainer = () => {
   const navigate = useNavigate()
   const { getProjects, getUsers, getStates, user, updataMantainerUser, insertMantainerUser, getUser } = useContext(Ticket)
   const { toggleLoading } = useContext(Ui)
   const [tempSons, setTempSons] = useState([])
   const [tempFather, setTempFather] = useState([])
   const [tempStates, setTempStates] = useState([])
   // checkbox
   const [projects, setProjects] = useState([])
   const [states, setStates] = useState([])
   const [sons, setSons] = useState([])
   const [father, setFather] = useState([])
   const [projectsAll, setProjectsAll] = useState(false)
   const [statesAll, setStatesAll] = useState(false)
   const [fatherAll, setFatherAll] = useState(false)
   const [sonsAll, setSonsAll] = useState(false)
   // checkbox

   // select
   const [options, setOptions] = useState([])
   const [select, setSelect] = useState({ value: null, label: 'Ninguno' })
   // select

   // custom hooks
   const [values, setValues] = useState(initValuesState)
   // custom hooks
   // destructuring
   const { rut, userName, fullName, email, phone, id_user } = values
   // destructuring

   const getFilters = async () => {
      const data = { rut_usuario: user.rut, proyectos: [] }
      const pr = await getProjects()
      const us = await getUsers(data)
      const st = await getStates(data)

      const tempPr = pr.map(item => ({ value: item.id_proyecto, label: item.desc_proyecto, select: false }))
      const tempUs = us.map(item => ({ value: item.rut, label: item.nombre, select: false }))
      const tempUs2 = us.map(item => ({ value: item.rut, label: item.nombre, select: false }))
      const tempSt = st.map(item => ({ value: item.id, label: item.est, select: false }))

      setProjects(tempPr)
      setFather(tempUs)
      setSons(tempUs2)
      setStates(tempSt)
      setOptions([{ value: null, label: 'Ninguno' }, ...tempUs])
      toggleLoading(false)
   }

   const handleCancel = () => {
      navigate('/')
   }

   const handleCreateOrUpdateUser = async ({ isUpdate = false }) => {
      let resp
      let pr = projects.filter(item => item.select)
      pr = pr.map(item => item.value)
      let st = states.filter(item => item.select)
      st = st.map(item => item.value)
      let fa = father.filter(item => item.select)
      fa = fa.map(item => item.value)
      let so = sons.filter(item => item.select)
      so = so.map(item => item.value)

      if (pr.length === 0 || st.length === 0 || fa.length === 0 || so.length === 0) {
         Alert({
            title: 'Atencion',
            content: 'Debe seleccionar al menos un proyecto, un estado, un padre y un hijo para crear/actualizar un usuario',
            showCancelButton: false,
            timer: 7000
         })
         return
      }

      if (!checkRut(rut)) {
         Alert({
            title: 'Atencion',
            content: 'El rut ingresado no es valido, vuelva a ingresarlo',
            showCancelButton: false,
            timer: 7000
         })
         return
      }

      if (rut === '' || email === '' || userName === '' || fullName === '' || phone === '') {
         Alert({
            title: 'Atencion',
            content: 'Debe completar todos los campos para crear/actualizar un usuario',
            showCancelButton: false,
            timer: 7000
         })
         return
      }

      toggleLoading(true)

      const data = {
         id_user,
         rut: prettifyRut(rut),
         email,
         nom_user: userName,
         name: fullName,
         phone,
         proyects: pr,
         father_users: fa,
         sons_users: so,
         permises: st
      }

      if (isUpdate) {
         resp = await updataMantainerUser(data)
      } else {
         resp = await insertMantainerUser(data)
      }

      if (resp.ok) {
         Alert({
            title: 'Atencion',
            content: resp.response,
            showCancelButton: false,
            timer: 7000
         })
         getFilters()
      }
      else {
         Alert({
            title: 'Atencion',
            content: resp.response,
            showCancelButton: false,
            timer: 7000
         })
      }
   }

   const handleSelectOnChange = async (option) => {

      toggleLoading(true)

      setSelect(option)

      if (option.value === null) {
         setValues(initValuesState)
         getFilters()
         return
      }

      const resp = await getUser(option.value)

      if (resp.ok) {
         const { id_user, rut_user, nom_user, nombre, correo, telefono } = resp.usuario
         const { arreglo_estados, arreglo_hijos, arreglo_padres, arreglo_proyectos } = resp

         setValues({
            id_user,
            rut: rut_user,
            userName: nom_user,
            fullName: nombre,
            email: correo,
            phone: telefono
         })

         setTempSons(arreglo_hijos)
         setTempFather(arreglo_padres)
         setTempStates(arreglo_estados)

         setProjects(projects.map(item => {
            const temp = arreglo_proyectos.filter(pr => pr.id_proy === item.value)
            return {
               ...item,
               select: temp.length > 0
            }
         }))
      }
      else {
         Alert({
            icon: 'error',
            title: 'Atencion',
            content: 'Error al obtener datos del usuario',
            showCancelButton: false,
            timer: 7000
         })
      }
   }

   useEffect(() => {
      const loadUsersFilter = async () => {

         let newSt = [], newFa = [], newSo = []
         let p = projects.filter(item => item.select)
         p = p.map(item => item.value)

         setProjectsAll(projects.every(item => item.select))
         setStatesAll(false)
         setFatherAll(false)
         setSonsAll(false)

         if (p.length > 0) {

            setStates([])
            setFather([])
            setSons([])

            const data = { rut_usuario: user.rut, proyectos: p }
            const us = await getUsers(data)
            const st = await getStates(data)
            console.log(st);

            await us.forEach(item => {
               const temp = tempSons.filter(t => t.rut_hijo === item.rut)
               newSo.push({ value: item.rut, label: item.nombre, select: temp.length > 0 })
            })
            setSons(newSo)

            await us.forEach(item => {
               const temp = tempFather.filter(t => t.rut_padre === item.rut)
               newFa.push({ value: item.rut, label: item.nombre, select: temp.length > 0 })
            })
            setFather(newFa)

            await st.forEach(item => {
               const temp = tempStates.filter(t => t.estado === item.id)
               newSt.push({ value: item.id, label: item.est, select: temp.length > 0 })
            })
            setStates(newSt)

            setStatesAll(newSt.every(item => item.select))
            setFatherAll(newFa.every(item => item.select))
            setSonsAll(newSo.every(item => item.select))

         }
      }
      loadUsersFilter()
   }, [projects])

   useEffect(() => {
      getFilters()
   }, [])

   return (
      <div className="h-screen w-full">
         <NavBar isMantainerRoute={true} />
         <div className='container mx-auto py-10 md:py-20'>
            <div className='bg-white w-full h-full rounded-md px-8 py-14 shadow-lg grid gap-6'>
               <header className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div>
                     <h1 className='font-semibold text-lg'>Mantenedor de usuarios</h1>
                     <label className='text-sm p-2 block bg-gray-100 rounded-md'>
                        Si desea actualizar un usuario primero seleccionelo en la lista de
                        usuarios <strong className='text-blue-400 uppercase'>Seleccione usuario</strong>.
                     </label>
                  </div>
                  <div className='w-full grid gap-3'>
                     <label className='capitalize text-gray-600'>Seleccione usuario:</label>
                     <Select
                        className='w-full uppercase'
                        placeholder="usuarios"
                        options={options}
                        value={select}
                        onChange={handleSelectOnChange} />
                  </div>
               </header>
               <HRLabel content='Datos usuario' />
               <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-6'>
                  <Input
                     field='rut'
                     name='rut'
                     placeholder='ej: 13.456.789-0...'
                     value={prettifyRut(rut)}
                     onChange={e => setValues({ ...values, rut: e.target.value })}
                  />
                  <Input
                     field='usuario'
                     name='userName'
                     placeholder='ej: juan...'
                     value={userName}
                     onChange={e => setValues({ ...values, userName: e.target.value })}
                  />
                  <Input
                     field='Nombre y apellido'
                     name='fullName'
                     value={fullName}
                     placeholder='ej: Juan Perez...'
                     onChange={e => setValues({ ...values, fullName: e.target.value })}
                  />
                  <Input
                     field='correo'
                     type='email'
                     name='email'
                     placeholder='ej: ejemplo@gmail.com...'
                     value={email}
                     onChange={e => setValues({ ...values, email: e.target.value })}
                  />
                  <Input
                     field='telefono'
                     name='phone'
                     placeholder='ej: +56912345678...'
                     value={phone}
                     onChange={e => setValues({ ...values, phone: e.target.value })}
                  />
               </section>
               <HRLabel content='Privilegios' />
               <section className="text-sm grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 mt-6 mx-20">
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
                  <Container className="w-full" tag="Seleccione padres">
                     {father.length > 0 ?
                        <ul className="h-full overflow-custom uppercase">
                           <li>
                              <input
                                 className="mr-2 cursor-pointer"
                                 type="checkbox"
                                 checked={fatherAll}
                                 onChange={
                                    (e) => {
                                       const check = e.target.checked
                                       setFatherAll(check)
                                       setFather(father.map(el => {
                                          el.select = check
                                          return el
                                       }))
                                    }
                                 } />
                              Todos
                           </li>
                           {

                              father.map((item) => (
                                 <li key={`${item.value}F`}>
                                    <input
                                       id={item.value}
                                       className="mr-2 cursor-pointer"
                                       type="checkbox"
                                       checked={item.select}
                                       onChange={(e) => {
                                          const check = e.target.checked
                                          setFather(father.map(el => {
                                             if (item.value === el.value) {
                                                el.select = check
                                             }
                                             return el
                                          }))
                                          setFatherAll(father.every(el => el.select === true))
                                       }}
                                    />
                                    {item.label}
                                 </li>
                              ))
                           }
                        </ul> : <p className="animate-pulse">cargando <i className="fas fa-spinner animate-spin"></i></p>
                     }
                  </Container>
                  <Container className="w-full" tag="Seleccione hijos">
                     {sons.length > 0 ?
                        <ul className="h-full overflow-custom uppercase">
                           <li>
                              <input
                                 className="mr-2 cursor-pointer"
                                 type="checkbox"
                                 checked={sonsAll}
                                 onChange={
                                    (e) => {
                                       const check = e.target.checked
                                       setSonsAll(check)
                                       setSons(sons.map(el => {
                                          el.select = check
                                          return el
                                       }))
                                    }
                                 } />
                              Todos
                           </li>
                           {

                              sons.map((item) => (
                                 <li key={item.value}>
                                    <input
                                       id={item.value}
                                       className="mr-2 cursor-pointer"
                                       type="checkbox"
                                       checked={item.select}
                                       onChange={(e) => {
                                          const check = e.target.checked
                                          setSons(sons.map(el => {
                                             if (item.value === el.value) {
                                                el.select = check
                                             }
                                             return el
                                          }))
                                          setSonsAll(sons.every(el => el.select === true))
                                       }}
                                    />
                                    {item.label}
                                 </li>
                              ))
                           }
                        </ul> : <p className="animate-pulse">cargando <i className="fas fa-spinner animate-spin"></i></p>
                     }
                  </Container>
               </section>
               <footer className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                  <Button
                     className="border border-red-400 hover:bg-red-400 text-red-400 hover:text-white rounded-full w-full md:w-1/2 order-last md:order-first"
                     name="cancelar"
                     onClick={() => handleCancel()}
                  />
                  <Button
                     className="bg-blue-400 hover:bg-blue-500 text-white rounded-full w-full md:w-1/2 place-self-end"
                     name={select.value !== null ? 'Actualizar usuario' : 'crear usuario'}
                     onClick={
                        select.value !== null ? () => handleCreateOrUpdateUser({ isUpdate: true })
                           : () => handleCreateOrUpdateUser({ isUpdate: false })
                     }
                  />
               </footer>
            </div>
         </div>
      </div>
   )
}

export default UserMaintainer

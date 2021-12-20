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

const initOptions = { value: null, label: 'Sin seleccion' }

const UserMaintainer = () => {
   const navigate = useNavigate()
   const { getProjects, getUsers, getStates, user, updataMantainerUser, insertMantainerUser, getMantainerUser } = useContext(Ticket)
   const { toggleLoading } = useContext(Ui)
   const [projects, setProjects] = useState([])
   const [tempSons, setTempSons] = useState([])
   const [tempFather, setTempFather] = useState([])
   const [tempStates, setTempStates] = useState([])
   // checkbox
   const [states, setStates] = useState([])
   const [sons, setSons] = useState([])
   const [father, setFather] = useState([])
   // checkbox

   // options select
   const [options, setOptions] = useState([])
   const [optionsProjects, setOptionsProjects] = useState([])
   const [optionAddProject, setOptionAddProject] = useState([])
   // optons select
   // select
   const [select, setSelect] = useState(initOptions)
   const [selectProject, setSelectProject] = useState(initOptions)
   const [selectAddProject, setSelectAddProject] = useState(initOptions)
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
      setOptionAddProject(tempPr)
      setOptions([{ value: null, label: 'Ninguno' }, ...tempUs])
      toggleLoading(false)
   }

   const handleCancel = () => {
      navigate('/')
   }

   const handleCreateOrUpdateUser = async ({ isUpdate = false }) => {
      let resp, proy = []
      let st = states.filter(item => item.select)
      st = st.map(item => item.value)
      let fa = father.filter(item => item.select)
      fa = fa.map(item => item.value)
      let so = sons.filter(item => item.select)
      so = so.map(item => item.value)

      if (rut === '' || email === '' || userName === '' || fullName === '' || phone === '') {
         Alert({
            title: 'Atencion',
            content: `
            <p>Debe completar todos los campos para crear/actualizar un usuario</p>
            <br />
            <strong class="text-sm text-gray-700">RUT, USUARIO, NOMBRE Y APELLIDO, CORREO, TELEFONO</USU></strong>
            `,
            showCancelButton: false
         })
         return
      }

      if (!checkRut(rut)) {
         Alert({
            title: 'Atencion',
            content: 'El rut ingresado no es valido, vuelva a ingresarlo',
            showCancelButton: false
         })
         return
      }

      if (selectProject.value === null && selectAddProject.value === null) {
         Alert({
            title: 'Atencion',
            content: 'Debe seleccionar un proyecto para crear/actualizar un usuario',
            showCancelButton: false
         })
         return
      }

      if (st.length === 0 || fa.length === 0 || so.length === 0) {
         Alert({
            title: 'Atencion',
            content: 'Debe seleccionar al menos un estado, un padre y un hijo para crear/actualizar un usuario',
            showCancelButton: false
         })
         return
      }

      toggleLoading(true)

      if (selectProject.value !== null) proy = [selectProject.value]
      if (selectAddProject.value !== null) proy = [selectAddProject.value]

      if (isUpdate) {

         const data = {
            id_user,
            rut: prettifyRut(rut),
            email,
            nom_user: userName,
            name: fullName,
            phone,
            proyects: proy,
            father_users: fa,
            sons_users: so,
            permises: st
         }
         resp = await updataMantainerUser(data)
      } else {

         const data = {
            rut: prettifyRut(rut),
            email,
            nom_user: userName,
            name: fullName,
            phone,
            proyects: proy,
            father_users: fa,
            sons_users: so,
            permises: st
         }
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
            showCancelButton: false
         })
      }
      getFilters()
      setValues(initValuesState)
      setSelect(initOptions)
      setSelectAddProject(initOptions)
      setSelectProject(initOptions)
      setOptionAddProject(projects)
      setOptionsProjects(projects)
   }

   const handleSelectOnChange = async (option) => {

      toggleLoading(true)

      setSelect(option)

      if (option.value === null) {
         setProjects(projects)
         setValues(initValuesState)
         setOptionAddProject(projects)
         setOptionsProjects(projects)
         getFilters()
         return
      }

      const resp = await getMantainerUser(option.value)

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
         setOptionsProjects([])
         setOptionAddProject([])

         setOptionsProjects(projects.filter(item => arreglo_proyectos.find(p => p.id_proy === item.value)))

         setOptionAddProject(projects.filter(item => !arreglo_proyectos.find(p => p.id_proy === item.value)))

      }
      else {
         Alert({
            icon: 'error',
            title: 'Atencion',
            content: 'Error al obtener datos del usuario',
            showCancelButton: false
         })
      }
   }

   const handleOnChangeUserProject = (option) => {
      setSelectProject(option)
      setSelectAddProject(initOptions)
   }

   const handleOnChangeNewProject = (option) => {
      setSelectAddProject(option)
      setSelectProject(initOptions)
   }

   useEffect(() => {
      const loadUsersFilter = async () => {

         let newSt = [], newFa = [], newSo = [], p

         if (selectProject.value !== null) p = selectProject.value
         if (selectAddProject.value !== null) p = selectAddProject.value

         if (selectProject.value !== null || selectAddProject.value !== null) {

            setStates([])
            setFather([])
            setSons([])

            const data = { rut_usuario: user.rut, proyectos: [p] }
            const us = await getUsers(data)
            const st = await getStates(data)

            await us.forEach(item => {
               const temp = tempSons.filter(t => t.rut_hijo === item.rut && t.id_proy === p)
               newSo.push({ value: item.rut, label: item.nombre, select: temp.length > 0 })
            })
            setSons(newSo)

            await us.forEach(item => {
               const temp = tempFather.filter(t => t.rut_padre === item.rut && t.id_proy === p)
               newFa.push({ value: item.rut, label: item.nombre, select: temp.length > 0 })
            })
            setFather(newFa)

            await st.forEach(item => {
               const temp = tempStates.filter(t => t.estado === item.id)
               newSt.push({ value: item.id, label: item.est, select: temp.length > 0 })
            })
            setStates(newSt)

         }
      }
      loadUsersFilter()
   }, [selectProject, selectAddProject])

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
               <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='grid gap-4'>
                     <label className='capitalize text-gray-600'>Proyectos del usuario:</label>
                     <Select
                        isDisabled={select.value === null}
                        className='w-full lg:w-1/2 uppercase'
                        options={optionsProjects}
                        value={selectProject}
                        onChange={handleOnChangeUserProject}
                     />
                  </div>
                  <div className='grid gap-4'>
                     <label className='capitalize text-gray-600'>agregar proyecto:</label>
                     <Select
                        className='w-full lg:w-1/2 uppercase'
                        options={optionAddProject}
                        value={selectAddProject}
                        onChange={handleOnChangeNewProject}
                     />
                  </div>
               </section>
               <section className="text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 mt-6">
                  <Container className="w-full" tag="Seleccione padres">
                     {father.length > 0 ?
                        <ul className="h-full overflow-custom uppercase">
                           <li>
                              <input
                                 className="mr-2 cursor-pointer"
                                 type="checkbox"
                                 checked={father.every(item => item.select)}
                                 onChange={
                                    (e) => {
                                       const check = e.target.checked
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
                                 checked={sons.every(item => item.select)}
                                 onChange={
                                    (e) => {
                                       const check = e.target.checked
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
                                 checked={states.every(item => item.select)}
                                 onChange={
                                    (e) => {
                                       const check = e.target.checked
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

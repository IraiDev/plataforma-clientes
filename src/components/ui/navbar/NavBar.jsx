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

let arrayTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

function NavBar({ onMultiLine, isMultiLine }) {

  const { logout, user } = useContext(Ticket)
  const [modalTicket, setModalTicket] = useState(false)
  const [modalFilter, setModalFilter] = useState(false)
  const [{ title, desc }, onChangeValues, reset] = useForm({ title: '', desc: '' })
  const [values, setValues] = useState({ email: '', phone: '' })
  const { email, phone } = values

  const onClose = () => {
    setModalTicket(false)
  }

  useEffect(() => {
    setValues({
      email: user.name,

    })
  }, [title])

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

      <Modal showModal={modalTicket} isBlur={false} onClose={() => setModalTicket(false)}
        className="max-w-4xl p-8">
        <h1 className="text-xl font-semibold capitalize inline">nuevo Ticket</h1>
        <p className="inline ml-2">a nombre de {user.name}</p>
        <div className="mt-5 grid gap-8 mb-2">
          <Select className="z-50" placeholder="Seleccione proyecto" />
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
              <p className="font-semibold">no hay archivo seleccionado</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className="capitalize cursor-pointer text-center bg-blue-500 hover:bg-blue-400 text-white transition duration-500 rounded-full py-2 px-4 font-semibold shadow-md"
                htmlFor="inputFile">
                <input className="hidden" type="file" id="inputFile" />
                Subir archivo
              </label>
              <Button
                className="bg-green-500 hover:bg-green-400 text-white rounded-full"
                shadow
                name="crear ticket" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Container className="w-full">
            <ul className="h-full overflow-y-auto">
              {
                arrayTest.map((item) => (
                  <li key={item}>
                    <input
                      key={item}
                      id={item}
                      className="mr-2"
                      type="checkbox" />
                    nombre
                  </li>
                ))
              }
            </ul>
          </Container>
          <Container className="w-full">
            <ul className="h-full overflow-y-auto">
              {
                arrayTest.map((item) => (
                  <li key={item}>
                    <input
                      key={item}
                      id={item}
                      className="mr-2"
                      type="checkbox" />
                    nombre
                  </li>
                ))
              }
            </ul>
          </Container>
          <Container className="w-full">
            <ul className="h-full overflow-y-auto">
              {
                arrayTest.map((item) => (
                  <li key={item}>
                    <input
                      key={item}
                      id={item}
                      className="mr-2"
                      type="checkbox" />
                    nombre
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
            name="aplicar" />
        </div>
      </Modal>
    </>
  )
}

export default NavBar

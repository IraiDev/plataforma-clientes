import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import loginIMG from '../../assets/img/login.jpg'
import logo from '../../assets/img/logo25x25.png'
import { Ticket } from '../../context/Ticket'
import { Ui } from '../../context/Ui'
import { Alert } from '../../helpers/alerts'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import Modal from '../ui/modal/Modal'
import { validateRUT } from 'validar-rut'

const LoginScreen = () => {

  const navigate = useNavigate()
  const { getUserPin, login } = useContext(Ticket)
  const { toggleLoading } = useContext(Ui)
  const [check, setCheck] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [{ pin, rut }, onChangeInput, reset] = useForm({ pin: '', rut: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    toggleLoading(true)
    await login({ pin })

    const lastPath = localStorage.getItem('lastPath-ticket') || '/'
    navigate(lastPath, {
      replace: true,
    })

    reset()
  }

  const onCloseModal = () => {
    setShowModal(false)
    reset()
  }

  const recoverPin = async () => {
    const r = validateRUT(rut)
    if (rut === '' || !r) {
      Alert({
        title: 'Atencion',
        content: 'El campo esta vacio o el RUT invalido, por favor verifiquelo y vuelva a intentarlo',
        showCancelButton: false,
        timer: 7000
      })
      return
    }

    toggleLoading(true)

    const { ok, response } = await getUserPin(rut, true)

    if (ok) {
      const { nombre, pin } = response
      Alert({
        title: nombre,
        icon: 'info',
        content: `Su pin es: <b>${pin}</b> </br> Le recomendamos guardarlo`,
        showCancelButton: false,
      })
      reset()
      setShowModal(false)
    }
    else {
      Alert({
        title: 'Atencion',
        icon: 'warn',
        content: 'El usuario no existe o formato del RUT es incorrecto, <b>recuerde los puntos y el guion</b> </br> ej: 12.345.678-9',
        showCancelButton: false,
        timer: 5000
      })
    }
  }

  return (
    <>
      <div className="h-screen w-full relative">
        <img className="absolute top-0 bottom-0 right-0 left-0 w-full h-screen" src={loginIMG} alt="fondo" />
        <form
          onSubmit={onSubmit}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-10 bg-white rounded-lg shadow-lg w-96">
          <div className="flex items-center justify-center mb-10">
            <img src={logo} alt="logo" />
            <h1 className="text-xl capitalize font-semibold ml-2">Plataforma clientes</h1>
          </div>
          <Input
            field="ingrese su PIN"
            type={check ? 'text' : 'password'}
            className="focus:border-blue-500"
            name="pin"
            value={pin}
            onChange={onChangeInput} />
          <label className="block mx-auto w-max capitalize text-sm mt-2" htmlFor="checkField">
            <input
              id="checkField"
              className="mr-2 focus:outline-none"
              type="checkbox"
              checked={check}
              onChange={() => { setCheck(!check) }} />
            Mostrar campo
          </label>
          <p
            onClick={() => setShowModal(true)}
            className="w-max mx-auto my-4 font-semibold text-blue-500 hover:bg-blue-50 cursor-pointer px-2 rounded-full transition duration-500">
            ¿Olvido su PIN?
          </p>
          <Button
            className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white rounded-full"
            block
            shadow
            name="iniciar sesion"
          />
        </form>
      </div>

      <Modal showModal={showModal} isBlur={false} onClose={onCloseModal}
        className="w-96 p-8">
        <h1 className="text-xl mb-7">Recuperar PIN</h1>
        <p className="text-sm">Ingrese su run con puntos y guion</p>
        <Input
          name="rut"
          value={rut}
          onChange={onChangeInput}
        />
        <div className="flex justify-between items-center mt-7">
          <Button
            className="rounded-full border border-red-400 hover:bg-red-400 text-red-500 hover:text-white"
            name="cancelar"
            shadow
            onClick={onCloseModal} />
          <Button
            className="rounded-full bg-blue-400 hover:bg-blue-500 text-white"
            name="recuperar"
            shadow
            onClick={recoverPin}
          />
        </div>
      </Modal>
    </>
  )
}

export default LoginScreen

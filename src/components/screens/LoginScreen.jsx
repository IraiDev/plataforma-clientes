import React, { useState } from 'react'
import loginIMG from '../../assets/img/login.jpg'
import logo from '../../assets/img/logo25x25.png'
import { useForm } from '../../hooks/useForm'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'

function LoginScreen({ onLogin }) {

  const [check, setCheck] = useState(false)
  const [{ input }, onChangeInput, reset] = useForm({ input: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    onLogin(input, reset)
  }

  return (
    <div className="h-screen w-full relative">
      <img className="absolute top-0 bottom-0 right-0 left-0 w-full h-screen" src={loginIMG} alt="fondo" />
      <form
        onSubmit={onSubmit}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-10 bg-white rounded-lg shadow-lg w-96">
        <div className="flex items-center justify-center mb-16">
          <img src={logo} alt="logo" />
          <h1 className="text-xl capitalize font-semibold ml-2">Plataforma clientes</h1>
        </div>
        <Input
          field="ingrese su PIN"
          type={check ? 'text' : 'password'}
          className="focus:border-blue-500"
          name="input"
          value={input}
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
        <Button
          className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white rounded-full mt-10"
          block
          shadow
          name="iniciar sesion"
        />
      </form>
    </div>
  )
}

export default LoginScreen

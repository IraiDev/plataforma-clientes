import React, { useContext } from 'react'
import { Ui } from '../../../context/Ui'

function NavMenu({ children }) {

  const { showMenu } = useContext(Ui)

  return (
    <div
      className={
        `w-80 h-auto p-8 rounded-md border fixed bg-white top-0 left-0 z-50 shadow-md mt-20 grid gap-5
        lg:hidden
        animate__animated animate__faster
        ${showMenu ? 'block animate__slideInLeft' : 'animate__slideOutLeft'}
        `}>
      {children}
    </div>
  )
}

export default NavMenu

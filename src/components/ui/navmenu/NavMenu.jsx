import React, { useContext } from 'react'
import { Ui } from '../../../context/Ui'

function NavMenu({ children, }) {

  const { showMenu, toggleNavMenu } = useContext(Ui)

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-40 lg:hidden
      animate__animated animate__faster
      ${showMenu === null && 'hidden'}
      ${showMenu ? 'block animate__slideInLeft' : 'animate__slideOutLeft'}`}>
      <div
        onClick={() => toggleNavMenu()}
        className="bg-transparent fixed top-0 bottom-0 left-0 right-0 z-40" />
      <div className="w-80 h-auto p-8 rounded-md border fixed bg-white top-0 left-0 z-50 shadow-md mt-20 grid gap-5" >
        {children}
      </div>
    </div>
  )
}

export default NavMenu

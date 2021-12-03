import React, { useState } from 'react'

export const Ui = React.createContext()

function UiProvider({ children }) {

  const [loading, toggleLoading] = useState(false)
  const [showMenu, setMenu] = useState(false)

  const toggleNavMenu = () => {
    setMenu(!showMenu)
  }

  const value = {
    toggleLoading,
    toggleNavMenu,
    showMenu,
    loading
  }

  return (
    <Ui.Provider value={value}>
      {children}
    </Ui.Provider>
  )
}

export default UiProvider

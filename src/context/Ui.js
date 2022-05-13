import React, { useState } from 'react'

export const Ui = React.createContext()

function UiProvider({ children }) {

  const [loading, toggleLoading] = useState(false)
  const [showMenu, setMenu] = useState(null)
  const [refreshTickets, setRefreshTickets] = useState(null)

  const toggleNavMenu = () => {
    setMenu(!showMenu)
  }

  const handleRefreshTickets = () => {
    setRefreshTickets(Math.random())
  }

  const value = {
    toggleLoading,
    toggleNavMenu,
    handleRefreshTickets,
    showMenu,
    loading,
    refreshTickets
  }

  return (
    <Ui.Provider value={value}>
      {children}
    </Ui.Provider>
  )
}

export default UiProvider

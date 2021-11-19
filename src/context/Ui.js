import React, { useState } from 'react'

export const Ui = React.createContext()

function UiProvider({ children }) {

  const [loading, toggleLoading] = useState(false)

  const value = {
    toggleLoading,
    loading
  }

  return (
    <Ui.Provider value={value}>
      {children}
    </Ui.Provider>
  )
}

export default UiProvider

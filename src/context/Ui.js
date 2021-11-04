import React from 'react'

const UiContext = React.createContext()

function Ui({ children }) {

  const value = {

  }

  return (
    <UiContext.Provider value={value}>
      {children}
    </UiContext.Provider>
  )
}

export default Ui

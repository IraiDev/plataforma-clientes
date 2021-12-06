import React, { useContext, useEffect } from 'react'
import Loading from './components/ui/loading/Loading'
import { Ticket } from './context/Ticket'
import { Ui } from './context/Ui'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  const { validateSession } = useContext(Ticket)
  const { toggleLoading, loading } = useContext(Ui)

  useEffect(() => {
    if (localStorage.getItem('ticketToken') !== null) {
      const reNew = async () => {
        toggleLoading(true)
        await validateSession()
      }
      reNew()
    }
  }, [])

  return (
    <>
      <AppRoutes />
      <Loading show={loading} />
    </>
  )
}

export default App
